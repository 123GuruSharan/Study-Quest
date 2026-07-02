import { supabase } from "@/lib/supabaseClient";

export interface SyncQueueItem {
  id: string;
  table: string;
  action: "upsert" | "delete";
  payload: any;
  timestamp: string;
}

function isNetworkError(err: any): boolean {
  if (!err) return false;
  const errMsg = String(err.message || err.details || err).toLowerCase();
  return (
    err instanceof TypeError ||
    errMsg.includes("failed to fetch") ||
    errMsg.includes("network error") ||
    errMsg.includes("load failed") ||
    errMsg.includes("aborted")
  );
}

export async function safeDbWrite(
  table: string,
  id: string,
  payload: any,
  action: "upsert" | "delete" = "upsert"
) {
  try {
    const isOfflineStatus = typeof window !== "undefined" && !navigator.onLine;
    if (isOfflineStatus) {
      throw new Error("Offline status detected");
    }
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;

    const upsertPayload: any = {
      ...payload,
      updated_at: new Date().toISOString(),
    };
    if (table !== "profiles") {
      upsertPayload.user_id = user.id;
    }

    const { error } = action === "upsert"
      ? await supabase.from(table).upsert(upsertPayload)
      : await supabase.from(table).delete().eq("id", id);

    if (error) {
      console.error(`[safeDbWrite] Supabase write error for table ${table}:`, error);
      throw error;
    }
  } catch (err) {
    console.warn(`Safe-write failed for ${table}:${id}. Error details:`, err);
    
    const isOffline = typeof window !== "undefined" && !navigator.onLine;
    const isNetErr = isNetworkError(err);

    if (isOffline || isNetErr) {
      console.warn(`Network offline or fetch failed. Queueing changes for ${table}:${id} for background sync.`);
      syncSystem.addToQueue({
        id,
        table,
        action,
        payload,
      });
    } else {
      // Re-throw database/schema/auth errors so stores and developers see them
      throw err;
    }
  }
}

export class SyncSystem {
  private queueKey = "studyquest_sync_queue";

  init() {
    if (typeof window === "undefined") return;

    window.addEventListener("online", () => {
      this.syncOfflineData();
    });
  }

  getQueue(): SyncQueueItem[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(this.queueKey);
    return data ? JSON.parse(data) : [];
  }

  saveQueue(queue: SyncQueueItem[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.queueKey, JSON.stringify(queue));
  }

  addToQueue(item: Omit<SyncQueueItem, "timestamp">) {
    const queue = this.getQueue();
    const newItem = { ...item, timestamp: new Date().toISOString() };
    
    // De-duplicate updates to optimize queue flushes
    const filtered = queue.filter(
      (q) => !(q.id === item.id && q.table === item.table)
    );
    
    this.saveQueue([...filtered, newItem]);
  }

  async syncOfflineData() {
    if (typeof window !== "undefined" && !navigator.onLine) return;

    const queue = this.getQueue();
    if (queue.length === 0) return;

    console.log(`Reconnecting: Flushing ${queue.length} offline operations...`);

    const remainingItems: SyncQueueItem[] = [];

    for (const item of queue) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) {
          remainingItems.push(item);
          continue;
        }

        if (item.action === "upsert") {
          // Conflict Resolution: Newest timestamp wins
          const { data: serverRecord } = await supabase
            .from(item.table)
            .select("updated_at")
            .eq("id", item.id)
            .maybeSingle();

          if (serverRecord && serverRecord.updated_at) {
            const serverTime = new Date(serverRecord.updated_at).getTime();
            const localTime = new Date(item.timestamp).getTime();
            
            if (serverTime > localTime) {
              console.log(`Conflict resolved: Server record is newer for ${item.table}:${item.id}. Ignoring local edit.`);
              continue;
            }
          }

          const upsertPayload: any = {
            ...item.payload,
            updated_at: new Date().toISOString(),
          };
          if (item.table !== "profiles") {
            upsertPayload.user_id = user.id;
          }

          const { error } = await supabase.from(item.table).upsert(upsertPayload);

          if (error) throw error;
        } else if (item.action === "delete") {
          const { error } = await supabase
            .from(item.table)
            .delete()
            .eq("id", item.id);

          if (error) throw error;
        }
      } catch (err) {
        console.error("Failed to sync offline item:", err);
        remainingItems.push(item);
      }
    }

    this.saveQueue(remainingItems);
    
    if (remainingItems.length === 0) {
      console.log("Offline sync completed successfully!");
    }
  }
}

export const syncSystem = new SyncSystem();

export interface IStorage {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export class LocalStorageProvider implements IStorage {
  async getItem<T>(key: string): Promise<T | null> {
    if (typeof window === "undefined") return null;
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  async removeItem(key: string): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  }
}

export const storageProvider: IStorage = new LocalStorageProvider();

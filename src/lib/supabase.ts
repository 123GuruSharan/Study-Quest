import { createClient } from "@supabase/supabase-js";
import { envConfigStatus } from "@/config/env";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Double check variables presence here to prevent creating client with placeholder fallbacks.
// Throw descriptive developer error to fail fast if envConfigStatus didn't throw earlier.
if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    `StudyQuest Supabase Client Initialization Error\n\nMissing variables:\n` +
    `${!supabaseUrl ? "  - NEXT_PUBLIC_SUPABASE_URL\n" : ""}` +
    `${!supabasePublishableKey ? "  - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY\n" : ""}` +
    `\nCreate a .env.local file in the project root and restart the development server.`
  );
}

// Reusable singleton client. Never initialize multiple clients.
// Note: Environment variables are loaded only when Next.js starts.
// After editing .env.local, developers must restart their development server (npm run dev).
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
export default supabase;

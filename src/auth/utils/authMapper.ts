import { User } from "@supabase/supabase-js";
import { AuthenticatedUser } from "../types/auth";

/**
 * Maps a Supabase Auth User object to the clean domain model AuthenticatedUser.
 * This decouples the UI and stores from Supabase-specific structures.
 */
export function mapSupabaseUser(supabaseUser: User | null): AuthenticatedUser | null {
  if (!supabaseUser) return null;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    emailConfirmed: !!supabaseUser.email_confirmed_at,
    isAuthenticated: true,
  };
}

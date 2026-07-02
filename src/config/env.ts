export interface EnvValidation {
  valid: boolean;
  missingVariables: string[];
}

/**
 * Prints clear developer instructions in the console listing missing variables,
 * expected file path, and example structure.
 * 
 * NOTE: Environment variables are loaded only when Next.js starts.
 * After editing .env.local, developers must restart their development server (npm run dev).
 */
export function printDeveloperInstructions(missing: string[]): string {
  const instructions = `
================================================================================
⚠️  StudyQuest Initialization Error
================================================================================
Missing environment variables:
${missing.map((v) => `  - ${v}`).join("\n")}

Expected File Location:
  Project Root (d:\\Study-Games\\.env.local)

Example .env.local structure:
  NEXT_PUBLIC_SUPABASE_URL=https://ktjxxjvzmejqlxqsehkx.supabase.co
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ei0B0ip_6oDziBuIy96gDg_PXrTmn6x

DEVELOPER ACTION REQUIRED:
  1. Create or edit .env.local in the project root directory.
  2. Populate the variables above.
  3. RESTART your development server (npm run dev) as variables are loaded on start.
================================================================================
`;
  console.error(instructions);
  return instructions;
}

export function validateEnv(): EnvValidation {
  const missingVariables: string[] = [];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    missingVariables.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    missingVariables.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  const valid = missingVariables.length === 0;

  if (!valid) {
    printDeveloperInstructions(missingVariables);
    throw new Error(
      `StudyQuest Initialization Error\n\nMissing environment variables:\n${missingVariables.join(
        "\n"
      )}\n\nCreate a .env.local file in the project root and restart the development server.`
    );
  }

  return {
    valid,
    missingVariables,
  };
}

// Perform validation on configuration load. Safe to run.
export const envConfigStatus = validateEnv();

/**
 * Formatted development diagnostics logger for critical gameplay mutations.
 */
export function logGameplayMutation(details: {
  mutation: string;
  previousState: any;
  supabasePayload?: any;
  dbResponse?: any;
  finalState: any;
}) {
  if (process.env.NODE_ENV === "production") return;

  console.log(`%c[DIAGNOSTICS] Gameplay Mutation: ${details.mutation}`, "color: #3b82f6; font-weight: bold; font-size: 11px;");
  console.log("%cPrevious Store State:", "color: #64748b; font-weight: bold;");
  console.log(details.previousState);
  
  if (details.supabasePayload) {
    console.log("%cSupabase Payload:", "color: #f59e0b; font-weight: bold;");
    console.log(details.supabasePayload);
  }
  
  if (details.dbResponse) {
    console.log("%cDatabase Response:", "color: #10b981; font-weight: bold;");
    console.log(details.dbResponse);
  }
  
  console.log("%cFinal Store State:", "color: #3b82f6; font-weight: bold;");
  console.log(details.finalState);
  console.log("%c---------------------------------------------", "color: #cbd5e1;");
}

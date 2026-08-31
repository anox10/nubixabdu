const { createClient } = require("@supabase/supabase-js");

let SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Normalize URL in case user pasted REST endpoint with /rest/v1
if (SUPABASE_URL && SUPABASE_URL.includes("/rest/v1")) {
  SUPABASE_URL = SUPABASE_URL.split("/rest/v1")[0].replace(/\/+$/, "");
}

const isConfigured =
  SUPABASE_URL &&
  SUPABASE_SERVICE_KEY &&
  SUPABASE_URL !== "YOUR_SUPABASE_PROJECT_URL" &&
  SUPABASE_SERVICE_KEY !== "YOUR_SUPABASE_SERVICE_ROLE_KEY";

if (!isConfigured) {
  console.warn("\n========================================================");
  console.warn("⚠️  CLINORA NOTICE: Supabase service role key missing in backend/.env!");
  console.warn("👉 Project URL is set to:", SUPABASE_URL || "None");
  console.warn("👉 Please enter SUPABASE_SERVICE_KEY in backend/.env");
  console.warn("========================================================\n");
}

// Admin client (service role) — bypasses RLS, only used server-side
const supabase = createClient(
  isConfigured ? SUPABASE_URL : (SUPABASE_URL || "https://placeholder.supabase.co"),
  isConfigured ? SUPABASE_SERVICE_KEY : "placeholder-key",
  {
    auth: { autoRefreshToken: false, persistSession: false }
  }
);

module.exports = supabase;

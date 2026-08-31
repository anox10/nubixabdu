const supabase = require("../db/supabase");

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
function isValidGmail(email) {
  if (!email || typeof email !== "string") return false;
  return GMAIL_REGEX.test(email.trim());
}

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication required. Please sign in." });
  }

  try {
    // Verify the Supabase JWT and get the user
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ error: "Session expired or invalid token." });
    }

    // Fetch the profile row for role / is_active / is_approved
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("id, name, email, role, is_active, is_approved")
      .eq("id", user.id)
      .single();

    if (profileErr || !profile) {
      return res.status(401).json({ error: "User account not found." });
    }

    if (!profile.is_active) {
      return res.status(403).json({ error: "Your account has been deactivated by hospital administration." });
    }

    req.user = profile;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ error: "Authentication service error." });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Authentication required." });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access forbidden: requires role [${allowedRoles.join(", ")}]. You are [${req.user.role}].`
      });
    }
    next();
  };
}

function requireApprovedDoctor(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Authentication required." });
  if (req.user.role === "doctor" && req.user.is_approved === false) {
    return res.status(403).json({
      error: "Your doctor profile is pending hospital administrator verification."
    });
  }
  next();
}

module.exports = { isValidGmail, authenticateToken, requireRole, requireApprovedDoctor };

const express = require("express");
const router = express.Router();
const supabase = require("../db/supabase");
const { isValidGmail, authenticateToken } = require("../middleware/auth");

// POST /api/auth/register
// The frontend calls Supabase Auth directly for login/signup.
// This endpoint is kept for server-side registration (used by seed script / admin).
// Normal signup flow: frontend -> Supabase Auth -> trigger creates profiles row
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, specialization, bio, experience_years } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Name, email, password, and role are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidGmail(normalizedEmail)) {
      return res.status(400).json({
        error: "Registration requires a valid Gmail address (e.g. yourname@gmail.com)."
      });
    }

    if (!["patient", "doctor"].includes(role)) {
      return res.status(400).json({ error: "Please choose either Patient or Doctor role." });
    }

    const isDoctor = role === "doctor";

    // Create the Supabase Auth user — trigger auto-creates profiles row
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,  // skip email confirmation for hackathon
      user_metadata: { name: name.trim(), role }
    });

    if (authErr) {
      if (authErr.message.includes("already registered")) {
        return res.status(400).json({ error: "An account with this Gmail address already exists." });
      }
      return res.status(400).json({ error: authErr.message });
    }

    const userId = authData.user.id;

    // Update profile to ensure correctness (trigger may race)
    await supabase.from("profiles").upsert({
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      role,
      is_active: true,
      is_approved: !isDoctor
    });

    // If doctor: create doctor_profiles + default availability
    if (isDoctor) {
      await supabase.from("doctor_profiles").upsert({
        user_id: userId,
        specialization: specialization || "General Medicine",
        bio: bio || "Practicing clinical physician at CLINORA.",
        experience_years: Number(experience_years) || 1,
        consultation_fee: 500
      });

      const defaultDays = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
      const avRows = defaultDays.map(day => ({
        doctor_id: userId,
        day_of_week: day,
        start_time: "09:00",
        end_time: "17:00"
      }));
      await supabase.from("availability").upsert(avRows, { onConflict: "doctor_id,day_of_week" });
    }

    // Sign the user in to get a session token
    const { data: session, error: signInErr } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: normalizedEmail
    });

    // Return profile (frontend will sign in via Supabase Auth client directly)
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    res.status(201).json({
      message: isDoctor
        ? "Doctor registration submitted! Your account is awaiting hospital admin approval."
        : "Patient account created successfully.",
      user: profile
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error during registration." });
  }
});

// POST /api/auth/login
// Login is handled entirely by Supabase Auth on the frontend.
// This endpoint just validates format and returns a friendly error if needed.
// The frontend calls supabase.auth.signInWithPassword() directly.
router.post("/login", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });
  const normalizedEmail = email.trim().toLowerCase();
  if (!isValidGmail(normalizedEmail)) {
    return res.status(400).json({
      error: "Please sign in with a valid Gmail address (e.g. yourname@gmail.com)."
    });
  }
  // Actual auth happens on the frontend via Supabase SDK
  res.json({ message: "Use Supabase Auth client for login." });
});

// GET /api/auth/me
router.get("/me", authenticateToken, async (req, res) => {
  try {
    let doctorProfile = null;
    if (req.user.role === "doctor") {
      const { data } = await supabase
        .from("doctor_profiles")
        .select("*")
        .eq("user_id", req.user.id)
        .single();
      doctorProfile = data || null;
    }

    res.json({ user: req.user, doctorProfile });
  } catch (err) {
    console.error("Error in /me:", err);
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
});

module.exports = router;

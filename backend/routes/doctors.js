const express = require("express");
const router = express.Router();
const supabase = require("../db/supabase");
const { authenticateToken, requireRole, requireApprovedDoctor } = require("../middleware/auth");

// ── Time helpers ──────────────────────────────────────────────
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}
function minutesToTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}
function generateSlots(startTime, endTime) {
  const start = timeToMinutes(startTime);
  const end   = timeToMinutes(endTime);
  const slots = [];
  for (let t = start; t + 30 <= end; t += 30) {
    slots.push(`${minutesToTime(t)} - ${minutesToTime(t + 30)}`);
  }
  return slots;
}

// GET /api/doctors - Approved + active doctors with filters
router.get("/", async (req, res) => {
  try {
    const { specialization, search } = req.query;

    const { data: doctors, error } = await supabase
      .from("profiles")
      .select("id, name, email, doctor_profiles(*), availability(*)")
      .eq("role", "doctor")
      .eq("is_active", true)
      .eq("is_approved", true);

    if (error) {
      console.error("Error fetching doctors:", error);
      return res.status(500).json({ error: "Failed to retrieve doctors list." });
    }

    let list = (doctors || []).map(u => {
      const profile = u.doctor_profiles || { specialization: "General Medicine", bio: "Practicing clinician at CLINORA.", experience_years: 5, consultation_fee: 500 };
      const avDays  = [...new Set((u.availability || []).map(a => a.day_of_week))];
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        specialization: profile.specialization,
        bio: profile.bio,
        experience_years: profile.experience_years,
        consultation_fee: profile.consultation_fee,
        availableDays: avDays,
        availabilityCount: (u.availability || []).length
      };
    });

    if (specialization && specialization !== "All") {
      list = list.filter(d => d.specialization.toLowerCase() === specialization.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.bio.toLowerCase().includes(q)
      );
    }

    res.json({ doctors: list });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ error: "Failed to retrieve doctors list." });
  }
});

// GET /api/doctors/availability/me
router.get("/availability/me", authenticateToken, requireRole("doctor"), requireApprovedDoctor, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("availability")
      .select("*")
      .eq("doctor_id", req.user.id)
      .order("day_of_week");
    if (error) return res.status(500).json({ error: "Failed to fetch availability." });
    res.json({ availability: data || [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch availability." });
  }
});

// POST /api/doctors/availability - Upsert availability slot
router.post("/availability", authenticateToken, requireRole("doctor"), requireApprovedDoctor, async (req, res) => {
  try {
    const { day_of_week, start_time, end_time } = req.body;
    if (!day_of_week || !start_time || !end_time) {
      return res.status(400).json({ error: "Day of week, start time, and end time are required." });
    }
    if (timeToMinutes(start_time) >= timeToMinutes(end_time)) {
      return res.status(400).json({ error: "Start time must be before end time." });
    }

    const { data, error } = await supabase
      .from("availability")
      .upsert({ doctor_id: req.user.id, day_of_week, start_time, end_time },
               { onConflict: "doctor_id,day_of_week" })
      .select()
      .single();

    if (error) return res.status(500).json({ error: "Failed to update availability." });
    res.json({ message: "Availability updated successfully.", availability: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to update availability." });
  }
});

// DELETE /api/doctors/availability/:id
router.delete("/availability/:id", authenticateToken, requireRole("doctor"), requireApprovedDoctor, async (req, res) => {
  try {
    const { data: item } = await supabase
      .from("availability")
      .select("doctor_id")
      .eq("id", req.params.id)
      .single();

    if (!item) return res.status(404).json({ error: "Availability entry not found." });
    if (item.doctor_id !== req.user.id) return res.status(403).json({ error: "Not authorized to delete this availability." });

    await supabase.from("availability").delete().eq("id", req.params.id);
    res.json({ message: "Availability schedule removed successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete availability schedule." });
  }
});

// PUT /api/doctors/profile - Doctor updates profile
router.put("/profile", authenticateToken, requireRole("doctor"), async (req, res) => {
  try {
    const { name, specialization, bio, experience_years } = req.body;

    if (name && name.trim()) {
      await supabase.from("profiles").update({ name: name.trim() }).eq("id", req.user.id);
    }

    const updates = {};
    if (specialization) updates.specialization = specialization;
    if (bio !== undefined) updates.bio = bio;
    if (experience_years !== undefined) updates.experience_years = Number(experience_years);

    const { data: profile, error } = await supabase
      .from("doctor_profiles")
      .upsert({ user_id: req.user.id, ...updates }, { onConflict: "user_id" })
      .select()
      .single();

    if (error) return res.status(500).json({ error: "Failed to update profile." });

    const { data: updatedUser } = await supabase
      .from("profiles")
      .select("id, name, email, role, is_active, is_approved")
      .eq("id", req.user.id)
      .single();

    res.json({ message: "Profile updated successfully.", user: updatedUser, doctorProfile: profile });
  } catch (err) {
    console.error("Error updating doctor profile:", err);
    res.status(500).json({ error: "Failed to update profile." });
  }
});

// GET /api/doctors/:id - Specific doctor details
router.get("/:id", async (req, res) => {
  try {
    const { data: user } = await supabase
      .from("profiles")
      .select("id, name, email, is_active, is_approved, role")
      .eq("id", req.params.id)
      .single();

    if (!user || user.role !== "doctor") return res.status(404).json({ error: "Doctor not found." });

    const { data: profile } = await supabase
      .from("doctor_profiles")
      .select("*")
      .eq("user_id", req.params.id)
      .single();

    const { data: availability } = await supabase
      .from("availability")
      .select("*")
      .eq("doctor_id", req.params.id)
      .order("day_of_week");

    res.json({
      doctor: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_active: user.is_active,
        is_approved: user.is_approved,
        specialization: profile?.specialization || "General Medicine",
        bio: profile?.bio || "Practicing clinician at CLINORA.",
        experience_years: profile?.experience_years || 5,
        consultation_fee: profile?.consultation_fee || 500,
        availability: availability || []
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve doctor details." });
  }
});

// GET /api/doctors/:id/available-slots?date=YYYY-MM-DD
router.get("/:id/available-slots", async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ error: "Query parameter \"date\" (YYYY-MM-DD) is required." });

    const { data: doctor } = await supabase
      .from("profiles")
      .select("name, role")
      .eq("id", id)
      .single();

    if (!doctor || doctor.role !== "doctor") return res.status(404).json({ error: "Doctor not found." });

    const [year, month, day] = date.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const dayName = daysOfWeek[dateObj.getDay()];

    const { data: docAvailability } = await supabase
      .from("availability")
      .select("*")
      .eq("doctor_id", id)
      .ilike("day_of_week", dayName);

    if (!docAvailability || docAvailability.length === 0) {
      return res.json({ date, dayOfWeek: dayName, isAvailable: false, message: `${doctor.name} has no consultation hours on ${dayName}s.`, slots: [] });
    }

    let allSlots = [];
    docAvailability.forEach(schedule => {
      allSlots.push(...generateSlots(schedule.start_time, schedule.end_time));
    });
    allSlots = [...new Set(allSlots)].sort();

    // Get booked slots for this date
    const { data: existing } = await supabase
      .from("appointments")
      .select("time_slot")
      .eq("doctor_id", id)
      .eq("date", date)
      .in("status", ["pending","confirmed"]);

    const bookedSlots = new Set((existing || []).map(a => a.time_slot));

    const slotDetails = allSlots.map(slot => ({ slot, isBooked: bookedSlots.has(slot) }));

    res.json({
      date,
      dayOfWeek: dayName,
      isAvailable: true,
      totalSlots: slotDetails.length,
      availableSlotsCount: slotDetails.filter(s => !s.isBooked).length,
      slots: slotDetails
    });
  } catch (err) {
    console.error("Error generating slots:", err);
    res.status(500).json({ error: "Failed to compute available slots." });
  }
});

module.exports = router;

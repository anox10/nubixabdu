const express = require("express");
const router = express.Router();
const supabase = require("../db/supabase");
const { authenticateToken, requireRole } = require("../middleware/auth");

// POST /api/appointments - Patient books an appointment
router.post("/", authenticateToken, requireRole("patient"), async (req, res) => {
  try {
    const { doctor_id, case_id, date, time_slot, payment_method, notes } = req.body;

    if (!doctor_id || !date || !time_slot) {
      return res.status(400).json({ error: "Doctor ID, date (YYYY-MM-DD), and time slot are required." });
    }

    // Verify doctor exists, is active, and is approved
    const { data: doctor } = await supabase
      .from("profiles")
      .select("id, name, is_active, is_approved, role")
      .eq("id", doctor_id)
      .single();

    if (!doctor || doctor.role !== "doctor" || !doctor.is_active || !doctor.is_approved) {
      return res.status(400).json({ error: "Selected doctor is not available for booking." });
    }

    // Get doctor specialization
    const { data: doctorProfile } = await supabase
      .from("doctor_profiles")
      .select("specialization")
      .eq("user_id", doctor_id)
      .single();

    const specialization = doctorProfile ? doctorProfile.specialization : "General Medicine";

    // Resolve case_id — if none provided, use patient's latest case
    let attachedCaseId = case_id || null;
    if (!attachedCaseId) {
      const { data: latestCase } = await supabase
        .from("cases")
        .select("id")
        .eq("patient_id", req.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (latestCase) attachedCaseId = latestCase.id;
    }

    const assignedPaymentMethod = payment_method === "online" ? "online" : "pay_at_reception";
    const assignedPaymentStatus = assignedPaymentMethod === "online" ? "paid" : "pending";

    // Insert — unique index on (doctor_id, date, time_slot) WHERE status IN ('pending','confirmed')
    // will catch double-bookings at the database level
    const { data: newAppointment, error } = await supabase
      .from("appointments")
      .insert({
        patient_id: req.user.id,
        patient_name: req.user.name,
        doctor_id: doctor.id,
        doctor_name: doctor.name,
        specialization,
        case_id: attachedCaseId,
        date,
        time_slot,
        status: "pending",
        payment_method: assignedPaymentMethod,
        payment_status: assignedPaymentStatus,
        notes: (notes || "").trim()
      })
      .select()
      .single();

    if (error) {
      // 23505 = unique_violation — double booking
      if (error.code === "23505") {
        return res.status(409).json({ error: "This time slot is already reserved. Please select another slot." });
      }
      console.error("Error booking appointment:", error);
      return res.status(500).json({ error: "Failed to create appointment." });
    }

    res.status(201).json({
      message: assignedPaymentMethod === "online"
        ? "Appointment booked & online payment confirmed! Awaiting doctor confirmation."
        : "Appointment booked! Pay at hospital reception upon visit.",
      appointment: newAppointment
    });
  } catch (err) {
    console.error("Error booking appointment:", err);
    res.status(500).json({ error: "Failed to create appointment." });
  }
});

// GET /api/appointments/my - Get appointments with linked cases
router.get("/my", authenticateToken, async (req, res) => {
  try {
    let query = supabase
      .from("appointments")
      .select("*, case:cases(*)")
      .order("date", { ascending: false })
      .order("time_slot", { ascending: true });

    if (req.user.role === "patient") {
      query = query.eq("patient_id", req.user.id);
    } else if (req.user.role === "doctor") {
      query = query.eq("doctor_id", req.user.id);
    }
    // admin gets all (no filter)

    const { data: appointments, error } = await query;

    if (error) {
      console.error("Error fetching appointments:", error);
      return res.status(500).json({ error: "Failed to retrieve appointments." });
    }

    res.json({ appointments: appointments || [] });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Failed to retrieve appointments." });
  }
});

// PATCH /api/appointments/:id/status - Update appointment status
router.patch("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled", "no_show"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`
      });
    }

    const { data: apt } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", id)
      .single();

    if (!apt) return res.status(404).json({ error: "Appointment not found." });

    if (req.user.role === "patient") {
      if (apt.patient_id !== req.user.id) return res.status(403).json({ error: "Unauthorized to modify this appointment." });
      if (status !== "cancelled") return res.status(403).json({ error: "Patients can only cancel appointments." });
      if (apt.status === "completed" || apt.status === "cancelled") {
        return res.status(400).json({ error: `Cannot cancel an appointment that is already ${apt.status}.` });
      }
    }

    if (req.user.role === "doctor" && apt.doctor_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to modify another doctor's appointment." });
    }

    const updates = { status, updated_at: new Date().toISOString() };
    if (notes !== undefined) updates.notes = notes;

    const { data: updated, error } = await supabase
      .from("appointments")
      .update(updates)
      .eq("id", id)
      .select("*, case:cases(*)")
      .single();

    if (error) return res.status(500).json({ error: "Failed to update appointment status." });

    res.json({ message: `Appointment marked as ${status}.`, appointment: updated });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ error: "Failed to update appointment status." });
  }
});

module.exports = router;

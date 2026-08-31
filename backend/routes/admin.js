const express = require("express");
const router = express.Router();
const supabase = require("../db/supabase");
const { authenticateToken, requireRole } = require("../middleware/auth");

router.use(authenticateToken, requireRole("admin"));

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const [
      { data: users },
      { data: appointments },
      { data: specializations },
      { data: reports }
    ] = await Promise.all([
      supabase.from("profiles").select("role, is_approved"),
      supabase.from("appointments").select("status, payment_method, payment_status, date, created_at"),
      supabase.from("specializations").select("id"),
      supabase.from("reports").select("status")
    ]);

    const allUsers        = users || [];
    const allAppointments = appointments || [];

    const totalPatients    = allUsers.filter(u => u.role === "patient").length;
    const allDoctors       = allUsers.filter(u => u.role === "doctor");
    const approvedDoctors  = allDoctors.filter(u => u.is_approved).length;
    const pendingDoctors   = allDoctors.filter(u => !u.is_approved).length;

    const now         = new Date();
    const oneWeekAgo  = new Date(now); oneWeekAgo.setDate(now.getDate() - 7);
    const oneWeekAhead= new Date(now); oneWeekAhead.setDate(now.getDate() + 7);

    const appointmentsThisWeek = allAppointments.filter(a => {
      const d = new Date(`${a.date}T12:00:00`);
      return d >= oneWeekAgo && d <= oneWeekAhead;
    }).length;

    res.json({
      stats: {
        totalPatients,
        totalDoctors:          allDoctors.length,
        approvedDoctors,
        pendingDoctors,
        totalAppointments:     allAppointments.length,
        pendingAppointments:   allAppointments.filter(a => a.status === "pending").length,
        confirmedAppointments: allAppointments.filter(a => a.status === "confirmed").length,
        completedAppointments: allAppointments.filter(a => a.status === "completed").length,
        cancelledAppointments: allAppointments.filter(a => a.status === "cancelled").length,
        appointmentsThisWeek,
        onlinePaymentsCount:   allAppointments.filter(a => a.payment_method === "online").length,
        receptionPaymentsCount:allAppointments.filter(a => a.payment_method === "pay_at_reception").length,
        paidAppointmentsCount: allAppointments.filter(a => a.payment_status === "paid").length,
        pendingPaymentsCount:  allAppointments.filter(a => a.payment_status === "pending").length,
        totalSpecializations:  (specializations || []).length,
        openReports:           (reports || []).filter(r => r.status === "open").length
      }
    });
  } catch (err) {
    console.error("Error computing admin stats:", err);
    res.status(500).json({ error: "Failed to compute dashboard metrics." });
  }
});

// GET /api/admin/doctors/pending
router.get("/doctors/pending", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, role, is_active, is_approved, created_at, doctor_profiles(*)")
      .eq("role", "doctor")
      .eq("is_approved", false);

    if (error) return res.status(500).json({ error: "Failed to fetch pending doctors." });

    const list = (data || []).map(u => ({
      id: u.id, name: u.name, email: u.email, role: u.role,
      is_active: u.is_active, is_approved: u.is_approved, created_at: u.created_at,
      specialization: u.doctor_profiles?.specialization || "General Medicine",
      bio: u.doctor_profiles?.bio || "",
      experience_years: u.doctor_profiles?.experience_years || 1
    }));

    res.json({ pendingDoctors: list });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending doctors." });
  }
});

// PATCH /api/admin/doctors/:id/approve
router.patch("/doctors/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    const { data: check } = await supabase.from("profiles").select("role, name").eq("id", id).single();
    if (!check || check.role !== "doctor") return res.status(404).json({ error: "Doctor record not found." });

    const { data: updated, error } = await supabase
      .from("profiles")
      .update({ is_approved: is_approved !== false })
      .eq("id", id)
      .select("id, name, email, role, is_active, is_approved")
      .single();

    if (error) return res.status(500).json({ error: "Failed to update doctor approval status." });

    res.json({
      message: updated.is_approved
        ? `Dr. ${updated.name} has been approved.`
        : `Dr. ${updated.name} approval has been revoked.`,
      doctor: updated
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update doctor approval status." });
  }
});

// GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const { role } = req.query;

    let query = supabase
      .from("profiles")
      .select("id, name, email, role, is_active, is_approved, created_at, doctor_profiles(*)")
      .order("created_at", { ascending: false });

    if (role && role !== "all") query = query.eq("role", role);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: "Failed to fetch users." });

    const sanitized = (data || []).map(u => ({
      id: u.id, name: u.name, email: u.email, role: u.role,
      is_active: u.is_active, is_approved: u.is_approved, created_at: u.created_at,
      doctorProfile: u.doctor_profiles || null
    }));

    res.json({ users: sanitized });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

// PATCH /api/admin/users/:id/toggle-active
router.patch("/users/:id/toggle-active", async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ error: "You cannot deactivate your own admin account." });
    }

    const { data: existing } = await supabase.from("profiles").select("name, is_active").eq("id", id).single();
    if (!existing) return res.status(404).json({ error: "User not found." });

    const { data: updated, error } = await supabase
      .from("profiles")
      .update({ is_active: !existing.is_active })
      .eq("id", id)
      .select("id, name, email, role, is_active, is_approved")
      .single();

    if (error) return res.status(500).json({ error: "Failed to update user active status." });

    res.json({
      message: `Account for ${updated.name} is now ${updated.is_active ? "Active" : "Disabled"}.`,
      user: updated
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user active status." });
  }
});

// GET /api/admin/appointments
router.get("/appointments", async (req, res) => {
  try {
    const { status, doctor_id, payment_method, date } = req.query;

    let query = supabase
      .from("appointments")
      .select("*, case:cases(*)")
      .order("date", { ascending: false });

    if (status && status !== "all")             query = query.eq("status", status);
    if (doctor_id && doctor_id !== "all")       query = query.eq("doctor_id", doctor_id);
    if (payment_method && payment_method !== "all") query = query.eq("payment_method", payment_method);
    if (date)                                   query = query.eq("date", date);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: "Failed to retrieve master appointments." });

    res.json({ appointments: data || [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve master appointments." });
  }
});

// GET /api/admin/reports
router.get("/reports", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: "Failed to retrieve reports." });
    res.json({ reports: data || [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve reports." });
  }
});

// PATCH /api/admin/reports/:id/resolve
router.patch("/reports/:id/resolve", async (req, res) => {
  try {
    const { data: existing } = await supabase.from("reports").select("status").eq("id", req.params.id).single();
    if (!existing) return res.status(404).json({ error: "Report not found." });

    const nextStatus = existing.status === "resolved" ? "open" : "resolved";
    const { data: updated, error } = await supabase
      .from("reports")
      .update({ status: nextStatus })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: "Failed to update report status." });

    res.json({ message: `Report marked as ${nextStatus}.`, report: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update report status." });
  }
});

module.exports = router;

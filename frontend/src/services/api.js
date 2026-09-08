import { supabase } from "../lib/supabase";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function getHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  const headers = { "Content-Type": "application/json" };
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }
  return headers;
}

// Helper: time utilities for slot generation
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}
function minutesToTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function generateSlots(startTime, endTime) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const slots = [];
  for (let t = start; t + 30 <= end; t += 30) {
    slots.push(`${minutesToTime(t)} - ${minutesToTime(t + 30)}`);
  }
  return slots;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = await getHeaders();
  const config = {
    ...options,
    headers: { ...headers, ...options.headers }
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || `HTTP error ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Direct Supabase Client fallback (for standalone Netlify deployments)
export const api = {
  // Prakriti Assessment
  savePrakritiResult: async (resultData) => {
    try {
      return await request('/prakriti', { method: 'POST', body: resultData });
    } catch {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.from('prakriti_assessments').insert({
        user_id: user.id,
        vata_score: resultData.vata_score,
        pitta_score: resultData.pitta_score,
        kapha_score: resultData.kapha_score,
        vata_percentage: resultData.vata_percentage,
        pitta_percentage: resultData.pitta_percentage,
        kapha_percentage: resultData.kapha_percentage,
        result_type: resultData.result_type,
        answers: resultData.answers
      }).select().single();
      if (error) throw error;
      return { message: 'Prakriti result saved.', result: data };
    }
  },

  getPrakritiResults: async () => {
    try {
      return await request('/prakriti');
    } catch {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('prakriti_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (error) throw error;
      return { result: data };
    }
  },

  // Auth Profile
  getMe: async () => {
    try {
      return await request("/auth/me");
    } catch {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      let doctorProfile = null;
      if (profile?.role === "doctor") {
        const { data: dp } = await supabase.from("doctor_profiles").select("*").eq("user_id", user.id).single();
        doctorProfile = dp || null;
      }
      return { user: profile, doctorProfile };
    }
  },

  // Cases
  createCase: async (payload) => {
    try {
      return await request("/cases", { method: "POST", body: payload });
    } catch {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from("profiles").select("name").eq("id", user.id).single();
      const { data, error } = await supabase.from("cases").insert({
        patient_id: user.id,
        patient_name: profile?.name || "Patient",
        chief_complaint: payload.chief_complaint?.trim(),
        duration_of_symptoms: payload.duration_of_symptoms?.trim() || "",
        joint_assessment: payload.joint_assessment?.trim() || "",
        past_history: payload.past_history?.trim() || "None reported",
        drug_allergy_history: payload.drug_allergy_history?.trim() || "No known drug allergies (NKDA)",
        family_history: payload.family_history?.trim() || "Non-contributory",
        attachment_urls: payload.attachment_urls || []
      }).select().single();
      if (error) throw error;
      return { message: "Case submitted successfully.", case: data };
    }
  },

  getMyCases: async () => {
    try {
      return await request("/cases/my");
    } catch {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.from("cases").select("*").eq("patient_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      return { cases: data || [] };
    }
  },

  getCaseById: async (id) => {
    try {
      return await request(`/cases/${id}`);
    } catch {
      const { data, error } = await supabase.from("cases").select("*").eq("id", id).single();
      if (error) throw error;
      return { case: data };
    }
  },

  // Doctors
  getDoctors: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      return await request(`/doctors${query ? `?${query}` : ""}`);
    } catch {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, doctor_profiles(*), availability(*)")
        .eq("role", "doctor")
        .eq("is_active", true)
        .eq("is_approved", true);

      if (error) throw error;
      let list = (data || []).map(u => {
        const dp = u.doctor_profiles || {};
        const avDays = [...new Set((u.availability || []).map(a => a.day_of_week))];
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          specialization: dp.specialization || "General Medicine",
          bio: dp.bio || "Practicing clinician at CLINORA.",
          experience_years: dp.experience_years || 5,
          consultation_fee: dp.consultation_fee || 500,
          availableDays: avDays,
          availabilityCount: (u.availability || []).length
        };
      });

      if (params.specialization && params.specialization !== "All") {
        list = list.filter(d => d.specialization.toLowerCase() === params.specialization.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(d => d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q) || d.bio.toLowerCase().includes(q));
      }
      return { doctors: list };
    }
  },

  getDoctorById: async (id) => {
    try {
      return await request(`/doctors/${id}`);
    } catch {
      const { data: user } = await supabase.from("profiles").select("*").eq("id", id).single();
      const { data: profile } = await supabase.from("doctor_profiles").select("*").eq("user_id", id).single();
      const { data: availability } = await supabase.from("availability").select("*").eq("doctor_id", id).order("day_of_week");
      return {
        doctor: {
          id: user.id,
          name: user.name,
          email: user.email,
          is_active: user.is_active,
          is_approved: user.is_approved,
          specialization: profile?.specialization || "General Medicine",
          bio: profile?.bio || "",
          experience_years: profile?.experience_years || 1,
          consultation_fee: profile?.consultation_fee || 500,
          availability: availability || []
        }
      };
    }
  },

  getDoctorSlots: async (id, date) => {
    try {
      return await request(`/doctors/${id}/available-slots?date=${date}`);
    } catch {
      const { data: doctor } = await supabase.from("profiles").select("name").eq("id", id).single();
      const [y, m, d] = date.split("-").map(Number);
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = days[new Date(y, m - 1, d).getDay()];

      const { data: docAvail } = await supabase.from("availability").select("*").eq("doctor_id", id).ilike("day_of_week", dayName);
      if (!docAvail || docAvail.length === 0) {
        return { date, dayOfWeek: dayName, isAvailable: false, message: `${doctor?.name || "Doctor"} has no consultation hours on ${dayName}s.`, slots: [] };
      }

      let allSlots = [];
      docAvail.forEach(s => allSlots.push(...generateSlots(s.start_time, s.end_time)));
      allSlots = [...new Set(allSlots)].sort();

      const { data: existing } = await supabase.from("appointments").select("time_slot").eq("doctor_id", id).eq("date", date).in("status", ["pending", "confirmed"]);
      const booked = new Set((existing || []).map(a => a.time_slot));
      const slotDetails = allSlots.map(slot => ({ slot, isBooked: booked.has(slot) }));

      return {
        date,
        dayOfWeek: dayName,
        isAvailable: true,
        totalSlots: slotDetails.length,
        availableSlotsCount: slotDetails.filter(s => !s.isBooked).length,
        slots: slotDetails
      };
    }
  },

  updateDoctorProfile: async (payload) => {
    try {
      return await request("/doctors/profile", { method: "PUT", body: payload });
    } catch {
      const { data: { user } } = await supabase.auth.getUser();
      if (payload.name) await supabase.from("profiles").update({ name: payload.name }).eq("id", user.id);
      const updates = {};
      if (payload.specialization) updates.specialization = payload.specialization;
      if (payload.bio !== undefined) updates.bio = payload.bio;
      if (payload.experience_years !== undefined) updates.experience_years = Number(payload.experience_years);
      const { data: dp } = await supabase.from("doctor_profiles").upsert({ user_id: user.id, ...updates }, { onConflict: "user_id" }).select().single();
      const { data: u } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      return { message: "Profile updated successfully.", user: u, doctorProfile: dp };
    }
  },

  getMyAvailability: async () => {
    try {
      return await request("/doctors/availability/me");
    } catch {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("availability").select("*").eq("doctor_id", user.id).order("day_of_week");
      return { availability: data || [] };
    }
  },

  setAvailability: async (payload) => {
    try {
      return await request("/doctors/availability", { method: "POST", body: payload });
    } catch {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.from("availability").upsert({ doctor_id: user.id, ...payload }, { onConflict: "doctor_id,day_of_week" }).select().single();
      if (error) throw error;
      return { message: "Availability updated.", availability: data };
    }
  },

  deleteAvailability: async (id) => {
    try {
      return await request(`/doctors/availability/${id}`, { method: "DELETE" });
    } catch {
      const { error } = await supabase.from("availability").delete().eq("id", id);
      if (error) throw error;
      return { message: "Availability schedule removed." };
    }
  },

  // Appointments
  bookAppointment: async (payload) => {
    try {
      return await request("/appointments", { method: "POST", body: payload });
    } catch {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: patient } = await supabase.from("profiles").select("name").eq("id", user.id).single();
      const { data: doctor } = await supabase.from("profiles").select("name").eq("id", payload.doctor_id).single();
      const { data: docProf } = await supabase.from("doctor_profiles").select("specialization").eq("user_id", payload.doctor_id).single();

      const assignedPaymentMethod = payload.payment_method === "online" ? "online" : "pay_at_reception";
      const assignedPaymentStatus = assignedPaymentMethod === "online" ? "paid" : "pending";

      const { data, error } = await supabase.from("appointments").insert({
        patient_id: user.id,
        patient_name: patient?.name || "Patient",
        doctor_id: payload.doctor_id,
        doctor_name: doctor?.name || "Doctor",
        specialization: docProf?.specialization || "General Medicine",
        case_id: payload.case_id || null,
        date: payload.date,
        time_slot: payload.time_slot,
        status: "pending",
        payment_method: assignedPaymentMethod,
        payment_status: assignedPaymentStatus,
        notes: payload.notes || ""
      }).select().single();

      if (error) {
        if (error.code === "23505") {
          const conflict = new Error("This time slot is already reserved. Please select another slot.");
          conflict.status = 409;
          throw conflict;
        }
        throw error;
      }
      return {
        message: assignedPaymentMethod === "online" ? "Appointment booked & online payment confirmed!" : "Appointment booked! Pay at reception upon visit.",
        appointment: data
      };
    }
  },

  getMyAppointments: async () => {
    try {
      return await request("/appointments/my");
    } catch {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

      let q = supabase.from("appointments").select("*, case:cases(*)").order("date", { ascending: false });
      if (profile?.role === "patient") q = q.eq("patient_id", user.id);
      else if (profile?.role === "doctor") q = q.eq("doctor_id", user.id);

      const { data, error } = await q;
      if (error) throw error;
      return { appointments: data || [] };
    }
  },

  updateAppointmentStatus: async (id, status, notes) => {
    try {
      return await request(`/appointments/${id}/status`, { method: "PATCH", body: { status, notes } });
    } catch {
      const updates = { status, updated_at: new Date().toISOString() };
      if (notes !== undefined) updates.notes = notes;
      const { data, error } = await supabase.from("appointments").update(updates).eq("id", id).select("*, case:cases(*)").single();
      if (error) throw error;
      return { message: `Appointment marked as ${status}.`, appointment: data };
    }
  },

  // Specializations
  getSpecializations: async () => {
    try {
      return await request("/specializations");
    } catch {
      const { data, error } = await supabase.from("specializations").select("*").order("name");
      if (error) throw error;
      return { specializations: data || [] };
    }
  },

  createSpecialization: async (payload) => {
    try {
      return await request("/specializations", { method: "POST", body: payload });
    } catch {
      const { data, error } = await supabase.from("specializations").insert(payload).select().single();
      if (error) throw error;
      return { message: "Specialization added.", specialization: data };
    }
  },

  deleteSpecialization: async (id) => {
    try {
      return await request(`/specializations/${id}`, { method: "DELETE" });
    } catch {
      const { error } = await supabase.from("specializations").delete().eq("id", id);
      if (error) throw error;
      return { message: "Specialization deleted." };
    }
  },

  // Reports
  createReport: async (description) => {
    try {
      return await request("/reports", { method: "POST", body: { description } });
    } catch {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from("profiles").select("name, role").eq("id", user.id).single();
      const { data, error } = await supabase.from("reports").insert({
        reporter_id: user.id,
        reporter_name: profile?.name || "User",
        reporter_role: profile?.role || "patient",
        description,
        status: "open"
      }).select().single();
      if (error) throw error;
      return { message: "Report submitted.", report: data };
    }
  },

  // Admin
  getAdminStats: async () => {
    try {
      return await request("/admin/stats");
    } catch {
      const [
        { data: users },
        { data: appointments },
        { data: specializations },
        { data: reports }
      ] = await Promise.all([
        supabase.from("profiles").select("role, is_approved"),
        supabase.from("appointments").select("status, payment_method, payment_status, date"),
        supabase.from("specializations").select("id"),
        supabase.from("reports").select("status")
      ]);

      const allUsers = users || [];
      const allAppts = appointments || [];
      const totalPatients = allUsers.filter(u => u.role === "patient").length;
      const allDoctors = allUsers.filter(u => u.role === "doctor");

      return {
        stats: {
          totalPatients,
          totalDoctors: allDoctors.length,
          approvedDoctors: allDoctors.filter(u => u.is_approved).length,
          pendingDoctors: allDoctors.filter(u => !u.is_approved).length,
          totalAppointments: allAppts.length,
          pendingAppointments: allAppts.filter(a => a.status === "pending").length,
          confirmedAppointments: allAppts.filter(a => a.status === "confirmed").length,
          completedAppointments: allAppts.filter(a => a.status === "completed").length,
          cancelledAppointments: allAppts.filter(a => a.status === "cancelled").length,
          appointmentsThisWeek: allAppts.length,
          onlinePaymentsCount: allAppts.filter(a => a.payment_method === "online").length,
          receptionPaymentsCount: allAppts.filter(a => a.payment_method === "pay_at_reception").length,
          paidAppointmentsCount: allAppts.filter(a => a.payment_status === "paid").length,
          pendingPaymentsCount: allAppts.filter(a => a.payment_status === "pending").length,
          totalSpecializations: (specializations || []).length,
          openReports: (reports || []).filter(r => r.status === "open").length
        }
      };
    }
  },

  getPendingDoctors: async () => {
    try {
      return await request("/admin/doctors/pending");
    } catch {
      const { data, error } = await supabase.from("profiles").select("id, name, email, role, is_active, is_approved, created_at, doctor_profiles(*)").eq("role", "doctor").eq("is_approved", false);
      if (error) throw error;
      const list = (data || []).map(u => ({
        id: u.id, name: u.name, email: u.email, role: u.role, is_active: u.is_active, is_approved: u.is_approved, created_at: u.created_at,
        specialization: u.doctor_profiles?.specialization || "General Medicine",
        bio: u.doctor_profiles?.bio || "",
        experience_years: u.doctor_profiles?.experience_years || 1
      }));
      return { pendingDoctors: list };
    }
  },

  approveDoctor: async (id, is_approved) => {
    try {
      return await request(`/admin/doctors/${id}/approve`, { method: "PATCH", body: { is_approved } });
    } catch {
      const { data, error } = await supabase.from("profiles").update({ is_approved: is_approved !== false }).eq("id", id).select().single();
      if (error) throw error;
      return { message: "Doctor approval updated.", doctor: data };
    }
  },

  getAdminUsers: async (role) => {
    try {
      return await request(`/admin/users${role ? `?role=${role}` : ""}`);
    } catch {
      let q = supabase.from("profiles").select("id, name, email, role, is_active, is_approved, created_at, doctor_profiles(*)").order("created_at", { ascending: false });
      if (role && role !== "all") q = q.eq("role", role);
      const { data, error } = await q;
      if (error) throw error;
      return {
        users: (data || []).map(u => ({
          ...u,
          doctorProfile: u.doctor_profiles || null
        }))
      };
    }
  },

  toggleUserActive: async (id) => {
    try {
      return await request(`/admin/users/${id}/toggle-active`, { method: "PATCH" });
    } catch {
      const { data: existing } = await supabase.from("profiles").select("is_active, name").eq("id", id).single();
      const { data, error } = await supabase.from("profiles").update({ is_active: !existing?.is_active }).eq("id", id).select().single();
      if (error) throw error;
      return { message: `Account for ${data.name} updated.`, user: data };
    }
  },

  getMasterAppointments: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      return await request(`/admin/appointments${query ? `?${query}` : ""}`);
    } catch {
      let q = supabase.from("appointments").select("*, case:cases(*)").order("date", { ascending: false });
      if (params.status && params.status !== "all") q = q.eq("status", params.status);
      if (params.doctor_id && params.doctor_id !== "all") q = q.eq("doctor_id", params.doctor_id);
      if (params.payment_method && params.payment_method !== "all") q = q.eq("payment_method", params.payment_method);
      if (params.date) q = q.eq("date", params.date);
      const { data, error } = await q;
      if (error) throw error;
      return { appointments: data || [] };
    }
  },

  getAdminReports: async () => {
    try {
      return await request("/admin/reports");
    } catch {
      const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return { reports: data || [] };
    }
  },

  resolveReport: async (id) => {
    try {
      return await request(`/admin/reports/${id}/resolve`, { method: "PATCH" });
    } catch {
      const { data: report } = await supabase.from("reports").select("status").eq("id", id).single();
      const nextStatus = report?.status === "resolved" ? "open" : "resolved";
      const { data, error } = await supabase.from("reports").update({ status: nextStatus }).eq("id", id).select().single();
      if (error) throw error;
      return { message: `Report marked as ${nextStatus}.`, report: data };
    }
  }
};

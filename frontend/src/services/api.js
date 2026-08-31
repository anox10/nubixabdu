import { supabase } from "../lib/supabase";

const API_BASE = "/api";

async function getHeaders() {
  // Read the live Supabase session token (auto-refreshed by Supabase client)
  const { data: { session } } = await supabase.auth.getSession();
  const headers = { "Content-Type": "application/json" };
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }
  return headers;
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

export const api = {
  // Auth
  getMe: () => request("/auth/me"),

  // Cases
  createCase: (payload) => request("/cases", { method: "POST", body: payload }),
  getMyCases: () => request("/cases/my"),
  getCaseById: (id) => request(`/cases/${id}`),

  // Doctors
  getDoctors: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/doctors${query ? `?${query}` : ""}`);
  },
  getDoctorById: (id) => request(`/doctors/${id}`),
  getDoctorSlots: (id, date) => request(`/doctors/${id}/available-slots?date=${date}`),
  updateDoctorProfile: (payload) => request("/doctors/profile", { method: "PUT", body: payload }),
  getMyAvailability: () => request("/doctors/availability/me"),
  setAvailability: (payload) => request("/doctors/availability", { method: "POST", body: payload }),
  deleteAvailability: (id) => request(`/doctors/availability/${id}`, { method: "DELETE" }),

  // Appointments
  bookAppointment: (payload) => request("/appointments", { method: "POST", body: payload }),
  getMyAppointments: () => request("/appointments/my"),
  updateAppointmentStatus: (id, status, notes) =>
    request(`/appointments/${id}/status`, { method: "PATCH", body: { status, notes } }),

  // Specializations
  getSpecializations: () => request("/specializations"),
  createSpecialization: (payload) => request("/specializations", { method: "POST", body: payload }),
  deleteSpecialization: (id) => request(`/specializations/${id}`, { method: "DELETE" }),

  // Reports
  createReport: (description) => request("/reports", { method: "POST", body: { description } }),

  // Admin
  getAdminStats: () => request("/admin/stats"),
  getPendingDoctors: () => request("/admin/doctors/pending"),
  approveDoctor: (id, is_approved) => request(`/admin/doctors/${id}/approve`, { method: "PATCH", body: { is_approved } }),
  getAdminUsers: (role) => request(`/admin/users${role ? `?role=${role}` : ""}`),
  toggleUserActive: (id) => request(`/admin/users/${id}/toggle-active`, { method: "PATCH" }),
  getMasterAppointments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/appointments${query ? `?${query}` : ""}`);
  },
  getAdminReports: () => request("/admin/reports"),
  resolveReport: (id) => request(`/admin/reports/${id}/resolve`, { method: "PATCH" })
};

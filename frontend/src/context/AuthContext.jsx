import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
export function isValidGmail(email) {
  if (!email || typeof email !== "string") return false;
  return GMAIL_REGEX.test(email.trim());
}

export function AuthProvider({ children }) {
  const [user, setUser]                   = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [toast, setToast]                 = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch CLINORA profile + doctorProfile (Tries Express API first, falls back to direct Supabase query)
  const fetchProfile = async (accessToken) => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error("Backend API unreachable");
      const data = await res.json();
      setUser(data.user);
      setDoctorProfile(data.doctorProfile || null);
      return data.user;
    } catch (err) {
      // Vercel / Standalone static fallback: Query Supabase PostgreSQL directly!
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return null;

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        let dp = null;
        const currentRole = profile?.role || authUser.user_metadata?.role || "patient";
        if (currentRole === "doctor") {
          const { data: doctorData } = await supabase
            .from("doctor_profiles")
            .select("*")
            .eq("user_id", authUser.id)
            .single();
          dp = doctorData || null;
        }

        const mappedUser = profile || {
          id: authUser.id,
          name: authUser.user_metadata?.name || authUser.email.split("@")[0],
          email: authUser.email,
          role: currentRole,
          is_active: true,
          is_approved: currentRole !== "doctor"
        };

        setUser(mappedUser);
        setDoctorProfile(dp);
        return mappedUser;
      } catch (supabaseErr) {
        console.warn("Direct Supabase profile fetch fallback error:", supabaseErr);
        return null;
      }
    }
  };

  // Listen to Supabase auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        fetchProfile(session.access_token).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.access_token) {
          await fetchProfile(session.access_token);
        } else {
          setUser(null);
          setDoctorProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    if (!isValidGmail(email)) {
      const msg = "Please enter a valid Gmail address (e.g. yourname@gmail.com).";
      showToast(msg, "error");
      throw new Error(msg);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    if (error) {
      const msg = error.message || "Login failed";
      showToast(msg, "error");
      throw new Error(msg);
    }

    const userProfile = await fetchProfile(data.session.access_token);
    showToast(`Welcome back, ${userProfile?.name || email}!`, "success");
    return {
      ...data,
      user: userProfile || { role: data.user.user_metadata?.role || "patient" }
    };
  };

  const register = async (formData) => {
    if (!isValidGmail(formData.email)) {
      const msg = "Registration requires a valid Gmail address (e.g. yourname@gmail.com).";
      showToast(msg, "error");
      throw new Error(msg);
    }

    const email = formData.email.trim().toLowerCase();

    // 1. Register user directly with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
          role: formData.role
        }
      }
    });

    if (error) {
      const msg = error.message || "Registration failed";
      showToast(msg, "error");
      throw new Error(msg);
    }

    // 2. If Doctor, insert into doctor_profiles in Supabase directly
    if (formData.role === "doctor" && data.user) {
      await supabase.from("doctor_profiles").upsert({
        user_id: data.user.id,
        specialization: formData.specialization || "General Medicine",
        bio: formData.bio || "Practicing clinical physician.",
        experience_years: Number(formData.experience_years) || 1,
        consultation_fee: 500
      }, { onConflict: "user_id" }).catch(() => {});
    }

    let userProfile = null;
    if (data.session) {
      userProfile = await fetchProfile(data.session.access_token);
    }

    if (formData.role === "doctor") {
      showToast("Registration submitted! Awaiting administrator approval.", "warning");
    } else {
      showToast(`Account created! Welcome, ${formData.name}!`, "success");
    }

    return {
      ...data,
      user: userProfile || { role: formData.role, name: formData.name }
    };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDoctorProfile(null);
    showToast("Signed out successfully.", "info");
  };

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) return await fetchProfile(session.access_token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        doctorProfile,
        loading,
        login,
        register,
        logout,
        refreshUser,
        showToast,
        toast,
        setToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

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

  // Fetch CLINORA profile + doctorProfile from backend /api/auth/me
  const fetchProfile = async (accessToken) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error("Profile fetch failed");
      const data = await res.json();
      setUser(data.user);
      setDoctorProfile(data.doctorProfile || null);
      return data.user;
    } catch (err) {
      console.warn("fetchProfile error:", err);
      setUser(null);
      setDoctorProfile(null);
      return null;
    }
  };

  // Listen to Supabase auth state changes (handles refresh, logout, login)
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        fetchProfile(session.access_token).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));

    // Subscribe to future changes
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

    // Register via Supabase Auth (triggers profile creation)
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

    // Also call backend to ensure doctor_profiles + availability are set up
    if (formData.role === "doctor" && data.session) {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`
        },
        body: JSON.stringify(formData)
      }).catch(console.error);
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

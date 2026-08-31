# CLINORA — Hospital Appointment Booking & Case Management System

A hospital appointment booking platform built with React, Tailwind CSS, Node.js/Express, and Supabase (PostgreSQL & Authentication).

## 🌟 Key Features

* **3 Role Dashboards**:
  * **Patient**: Multi-step clinical intake form, doctor search by specialization, interactive calendar slot booking, and online UPI/QR payments.
  * **Doctor**: Schedule/availability management, incoming appointment management, clinical case reviews, and status updates (confirmed, completed, cancelled).
  * **Admin**: Doctor verification & approvals, user management (active/disabled toggling), hospital specialization management, and master appointment auditing.
* **Double-Booking Prevention**:
  * Enforced at the PostgreSQL level via a conditional unique index (appointments_no_double_book) on (doctor_id, date, time_slot) where appointment is active.
* **Strict Gmail Authentication**:
  * Validates authentic @gmail.com email addresses on both frontend and backend.
* **Supabase Integration**:
  * PostgreSQL database storing profiles, doctor_profiles, availability, cases, appointments, specializations, and reports.
  * Supabase Auth handling sessions and token verification.

## 🚀 Getting Started

### 1. Environment Setup
Copy the example environment files:
- Backend: Create `backend/.env` (see `backend/.env.example`)
- Frontend: Create `frontend/.env` (see `frontend/.env.example`)

### 2. Database Schema
Run the SQL script in `supabase/schema.sql` inside your Supabase SQL Editor.

### 3. Install & Run
```bash
# Backend
cd backend
npm install
node server.js

# Frontend
cd frontend
npm install
npm run dev
```

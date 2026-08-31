const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seed() {
  console.log("🌱 Starting Supabase Seeding for CLINORA...");

  // 1. Seed Specializations
  const specializations = [
    { name: "Cardiology", description: "Heart, blood vessels, coronary wellness, and hypertension management" },
    { name: "Pediatrics", description: "Newborn care, child development, and adolescent health" },
    { name: "Dermatology", description: "Skin conditions, eczema, acne therapy, and preventive screening" },
    { name: "Orthopedics", description: "Bones, joints, sports injuries, and musculoskeletal care" },
    { name: "Neurology", description: "Brain, spine, peripheral nerves, and chronic headaches" },
    { name: "General Medicine", description: "Primary care, preventive medicine, and general consultations" }
  ];

  for (const s of specializations) {
    await supabase.from("specializations").upsert(s, { onConflict: "name" });
  }
  console.log("✅ Specializations seeded.");

  // Helper to create or get Auth user
  async function createOrGetUser(email, password, name, role) {
    const { data: usersData } = await supabase.auth.admin.listUsers();
    const existing = usersData.users.find(u => u.email === email);
    if (existing) {
      // Update password just in case
      await supabase.auth.admin.updateUserById(existing.id, { password, user_metadata: { name, role } });
      return existing.id;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role }
    });
    if (error) throw error;
    return data.user.id;
  }

  // 2. Create Admin
  const adminId = await createOrGetUser("admin@gmail.com", "admin123", "Dr. Arthur Mitchell (Admin)", "admin");
  await supabase.from("profiles").upsert({
    id: adminId,
    name: "Dr. Arthur Mitchell (Admin)",
    email: "admin@gmail.com",
    role: "admin",
    is_active: true,
    is_approved: true
  });
  console.log("✅ Admin account created: admin@gmail.com");

  // 3. Create Doctors
  const doctors = [
    {
      email: "dr.jenkins@gmail.com",
      password: "doctor123",
      name: "Dr. Sarah Jenkins",
      specialization: "Cardiology",
      bio: "Senior Cardiologist with 14+ years experience in preventive cardiology, coronary wellness, and hypertension.",
      experience_years: 14,
      consultation_fee: 1500,
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },
    {
      email: "dr.rivera@gmail.com",
      password: "doctor123",
      name: "Dr. Alex Rivera",
      specialization: "Pediatrics",
      bio: "Board-certified Pediatrician dedicated to compassionate newborn and child healthcare.",
      experience_years: 9,
      consultation_fee: 800,
      days: ["Monday", "Wednesday", "Friday"]
    },
    {
      email: "dr.chen@gmail.com",
      password: "doctor123",
      name: "Dr. Emily Chen",
      specialization: "Dermatology",
      bio: "Consultant Dermatologist focusing on clinical eczema, acne therapy, and preventive skin screening.",
      experience_years: 11,
      consultation_fee: 1000,
      days: ["Tuesday", "Thursday", "Saturday"]
    },
    {
      email: "dr.patel@gmail.com",
      password: "doctor123",
      name: "Dr. Rajesh Patel",
      specialization: "Orthopedics",
      bio: "Orthopedic specialist in joint preservation, fracture care, and rehabilitation medicine.",
      experience_years: 8,
      consultation_fee: 1200,
      days: ["Monday", "Thursday", "Friday"]
    }
  ];

  const docIds = {};
  for (const doc of doctors) {
    const docId = await createOrGetUser(doc.email, doc.password, doc.name, "doctor");
    docIds[doc.email] = docId;

    await supabase.from("profiles").upsert({
      id: docId,
      name: doc.name,
      email: doc.email,
      role: "doctor",
      is_active: true,
      is_approved: true
    });

    await supabase.from("doctor_profiles").upsert({
      user_id: docId,
      specialization: doc.specialization,
      bio: doc.bio,
      experience_years: doc.experience_years,
      consultation_fee: doc.consultation_fee
    }, { onConflict: "user_id" });

    // Seed Availability
    for (const day of doc.days) {
      await supabase.from("availability").upsert({
        doctor_id: docId,
        day_of_week: day,
        start_time: "09:00",
        end_time: "17:00"
      }, { onConflict: "doctor_id,day_of_week" });
    }
  }
  console.log("✅ 4 Doctors & availability schedules seeded.");

  // 4. Create Patients
  const patient1Id = await createOrGetUser("john.doe@gmail.com", "patient123", "John Doe", "patient");
  await supabase.from("profiles").upsert({
    id: patient1Id,
    name: "John Doe",
    email: "john.doe@gmail.com",
    role: "patient",
    is_active: true,
    is_approved: true
  });

  const patient2Id = await createOrGetUser("jane.smith@gmail.com", "patient123", "Jane Smith", "patient");
  await supabase.from("profiles").upsert({
    id: patient2Id,
    name: "Jane Smith",
    email: "jane.smith@gmail.com",
    role: "patient",
    is_active: true,
    is_approved: true
  });
  console.log("✅ 2 Patients seeded: john.doe@gmail.com, jane.smith@gmail.com");

  // 5. Seed Cases for John Doe
  const { data: caseData } = await supabase.from("cases").insert([
    {
      patient_id: patient1Id,
      patient_name: "John Doe",
      chief_complaint: "Mild chest tightness upon moderate exertion and occasional palpitations",
      duration_of_symptoms: "2 weeks",
      joint_assessment: "Prominent, crack easily (VATA)",
      past_history: "Mild hypertension controlled by diet and lifestyle modifications",
      drug_allergy_history: "Penicillin (rash)",
      family_history: "Father had coronary artery disease at age 62"
    }
  ]).select();

  const caseId = caseData?.[0]?.id;
  console.log("✅ Sample clinical case created.");

  // 6. Seed Sample Appointment
  if (caseId && docIds["dr.jenkins@gmail.com"]) {
    await supabase.from("appointments").insert([
      {
        patient_id: patient1Id,
        patient_name: "John Doe",
        doctor_id: docIds["dr.jenkins@gmail.com"],
        doctor_name: "Dr. Sarah Jenkins",
        specialization: "Cardiology",
        case_id: caseId,
        date: "2026-09-07",
        time_slot: "10:00 - 10:30",
        status: "confirmed",
        payment_method: "online",
        payment_status: "paid",
        notes: "Routine cardiac follow-up"
      }
    ]);
    console.log("✅ Sample appointment created.");
  }

  console.log("\n🎉 Supabase Database Seeded Successfully!");
}

seed().catch(err => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});

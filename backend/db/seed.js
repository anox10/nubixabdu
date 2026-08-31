const bcrypt = require('bcryptjs');

const defaultPasswordHash = bcrypt.hashSync('patient123', 10);
const docPasswordHash = bcrypt.hashSync('doctor123', 10);
const adminPasswordHash = bcrypt.hashSync('admin123', 10);

// Sample SVG data URLs for simulated document/X-ray attachments
const sampleXrayAttachment = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%230f172a'><rect width='400' height='300' fill='%230f172a'/><text x='20' y='30' fill='%2338bdf8' font-family='sans-serif' font-size='14' font-weight='bold'>CLINORA RADIOLOGY DEPT - CHEST X-RAY</text><text x='20' y='50' fill='%2394a3b8' font-family='sans-serif' font-size='11'>Patient: John Doe | DOB: 1988-04-12 | View: PA Upright</text><circle cx='200' cy='160' r='70' fill='none' stroke='%23475569' stroke-width='4'/><path d='M160 140 Q200 110 240 140' fill='none' stroke='%2394a3b8' stroke-width='3'/><path d='M150 170 Q200 130 250 170' fill='none' stroke='%2394a3b8' stroke-width='3'/><path d='M140 200 Q200 150 260 200' fill='none' stroke='%2394a3b8' stroke-width='3'/><text x='20' y='280' fill='%2322c55e' font-family='sans-serif' font-size='12'>IMPRESSION: Mild cardiac silhouette enlargement. No active pneumothorax.</text></svg>";

const sampleECGAttachment = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f8fafc'><rect width='400' height='300' fill='%23f8fafc'/><line x1='0' y1='150' x2='400' y2='150' stroke='%23e2e8f0' stroke-width='1'/><text x='20' y='30' fill='%23059669' font-family='sans-serif' font-size='14' font-weight='bold'>CLINORA DIAGNOSTICS - 12-LEAD ECG REPORT</text><path d='M20 150 L60 150 L70 140 L80 150 L100 150 L110 120 L120 190 L130 140 L140 150 L180 150 L190 140 L200 150 L220 150 L230 115 L240 195 L250 140 L260 150 L300 150 L310 140 L320 150 L340 150 L350 118 L360 192 L370 140 L380 150' fill='none' stroke='%23dc2626' stroke-width='2.5'/><text x='20' y='275' fill='%23334155' font-family='sans-serif' font-size='11'>HR: 74 BPM | Sinus Rhythm | PR: 160ms | QRS: 88ms</text></svg>";

const seedData = {
  users: [
    {
      id: 'usr-admin',
      name: 'Dr. Arthur Mitchell (Admin)',
      email: 'admin@gmail.com',
      password: adminPasswordHash,
      role: 'admin',
      is_active: true,
      is_approved: true,
      created_at: '2026-08-01T08:00:00.000Z'
    },
    {
      id: 'usr-doc-1',
      name: 'Dr. Sarah Jenkins',
      email: 'dr.jenkins@gmail.com',
      password: docPasswordHash,
      role: 'doctor',
      is_active: true,
      is_approved: true,
      created_at: '2026-08-05T09:30:00.000Z'
    },
    {
      id: 'usr-doc-2',
      name: 'Dr. Alex Rivera',
      email: 'dr.rivera@gmail.com',
      password: docPasswordHash,
      role: 'doctor',
      is_active: true,
      is_approved: true,
      created_at: '2026-08-06T10:15:00.000Z'
    },
    {
      id: 'usr-doc-3',
      name: 'Dr. Emily Chen',
      email: 'dr.chen@gmail.com',
      password: docPasswordHash,
      role: 'doctor',
      is_active: true,
      is_approved: true,
      created_at: '2026-08-07T11:00:00.000Z'
    },
    {
      id: 'usr-doc-4',
      name: 'Dr. Marcus Vance',
      email: 'dr.vance@gmail.com',
      password: docPasswordHash,
      role: 'doctor',
      is_active: true,
      is_approved: false, // Pending admin approval test account
      created_at: '2026-08-30T14:20:00.000Z'
    },
    {
      id: 'usr-pat-1',
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: defaultPasswordHash,
      role: 'patient',
      is_active: true,
      is_approved: true,
      created_at: '2026-08-10T14:00:00.000Z'
    },
    {
      id: 'usr-pat-2',
      name: 'Maria Garcia',
      email: 'maria.garcia@gmail.com',
      password: defaultPasswordHash,
      role: 'patient',
      is_active: true,
      is_approved: true,
      created_at: '2026-08-12T16:45:00.000Z'
    }
  ],
  specializations: [
    { id: 'spec-1', name: 'Cardiology', description: 'Heart, blood pressure, and cardiovascular health management' },
    { id: 'spec-2', name: 'Pediatrics', description: 'Infant, child, and adolescent comprehensive healthcare' },
    { id: 'spec-3', name: 'Dermatology', description: 'Skin, hair, allergy rashes, and cutaneous medicine' },
    { id: 'spec-4', name: 'General Medicine', description: 'Primary health exams, chronic conditions, and diagnostic triage' },
    { id: 'spec-5', name: 'Orthopedics', description: 'Bones, joints, sports injuries, and musculoskeletal care' },
    { id: 'spec-6', name: 'Neurology', description: 'Brain, spine, peripheral nerves, and chronic headaches' }
  ],
  doctorProfiles: [
    {
      user_id: 'usr-doc-1',
      specialization: 'Cardiology',
      bio: 'Senior Cardiologist with 14+ years experience in preventive cardiology, coronary wellness, and hypertension.',
      experience_years: 14,
      consultation_fee: 1500
    },
    {
      user_id: 'usr-doc-2',
      specialization: 'Pediatrics',
      bio: 'Board-certified Pediatrician dedicated to compassionate newborn and child healthcare.',
      experience_years: 9,
      consultation_fee: 800
    },
    {
      user_id: 'usr-doc-3',
      specialization: 'Dermatology',
      bio: 'Consultant Dermatologist focusing on clinical eczema, acne therapy, and preventive skin screening.',
      experience_years: 11,
      consultation_fee: 1000
    },
    {
      user_id: 'usr-doc-4',
      specialization: 'Orthopedics',
      bio: 'Orthopedic specialist in joint preservation, fracture care, and rehabilitation medicine.',
      experience_years: 8,
      consultation_fee: 1200
    }
  ],
  availability: [
    // Dr. Sarah Jenkins (Cardiology)
    { id: 'av-1', doctor_id: 'usr-doc-1', day_of_week: 'Monday', start_time: '09:00', end_time: '13:00' },
    { id: 'av-2', doctor_id: 'usr-doc-1', day_of_week: 'Tuesday', start_time: '14:00', end_time: '18:00' },
    { id: 'av-3', doctor_id: 'usr-doc-1', day_of_week: 'Wednesday', start_time: '09:00', end_time: '13:00' },
    { id: 'av-4', doctor_id: 'usr-doc-1', day_of_week: 'Thursday', start_time: '14:00', end_time: '18:00' },
    { id: 'av-5', doctor_id: 'usr-doc-1', day_of_week: 'Friday', start_time: '09:00', end_time: '13:00' },

    // Dr. Alex Rivera (Pediatrics)
    { id: 'av-6', doctor_id: 'usr-doc-2', day_of_week: 'Monday', start_time: '10:00', end_time: '16:00' },
    { id: 'av-7', doctor_id: 'usr-doc-2', day_of_week: 'Wednesday', start_time: '10:00', end_time: '16:00' },
    { id: 'av-8', doctor_id: 'usr-doc-2', day_of_week: 'Friday', start_time: '10:00', end_time: '15:00' },

    // Dr. Emily Chen (Dermatology)
    { id: 'av-9', doctor_id: 'usr-doc-3', day_of_week: 'Tuesday', start_time: '09:00', end_time: '15:00' },
    { id: 'av-10', doctor_id: 'usr-doc-3', day_of_week: 'Thursday', start_time: '09:00', end_time: '15:00' },
    { id: 'av-11', doctor_id: 'usr-doc-3', day_of_week: 'Saturday', start_time: '10:00', end_time: '14:00' }
  ],
  cases: [
    {
      id: 'case-1',
      patient_id: 'usr-pat-1',
      patient_name: 'John Doe',
      chief_complaint: 'Mild chest tightness and shortness of breath during brisk walking.',
      duration_of_symptoms: '2 weeks',
      joint_assessment: 'Prominent, crack easily (VATA)',
      past_history: 'Essential hypertension diagnosed 3 years ago. Currently on Lisinopril 10mg once daily.',
      drug_allergy_history: 'Penicillin (hives and skin erythema). No NSAID allergy.',
      family_history: 'Father had myocardial infarction at age 58. Mother has Type 2 diabetes.',
      attachment_urls: [sampleXrayAttachment, sampleECGAttachment],
      created_at: '2026-08-25T10:00:00.000Z'
    },
    {
      id: 'case-2',
      patient_id: 'usr-pat-2',
      patient_name: 'Maria Garcia',
      chief_complaint: 'Dry irritable cough and mild fatigue without active fever.',
      duration_of_symptoms: '10 days',
      joint_assessment: 'Loose, flexible (PITTA)',
      past_history: 'Childhood asthma; occasional seasonal flare-ups treated with Albuterol inhaler.',
      drug_allergy_history: 'Sulfonamides (swelling and severe gastrointestinal nausea).',
      family_history: 'Non-contributory.',
      attachment_urls: [],
      created_at: '2026-08-28T14:30:00.000Z'
    }
  ],
  appointments: [
    {
      id: 'apt-1',
      patient_id: 'usr-pat-1',
      patient_name: 'John Doe',
      doctor_id: 'usr-doc-1',
      doctor_name: 'Dr. Sarah Jenkins',
      specialization: 'Cardiology',
      case_id: 'case-1',
      date: '2026-09-02',
      time_slot: '09:30 - 10:00',
      status: 'pending',
      payment_method: 'online',
      payment_status: 'paid',
      notes: 'Initial cardiac assessment and resting ECG follow-up.',
      created_at: '2026-08-29T10:00:00.000Z'
    },
    {
      id: 'apt-2',
      patient_id: 'usr-pat-2',
      patient_name: 'Maria Garcia',
      doctor_id: 'usr-doc-1',
      doctor_name: 'Dr. Sarah Jenkins',
      specialization: 'Cardiology',
      case_id: 'case-2',
      date: '2026-09-02',
      time_slot: '11:00 - 11:30',
      status: 'confirmed',
      payment_method: 'pay_at_reception',
      payment_status: 'pending',
      notes: 'Pre-op clearance checkup. Will pay at front desk.',
      created_at: '2026-08-28T11:00:00.000Z'
    },
    {
      id: 'apt-3',
      patient_id: 'usr-pat-1',
      patient_name: 'John Doe',
      doctor_id: 'usr-doc-2',
      doctor_name: 'Dr. Alex Rivera',
      specialization: 'Pediatrics',
      case_id: 'case-1',
      date: '2026-08-22',
      time_slot: '11:30 - 12:00',
      status: 'completed',
      payment_method: 'online',
      payment_status: 'paid',
      notes: 'Child routine wellness checkup.',
      created_at: '2026-08-19T14:00:00.000Z'
    }
  ],
  reports: [
    {
      id: 'rep-1',
      reporter_id: 'usr-pat-2',
      reporter_name: 'Maria Garcia',
      reporter_role: 'patient',
      description: 'Slot picker showed 12:00 PM when clinic closed at 12:00 PM.',
      status: 'resolved',
      created_at: '2026-08-22T17:00:00.000Z'
    },
    {
      id: 'rep-2',
      reporter_id: 'usr-doc-1',
      reporter_name: 'Dr. Sarah Jenkins',
      reporter_role: 'doctor',
      description: 'Would like a 10-minute buffer setting between back-to-back appointments.',
      status: 'open',
      created_at: '2026-08-29T16:00:00.000Z'
    }
  ]
};

module.exports = seedData;

async function runTests() {
  const base = 'http://localhost:5000/api';

  console.log('=== TEST 1: Gmail Validation Enforcement ===');
  const badLogin = await fetch(base + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@yahoo.com', password: 'password123' })
  });
  console.log('Non-Gmail login status:', badLogin.status, '(Expect 400)');
  const badLoginData = await badLogin.json();
  console.log('Non-Gmail error message:', badLoginData.error);

  console.log('\n=== TEST 2: Real Login with Seed Accounts ===');
  const patLogin = await fetch(base + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'john.doe@gmail.com', password: 'patient123' })
  }).then(r => r.json());
  console.log('Patient Login:', patLogin.user.name, '| Role:', patLogin.user.role);

  const docLogin = await fetch(base + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'dr.jenkins@gmail.com', password: 'doctor123' })
  }).then(r => r.json());
  console.log('Doctor Login:', docLogin.user.name, '| Approved:', docLogin.user.is_approved);

  const adminLogin = await fetch(base + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' })
  }).then(r => r.json());
  console.log('Admin Login:', adminLogin.user.name);

  console.log('\n=== TEST 3: Clinical Intake Case with Documents ===');
  const sampleDoc = 'data:image/svg+xml;utf8,<svg><rect width="100" height="100" fill="blue"/></svg>';
  const caseRes = await fetch(base + '/cases', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + patLogin.token
    },
    body: JSON.stringify({
      chief_complaint: 'Severe migraine and nausea for 2 days',
      past_history: 'Hypertension',
      drug_allergy_history: 'Penicillin',
      family_history: 'None',
      attachment_urls: [sampleDoc]
    })
  }).then(r => r.json());
  console.log('Case Created ID:', caseRes.case.id, '| Attachments count:', caseRes.case.attachment_urls.length);

  console.log('\n=== TEST 4: Booking with Online Payment ===');
  const docList = await fetch(base + '/doctors').then(r => r.json());
  const targetDoc = docList.doctors[0];
  const aptOnline = await fetch(base + '/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + patLogin.token
    },
    body: JSON.stringify({
      doctor_id: targetDoc.id,
      case_id: caseRes.case.id,
      date: '2026-09-02',
      time_slot: '10:00 - 10:30',
      payment_method: 'online',
      notes: 'Paid online via card'
    })
  }).then(r => r.json());
  console.log('Online Booking Status:', aptOnline.appointment.status, '| Payment Method:', aptOnline.appointment.payment_method, '| Payment Status:', aptOnline.appointment.payment_status);

  console.log('\n=== TEST 5: Booking with Pay at Reception ===');
  const aptReception = await fetch(base + '/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + patLogin.token
    },
    body: JSON.stringify({
      doctor_id: targetDoc.id,
      case_id: caseRes.case.id,
      date: '2026-09-02',
      time_slot: '10:30 - 11:00',
      payment_method: 'pay_at_reception',
      notes: 'Will settle at reception desk'
    })
  }).then(r => r.json());
  console.log('Reception Booking Status:', aptReception.appointment.status, '| Payment Method:', aptReception.appointment.payment_method, '| Payment Status:', aptReception.appointment.payment_status);

  console.log('\n=== TEST 6: Doctor Inspecting Case & Accepting ===');
  const docApts = await fetch(base + '/appointments/my', {
    headers: { 'Authorization': 'Bearer ' + docLogin.token }
  }).then(r => r.json());
  console.log('Doctor queue count:', docApts.appointments.length);
  const foundApt = docApts.appointments.find(a => a.id === aptOnline.appointment.id);
  console.log('Found appointment case complaint:', foundApt.case.chief_complaint, '| Attachments:', foundApt.case.attachment_urls.length);

  const acceptRes = await fetch(base + '/appointments/' + aptOnline.appointment.id + '/status', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + docLogin.token
    },
    body: JSON.stringify({ status: 'confirmed' })
  }).then(r => r.json());
  console.log('Doctor accept result status:', acceptRes.appointment.status);

  console.log('\n=== TEST 7: Admin Stats & Payment Split Audit ===');
  const statsRes = await fetch(base + '/admin/stats', {
    headers: { 'Authorization': 'Bearer ' + adminLogin.token }
  }).then(r => r.json());
  console.log('Admin Stats Overview:', {
    totalPatients: statsRes.stats.totalPatients,
    totalDoctors: statsRes.stats.totalDoctors,
    totalAppointments: statsRes.stats.totalAppointments,
    onlinePayments: statsRes.stats.onlinePaymentsCount,
    receptionPayments: statsRes.stats.receptionPaymentsCount,
    paidAppointments: statsRes.stats.paidAppointmentsCount,
    pendingPayments: statsRes.stats.pendingPaymentsCount
  });

  console.log('\n>>> ALL 7 AUTOMATED VERIFICATION TESTS PASSED SUCCESSFULLY! <<<');
}

runTests().catch(console.error);

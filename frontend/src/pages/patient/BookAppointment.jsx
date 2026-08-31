import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Search,
  Stethoscope,
  Calendar,
  Clock,
  FileText,
  PlusCircle,
  ChevronRight,
  Filter,
  CreditCard,
  Building
} from 'lucide-react';
import PaymentModal from '../../components/PaymentModal';

export default function BookAppointment({ setActivePage }) {
  const { showToast } = useAuth();

  const [specializations, setSpecializations] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [myCases, setMyCases] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Selected doctor
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [bookingDate, setBookingDate] = useState(getTomorrowStr());
  const [slotsData, setSlotsData] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [processingBooking, setProcessingBooking] = useState(false);

  useEffect(() => {
    api.getSpecializations()
      .then((res) => setSpecializations(res.specializations || []))
      .catch(() => {});

    api.getMyCases()
      .then((res) => {
        setMyCases(res.cases || []);
        if (res.cases && res.cases.length > 0) {
          setSelectedCaseId(res.cases[0].id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoadingDocs(true);
        const data = await api.getDoctors({
          specialization: selectedSpec,
          search: searchQuery
        });
        setDoctors(data.doctors || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDocs(false);
      }
    }
    fetchDoctors();
  }, [selectedSpec, searchQuery]);

  useEffect(() => {
    if (!selectedDoctor || !bookingDate) return;

    async function fetchSlots() {
      try {
        setLoadingSlots(true);
        setSlotsData(null);
        setSelectedSlot('');
        const data = await api.getDoctorSlots(selectedDoctor.id, bookingDate);
        setSlotsData(data);
      } catch (err) {
        showToast('Failed to fetch doctor schedule slots.', 'error');
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDoctor, bookingDate]);

  const handleOpenPaymentStep = () => {
    if (!selectedDoctor) return;
    if (!selectedSlot) {
      showToast('Please select an available time slot.', 'warning');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handleConfirmBookingWithPayment = async (paymentMethod) => {
    try {
      setProcessingBooking(true);
      await api.bookAppointment({
        doctor_id: selectedDoctor.id,
        case_id: selectedCaseId || null,
        date: bookingDate,
        time_slot: selectedSlot,
        payment_method: paymentMethod,
        notes: bookingNotes
      });

      showToast(
        paymentMethod === 'online'
          ? `Visit booked with ${selectedDoctor.name}! Online payment confirmed.`
          : `Visit booked! Please settle payment at hospital reception.`,
        'success'
      );

      setIsPaymentModalOpen(false);
      setSelectedDoctor(null);
      setActivePage('patient-appointments');
    } catch (err) {
      showToast(err.message || 'Booking failed.', 'error');
    } finally {
      setProcessingBooking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Stethoscope className="w-7 h-7 text-green-600" />
          <span>Book Specialist & Choose Payment</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Browse verified CLINORA doctors, select available 30-min consultation slots, and pay online or at reception.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctor by name, department, or clinical keywords..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 self-start sm:self-center">
            <Filter className="w-4 h-4 text-green-600" />
            <span>Department:</span>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedSpec('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              selectedSpec === 'All'
                ? 'bg-green-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Departments
          </button>
          {specializations.map((spec) => (
            <button
              key={spec.id}
              onClick={() => setSelectedSpec(spec.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                selectedSpec === spec.name
                  ? 'bg-green-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {spec.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doctor List */}
        <div className="lg:col-span-2 space-y-4">
          {loadingDocs ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading doctors directory...</div>
          ) : doctors.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
              <p className="text-sm text-slate-500">No approved doctors matched your department filter.</p>
            </div>
          ) : (
            doctors.map((doc) => {
              const isSelected = selectedDoctor?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  className={`bg-white rounded-3xl border p-6 transition-all shadow-xs ${
                    isSelected
                      ? 'border-green-500 ring-2 ring-green-500/20 bg-green-50/20'
                      : 'border-slate-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-900 text-[10px] font-extrabold uppercase tracking-wider">
                          {doc.specialization}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {doc.experience_years} Years Experience
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900">{doc.name}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{doc.bio}</p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] font-bold text-slate-500">Consultation Fee:</span>
                        <span className="text-xs font-extrabold text-green-700">₹{doc.consultation_fee || 100}</span>
                        <span>•</span>
                        <span className="text-[11px] font-bold text-slate-500">Working Days:</span>
                        {doc.availableDays && doc.availableDays.length > 0 ? (
                          doc.availableDays.map((day) => (
                            <span key={day} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded-md font-semibold">
                              {day}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Schedule not configured</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5 flex-shrink-0 ${
                        isSelected
                          ? 'bg-green-700 text-white shadow-md'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      <span>{isSelected ? 'Selecting Slot' : 'Select Doctor'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Slot Selection & Booking Panel */}
        <div className="lg:col-span-1">
          {selectedDoctor ? (
            <div className="bg-white rounded-3xl border border-green-200 shadow-xl p-6 sticky top-20 space-y-5 animate-fade-in">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-green-700">Selected Clinician</span>
                  <h3 className="text-base font-black text-slate-900">{selectedDoctor.name}</h3>
                  <p className="text-xs text-slate-500">{selectedDoctor.specialization}</p>
                </div>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Change
                </button>
              </div>

              {/* 1. Date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span>1. Choose Date</span>
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              {/* 2. Slots */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>2. Available Slots</span>
                  </span>
                  {slotsData?.dayOfWeek && (
                    <span className="text-[10px] text-green-800 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                      {slotsData.dayOfWeek}
                    </span>
                  )}
                </label>

                {loadingSlots ? (
                  <div className="py-6 text-center text-xs text-slate-400">Loading schedules...</div>
                ) : !slotsData || !slotsData.isAvailable ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed">
                    {slotsData?.message || 'Doctor not available on this day.'}
                  </div>
                ) : slotsData.slots.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 text-center">
                    No slots configured for this date.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                    {slotsData.slots.map(({ slot, isBooked }) => {
                      const isSelectedSlot = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition-all text-center border ${
                            isBooked
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : isSelectedSlot
                              ? 'bg-green-600 text-white border-green-600 shadow-xs ring-2 ring-green-400/40'
                              : 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. Attach Case */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span>3. Attach Case & Documents</span>
                  </span>
                  <button
                    onClick={() => setActivePage('patient-new-case')}
                    className="text-[10px] font-bold text-green-600 hover:underline flex items-center gap-0.5"
                  >
                    <PlusCircle className="w-3 h-3" /> New Case
                  </button>
                </label>

                {myCases.length > 0 ? (
                  <select
                    value={selectedCaseId}
                    onChange={(e) => setSelectedCaseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 text-xs font-semibold bg-white"
                  >
                    {myCases.map((c) => (
                      <option key={c.id} value={c.id}>
                        Case {c.id} - {c.chief_complaint.slice(0, 30)}... ({c.attachment_urls?.length || 0} Docs)
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                    No intake cases submitted yet.
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase text-slate-600">
                  Notes for Doctor (Optional)
                </label>
                <input
                  type="text"
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="e.g. Bringing previous lab scan..."
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Step 4 CTA: Proceeds to Payment Step */}
              <button
                onClick={handleOpenPaymentStep}
                disabled={!selectedSlot}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-black text-xs rounded-2xl shadow-md shadow-green-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Payment Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-8 text-center space-y-3 sticky top-20">
              <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 mx-auto">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Select a Specialist</h4>
              <p className="text-xs text-slate-500">
                Click "Select Doctor" on any profile card to configure appointment date, time slot, and payment method.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Step Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bookingDetails={{
          doctor: selectedDoctor,
          date: bookingDate,
          time_slot: selectedSlot
        }}
        onConfirmPayment={handleConfirmBookingWithPayment}
        processing={processingBooking}
      />
    </div>
  );
}

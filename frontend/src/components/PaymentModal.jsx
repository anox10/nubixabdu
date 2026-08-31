import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  QrCode,
  Smartphone,
  Check,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, bookingDetails, onConfirmPayment, processing }) {
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [onlineTab, setOnlineTab] = useState('qr'); // 'qr' | 'upi' | 'card'

  // Card form state
  const [cardName, setCardName] = useState('John Doe');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('321');

  // UPI state
  const [upiId, setUpiId] = useState('patient@okhdfcbank');
  const [isQrScanned, setIsQrScanned] = useState(false);

  if (!isOpen || !bookingDetails) return null;

  const consultationFee = bookingDetails.doctor?.consultation_fee || 120;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmPayment(paymentMethod);
  };

  const quickUpiHandles = ['@okhdfcbank', '@ybl', '@paytm', '@ibl', '@axl'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">Appointment Payment Step</h3>
              <p className="text-xs text-green-100">Select payment method to complete hospital booking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Appointment summary banner */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block font-semibold">Consultation with</span>
            <span className="font-extrabold text-slate-900 text-sm">{bookingDetails.doctor?.name}</span>
            <span className="text-slate-500 block text-[11px]">
              📅 {bookingDetails.date} • ⏰ {bookingDetails.time_slot}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block font-semibold">Total Fee</span>
            <span className="text-lg font-black text-green-700">₹{consultationFee}</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Method Selection Tiles */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('online')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                paymentMethod === 'online'
                  ? 'border-green-500 bg-green-50/60 ring-2 ring-green-500/20 text-green-950'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <CreditCard className={`w-5 h-5 ${paymentMethod === 'online' ? 'text-green-600' : 'text-slate-400'}`} />
                {paymentMethod === 'online' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
              </div>
              <div>
                <span className="font-extrabold text-xs block">1. Pay Online</span>
                <span className="text-[10px] text-slate-500">QR Code / UPI / Card</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('pay_at_reception')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                paymentMethod === 'pay_at_reception'
                  ? 'border-green-500 bg-green-50/60 ring-2 ring-green-500/20 text-green-950'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <Building className={`w-5 h-5 ${paymentMethod === 'pay_at_reception' ? 'text-green-600' : 'text-slate-400'}`} />
                {paymentMethod === 'pay_at_reception' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
              </div>
              <div>
                <span className="font-extrabold text-xs block">2. Pay at Reception</span>
                <span className="text-[10px] text-slate-500">Cash / POS upon arrival</span>
              </div>
            </button>
          </div>

          {/* Conditional Online Payment Sub-Tabs */}
          {paymentMethod === 'online' ? (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-4">
              {/* Online Payment Mode Switcher */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setOnlineTab('qr')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                    onlineTab === 'qr'
                      ? 'bg-green-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOnlineTab('upi')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                    onlineTab === 'upi'
                      ? 'bg-green-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>UPI ID / VPA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOnlineTab('card')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                    onlineTab === 'card'
                      ? 'bg-green-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Debit / Card</span>
                </button>
              </div>

              {/* Sub-tab 1: QR Code */}
              {onlineTab === 'qr' && (
                <div className="text-center space-y-3 pt-1">
                  <div className="inline-block p-3 bg-white rounded-2xl border border-slate-200 shadow-sm relative group">
                    {/* Interactive Custom Hospital QR SVG */}
                    <svg
                      className="w-36 h-36 mx-auto"
                      viewBox="0 0 140 140"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="140" height="140" rx="10" fill="white" />
                      {/* Outer Position Markers */}
                      <rect x="10" y="10" width="36" height="36" rx="6" fill="#15803d" />
                      <rect x="16" y="16" width="24" height="24" rx="3" fill="white" />
                      <rect x="22" y="22" width="12" height="12" rx="2" fill="#15803d" />

                      <rect x="94" y="10" width="36" height="36" rx="6" fill="#15803d" />
                      <rect x="100" y="16" width="24" height="24" rx="3" fill="white" />
                      <rect x="106" y="22" width="12" height="12" rx="2" fill="#15803d" />

                      <rect x="10" y="94" width="36" height="36" rx="6" fill="#15803d" />
                      <rect x="16" y="100" width="24" height="24" rx="3" fill="white" />
                      <rect x="22" y="106" width="12" height="12" rx="2" fill="#15803d" />

                      {/* QR Pattern Data Dots */}
                      <rect x="54" y="14" width="8" height="8" rx="1" fill="#1e293b" />
                      <rect x="68" y="14" width="8" height="8" rx="1" fill="#1e293b" />
                      <rect x="54" y="28" width="8" height="8" rx="1" fill="#1e293b" />
                      <rect x="78" y="28" width="8" height="8" rx="1" fill="#1e293b" />

                      <rect x="14" y="54" width="8" height="8" rx="1" fill="#1e293b" />
                      <rect x="28" y="68" width="8" height="8" rx="1" fill="#1e293b" />
                      <rect x="14" y="78" width="8" height="8" rx="1" fill="#1e293b" />

                      {/* Center Brand Indicator */}
                      <rect x="52" y="52" width="36" height="36" rx="8" fill="#15803d" />
                      <path
                        d="M70 60 V80 M60 70 H80"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />

                      {/* Bottom Right Pattern */}
                      <rect x="94" y="54" width="8" height="8" rx="1" fill="#1e293b" />
                      <rect x="108" y="68" width="8" height="8" rx="1" fill="#1e293b" />
                      <rect x="122" y="54" width="8" height="8" rx="1" fill="#1e293b" />
                      <rect x="94" y="78" width="8" height="8" rx="1" fill="#1e293b" />

                      <rect x="54" y="94" width="8" height="8" rx="1" fill="#1e293b" />
                      <rect x="68" y="108" width="8" height="8" rx="1" fill="#1e293b" />
                      <rect x="54" y="122" width="8" height="8" rx="1" fill="#1e293b" />
                      <rect x="78" y="108" width="8" height="8" rx="1" fill="#1e293b" />

                      <rect x="94" y="94" width="8" height="8" rx="1" fill="#1e293b" />
                      <rect x="108" y="108" width="8" height="8" rx="1" fill="#1e293b" />
                      <rect x="122" y="94" width="8" height="8" rx="1" fill="#1e293b" />
                      <rect x="94" y="122" width="8" height="8" rx="1" fill="#1e293b" />
                      <rect x="122" y="122" width="8" height="8" rx="1" fill="#1e293b" />
                    </svg>

                    {isQrScanned && (
                      <div className="absolute inset-0 bg-green-900/90 rounded-2xl flex flex-col items-center justify-center text-white p-2 animate-fade-in">
                        <CheckCircle2 className="w-8 h-8 text-green-300 mb-1" />
                        <span className="text-[11px] font-black">UPI App Connected</span>
                        <span className="text-[9px] text-green-200">Ready to complete payment</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-black text-slate-800">
                      <span>Scan to pay</span>
                      <span className="text-green-700 font-extrabold text-sm">₹{consultationFee}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Scan using Google Pay, PhonePe, Paytm, BHIM, or any UPI app
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">UPI ID: clinora.hospital@upi</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsQrScanned(!isQrScanned)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 text-[10px] font-bold rounded-lg transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-green-600" />
                    <span>{isQrScanned ? 'Reset QR Scan' : 'Simulate Scanner Detection'}</span>
                  </button>
                </div>
              )}

              {/* Sub-tab 2: UPI ID / VPA */}
              {onlineTab === 'upi' && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Enter UPI ID / Virtual Payment Address
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@bank or 9876543210@paytm"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Handles:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {quickUpiHandles.map((handle) => (
                        <button
                          key={handle}
                          type="button"
                          onClick={() => {
                            const prefix = upiId.split('@')[0] || 'patient';
                            setUpiId(prefix + handle);
                          }}
                          className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md border border-slate-200"
                        >
                          {handle}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 bg-green-50/80 border border-green-200 rounded-xl text-[11px] text-green-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>A collect request for <strong>₹{consultationFee}</strong> will be sent to your UPI app.</span>
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Card */}
              {onlineTab === 'card' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-[10px] font-extrabold uppercase text-slate-600">Simulated Card Gateway</span>
                    </div>
                    <div className="flex gap-1 text-[10px] font-bold text-slate-400">
                      <span className="px-1.5 py-0.5 bg-white rounded border">VISA</span>
                      <span className="px-1.5 py-0.5 bg-white rounded border">MC</span>
                      <span className="px-1.5 py-0.5 bg-white rounded border">AMEX</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-mono font-semibold bg-white outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-mono font-semibold bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-mono font-semibold bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-extrabold text-amber-900">
                <Building className="w-4 h-4 text-amber-700" />
                <span>Hospital Front Desk Payment</span>
              </div>
              <p className="leading-relaxed text-slate-700">
                Your appointment will be reserved with status <strong>Payment Pending</strong>. Please arrive 10 minutes prior to your slot to settle consultation fees at the main reception counter.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              <span>
                {processing
                  ? 'Processing Booking...'
                  : paymentMethod === 'online'
                  ? `Pay ₹${consultationFee} & Book`
                  : 'Confirm Booking (Pay Later)'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

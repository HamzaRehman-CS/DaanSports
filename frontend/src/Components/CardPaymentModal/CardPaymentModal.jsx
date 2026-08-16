import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, CheckCircle, ShieldAlert, Tag, Sparkles } from 'lucide-react';
import { API_URL } from '../../config';


const CardPaymentModal = ({
  isOpen,
  onClose,
  subtotalAmount,
  cartValue,
  totalUnits,
  items,
  userEmail,
  availableVouchers = [],
  initialVoucherCode = '',
  initialDiscountAmount = 0,
  onSuccess
}) => {
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Payment section voucher states
  const [voucherCodeInput, setVoucherCodeInput] = useState(initialVoucherCode || '');
  const [appliedVoucher, setAppliedVoucher] = useState(initialVoucherCode ? { code: initialVoucherCode } : null);
  const [discountAmount, setDiscountAmount] = useState(initialDiscountAmount || 0);
  const [voucherMsg, setVoucherMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    setVoucherCodeInput(initialVoucherCode || '');
    setDiscountAmount(initialDiscountAmount || 0);
    setAppliedVoucher(initialVoucherCode ? { code: initialVoucherCode } : null);
  }, [initialVoucherCode, initialDiscountAmount]);

  if (!isOpen) return null;

  const baseSubtotal = subtotalAmount !== undefined ? subtotalAmount : (cartValue || 0);
  const finalPayable = Math.max(0, baseSubtotal - discountAmount);

  const handleCardFormat = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(val);
  };

  const handleExpiryFormat = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setExpiry(val.substring(0, 5));
  };

  const getCardBrand = (num) => {
    const n = num.replace(/\s/g, '');
    if (n.startsWith('4')) return 'Visa';
    if (n.startsWith('5')) return 'Mastercard';
    if (n.startsWith('3')) return 'American Express';
    if (n.startsWith('6')) return 'Discover';
    return 'Credit Card';
  };

  const handleApplyVoucherInPayment = async () => {
    if (!voucherCodeInput.trim()) return;
    setVoucherMsg({ type: '', text: '' });

    try {
      const res = await fetch(`${API_URL}/apply-voucher`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ code: voucherCodeInput.trim(), subtotal: cartValue || baseSubtotal })
      });
      const data = await res.json();

      if (data.success) {
        setAppliedVoucher(data.voucher);
        setDiscountAmount(data.discountAmount);
        setVoucherMsg({ type: 'success', text: `Voucher "${data.voucher.code}" applied! -$${data.discountAmount.toFixed(2)} USD` });
      } else {
        setVoucherMsg({ type: 'error', text: data.error || "Invalid voucher code." });
      }
    } catch (err) {
      setVoucherMsg({ type: 'error', text: err.message });
    }
  };


  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (cardNumber.replace(/\s/g, '').length < 15) {
      setErrorMsg('Please enter a valid 16-digit card number.');
      return;
    }
    if (expiry.length < 5) {
      setErrorMsg('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cvc.length < 3) {
      setErrorMsg('Please enter a valid 3 or 4 digit CVC code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: cardHolder || "B2B Business Buyer",
        userEmail: userEmail || "buyer@sportsbrand.com",
        phone: phone || "+1 555-0199",
        items: items || [],
        totalUnits: totalUnits || 50,
        totalAmount: Number(finalPayable.toFixed(2)),
        discountAmount: discountAmount || 0,
        voucherCode: appliedVoucher ? appliedVoucher.code : "",
        paymentMethod: "Credit Card",
        cardDetails: {
          number: cardNumber.replace(/\s/g, ''),
          brand: getCardBrand(cardNumber)
        },
        notes: notes || "Direct Card Authorized Wholesale Order"
      };

      const res = await fetch(`${API_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();

      if (data.success) {
        if (onSuccess) onSuccess(data.order);
        onClose();
      } else {
        setErrorMsg(data.error || "Order placement failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-up">
      <div className="bg-[#18181b] border border-white/20 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl relative text-white max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-[#0a0a0a] px-6 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#dc2626] rounded-lg text-white">
              <CreditCard size={20} />
            </div>
            <div>
              <h3 className="font-display font-black italic uppercase text-lg text-white tracking-wider">
                B2B Payment Section
              </h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                256-Bit SSL Encrypted Instant Wholesale Checkout
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Order Summary Ribbon */}
        <div className="bg-zinc-900/90 px-6 py-3 border-b border-white/10 flex justify-between items-center text-xs font-bold uppercase tracking-wider">
          <span className="text-zinc-400">Total Payable ({totalUnits || 0} Pcs):</span>
          <div className="text-right">
            {discountAmount > 0 && (
              <span className="text-[10px] text-emerald-400 block line-through mr-1 opacity-80">
                ${Number(baseSubtotal).toFixed(2)}
              </span>
            )}
            <span className="text-xl font-black text-white font-display">${Number(finalPayable).toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Section Voucher Promo - Only Shown if Active Vouchers Exist */}
        {availableVouchers && availableVouchers.length > 0 && (
          <div className="bg-[#0a0a0a] px-6 py-3 border-b border-white/10 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-white uppercase tracking-wider">
              <Tag size={13} className="text-[#dc2626]" />
              <span>Apply Discount Voucher in Payment</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. GOCART20 or DAAN50"
                value={voucherCodeInput}
                onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                className="flex-1 bg-[#18181b] border border-white/20 rounded px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#dc2626] uppercase"
              />
              <button
                type="button"
                onClick={handleApplyVoucherInPayment}
                className="bg-white text-[#0a0a0a] px-3 py-1.5 font-bold text-xs uppercase tracking-wider hover:bg-[#dc2626] hover:text-white transition-colors"
              >
                Apply
              </button>
            </div>
            {voucherMsg.text && (
              <p className={`text-[10px] font-bold ${voucherMsg.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {voucherMsg.text}
              </p>
            )}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmitPayment} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="bg-red-950/80 border border-red-500/50 text-red-200 px-4 py-2.5 rounded text-xs flex items-center gap-2">
              <ShieldAlert size={16} className="shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
              Cardholder Business Name *
            </label>
            <input 
              type="text"
              required
              placeholder="e.g. Apex Athletics Ltd."
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/20 rounded p-3 text-xs font-bold text-white focus:outline-none focus:border-[#dc2626] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1 flex justify-between">
              <span>Card Number *</span>
              <span className="text-[#dc2626] font-bold">{getCardBrand(cardNumber)}</span>
            </label>
            <div className="relative">
              <input 
                type="text"
                required
                placeholder="4000 0000 0000 0000"
                value={cardNumber}
                onChange={handleCardFormat}
                className="w-full bg-[#0a0a0a] border border-white/20 rounded p-3 pl-10 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#dc2626] transition-colors"
              />
              <CreditCard size={18} className="absolute left-3 top-3 text-zinc-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                Expiry Date *
              </label>
              <input 
                type="text"
                required
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryFormat}
                className="w-full bg-[#0a0a0a] border border-white/20 rounded p-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#dc2626] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1 flex justify-between">
                <span>CVC Code *</span>
                <Lock size={12} className="text-zinc-500" />
              </label>
              <input 
                type="password"
                required
                maxLength={4}
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#0a0a0a] border border-white/20 rounded p-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#dc2626] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                Contact Phone
              </label>
              <input 
                type="tel"
                placeholder="+1 555 0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/20 rounded p-3 text-xs font-bold text-white focus:outline-none focus:border-[#dc2626] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                Account Email
              </label>
              <input 
                type="email"
                readOnly
                value={userEmail || "buyer@sportsbrand.com"}
                className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded p-3 text-xs font-medium text-zinc-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
              Custom Logo / Production Notes (Optional)
            </label>
            <input 
              type="text"
              placeholder="e.g. Custom 3D Embroidery on left chest"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/20 rounded p-3 text-xs font-medium text-white focus:outline-none focus:border-[#dc2626] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#dc2626] text-white py-3.5 px-6 font-display font-black italic uppercase text-sm tracking-wider hover:bg-white hover:text-[#0a0a0a] transition-all duration-300 transform -skew-x-6 cursor-pointer mt-4 flex items-center justify-center gap-2 shadow-xl"
          >
            {isSubmitting ? (
              <span>Authorizing B2B Order...</span>
            ) : (
              <>
                <CheckCircle size={16} className="skew-x-6" />
                <span className="skew-x-6 inline-block">Confirm Order & Pay ${Number(finalPayable).toFixed(2)}</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-zinc-500 uppercase tracking-widest pt-2">
            🔒 Protected by 256-Bit SSL Encryption • Instant Order Dispatch Notification
          </p>

        </form>
      </div>
    </div>
  );
};

export default CardPaymentModal;

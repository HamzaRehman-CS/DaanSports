import React, { useContext, useState } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import { useUser } from '@clerk/clerk-react';
import { Trash2, CreditCard, Tag, ArrowRight, ShieldCheck, FileText, ShoppingBag } from 'lucide-react';
import CardPaymentModal from '../CardPaymentModal/CardPaymentModal';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../../config';
import { fetchCloudVouchers, createCloudOrder, loadVouchers } from '../../Context/defaultCatalog';

const CartItems = () => {
  const { user, isSignedIn } = useUser();
  const { all_product, cartItems, removeFromCart, getTotalCartValue, getTotalCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const cartValue = getTotalCartValue();
  const totalUnits = getTotalCartItems();
  
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherMsg, setVoucherMsg] = useState({ type: '', text: '' });
  const [availableVouchers, setAvailableVouchers] = useState(() => loadVouchers());

  React.useEffect(() => {
    fetchCloudVouchers().then(data => {
      if (Array.isArray(data) && data.length > 0) setAvailableVouchers(data);
    }).catch(() => {});
  }, []);

  const baseFreight = cartValue > 1000 ? 0 : (cartValue > 0 ? 150 : 0);
  const rawTotal = cartValue + baseFreight;
  const grandTotal = Math.max(0, rawTotal - discountAmount);

  const userEmail = isSignedIn 
    ? (user?.primaryEmailAddress?.emailAddress || user?.emailAddresses[0]?.emailAddress || "")
    : (localStorage.getItem('user-email') || "buyer@sportsbrand.com");

  const getActiveCartProducts = () => {
    if (!all_product) return [];
    return all_product.filter(p => cartItems && cartItems[p.id] > 0);
  };

  const activeCartList = getActiveCartProducts();

  const handleApplyVoucher = async () => {
    if (!voucherCodeInput.trim()) return;
    setVoucherMsg({ type: '', text: '' });
    const code = voucherCodeInput.trim().toUpperCase();

    // 1. Try local/cloud voucher check
    const matchedVoucher = (availableVouchers || []).find(v => (v.code || '').toUpperCase() === code);
    if (matchedVoucher) {
      const minReq = Number(matchedVoucher.min_order !== undefined ? matchedVoucher.min_order : (matchedVoucher.minOrder || 0));
      if (cartValue < minReq) {
        setVoucherMsg({ type: 'error', text: `Minimum order of $${minReq} required for voucher "${code}".` });
        return;
      }
      let disc = 0;
      if (matchedVoucher.type === 'percent') {
        disc = (cartValue * Number(matchedVoucher.discount)) / 100;
      } else {
        disc = Number(matchedVoucher.discount);
      }
      disc = Math.min(cartValue, disc);
      setAppliedVoucher(matchedVoucher);
      setDiscountAmount(disc);
      setVoucherMsg({ type: 'success', text: `Voucher "${code}" applied! Discount -$${disc.toFixed(2)} USD` });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/apply-voucher`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ code: code, subtotal: cartValue })
      });
      const data = await res.json();

      if (data.success) {
        setAppliedVoucher(data.voucher);
        setDiscountAmount(data.discountAmount);
        setVoucherMsg({ type: 'success', text: `Voucher "${data.voucher.code}" applied! Discount -$${data.discountAmount.toFixed(2)} USD` });
      } else {
        setVoucherMsg({ type: 'error', text: data.error || "Invalid voucher code." });
      }
    } catch (err) {
      setVoucherMsg({ type: 'error', text: "Invalid or inactive voucher code." });
    }
  };

  const handleWireOrderSubmission = async () => {
    if (totalUnits === 0) return;

    try {
      const selectedItems = activeCartList.map(p => ({
        id: p.id,
        name: p.name,
        qty: cartItems[p.id],
        price: p.new_price
      }));

      const orderPayload = {
        customerName: user?.fullName || "Wholesale Buyer",
        userEmail: userEmail,
        phone: "+1 555-0199",
        items: selectedItems,
        totalUnits: totalUnits,
        totalAmount: Number(grandTotal.toFixed(2)),
        discountAmount: discountAmount,
        voucherCode: appliedVoucher ? appliedVoucher.code : "",
        paymentMethod: "Wire Transfer / Pro-Forma Invoice",
        notes: "Pro-Forma Invoice Requested by Buyer"
      };

      try {
        const res = await fetch(`${API_URL}/create-order`, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload)
        });
        const data = await res.json();
        if (data.success) {
          navigate('/orders');
          return;
        }
      } catch (err) {}

      // Direct Supabase Fallback
      const supaOrder = await createCloudOrder(orderPayload);
      if (supaOrder && supaOrder.success) {
        navigate('/orders');
      } else {
        alert("Failed to submit order. Please try again.");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#0a0a0a] min-h-screen text-white px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-black text-[#dc2626] uppercase tracking-widest block mb-1">WHOLESALE BASKET</span>
            <h1 className="text-4xl md:text-5xl font-display font-black italic uppercase text-white">
              Order Cart & Summary
            </h1>
          </div>
          <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
            Account: <strong className="text-white">{userEmail}</strong>
          </div>
        </div>

        {activeCartList.length === 0 ? (
          <div className="bg-[#18181b] border border-white/10 rounded-xl p-16 text-center max-w-lg mx-auto my-12 shadow-2xl">
            <ShoppingBag size={48} className="mx-auto text-zinc-600 mb-4" />
            <h3 className="font-display font-black italic uppercase text-2xl text-white mb-2">Your Cart is Empty</h3>
            <p className="text-zinc-400 text-sm mb-8">Browse our wholesale collections to add products to your quotation order.</p>
            <Link to="/tracksuits" className="inline-block bg-[#dc2626] text-white px-8 py-3.5 font-display font-black italic uppercase text-xs tracking-wider transform -skew-x-12 hover:bg-white hover:text-[#0a0a0a] transition-all shadow-xl">
              <span className="skew-x-12 inline-block">Explore Wholesale Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Items Table Column (8 Cols / 61.8% Golden Split) */}
            <div className="lg:col-span-8 space-y-4">
              
              {activeCartList.map((item) => {
                const qty = cartItems[item.id];
                const subtotal = item.new_price * qty;

                return (
                  <div key={item.id} className="bg-[#18181b] border border-white/10 rounded-xl p-4 md:p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
                    <div className="w-28 aspect-[16/9] overflow-hidden rounded bg-[#0a0a0a] border border-white/10 shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <span className="text-[10px] font-black text-[#dc2626] uppercase tracking-widest block mb-1">
                        {item.category || "Apparel"}
                      </span>
                      <h3 className="font-bold text-white text-base mb-1">{item.name}</h3>
                      <div className="text-xs text-zinc-400 font-medium">
                        Unit Price: <strong className="text-white">${Number(item.new_price).toFixed(2)}</strong> / pc
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="bg-[#0a0a0a] border border-white/20 px-3 py-1.5 rounded font-mono font-bold text-xs text-white">
                        {qty} Pcs
                      </div>

                      <div className="text-right min-w-24">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase block">Subtotal</span>
                        <strong className="text-white font-display text-lg font-black">${subtotal.toFixed(2)}</strong>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-500 hover:text-[#dc2626] p-2 transition-colors cursor-pointer ml-2"
                        title="Remove Item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* Order Summary & Payment Column (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-[#18181b] border border-white/10 rounded-xl p-6 shadow-2xl space-y-4">
                <h3 className="font-display font-black italic uppercase text-lg text-white border-b border-white/10 pb-3">
                  Payment Summary
                </h3>

                <div className="space-y-2.5 text-xs text-zinc-300">
                  <div className="flex justify-between">
                    <span>Total Quantity</span>
                    <strong className="text-white">{totalUnits} Pcs</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white">${cartValue.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Voucher Discount ({appliedVoucher?.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated Freight (Air Express)</span>
                    <span className="text-white">{cartValue > 1000 ? 'FREE' : '$150.00'}</span>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                    <span className="font-display font-black italic uppercase text-sm text-white">Grand Total</span>
                    <span className="font-display font-black italic text-2xl text-white">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <div className="space-y-3 pt-4">
                  <button
                    onClick={() => setIsCardModalOpen(true)}
                    className="w-full bg-[#dc2626] text-white py-3.5 px-4 font-display font-black italic uppercase text-xs tracking-wider hover:bg-white hover:text-[#0a0a0a] transition-all transform -skew-x-6 cursor-pointer shadow-xl flex items-center justify-center gap-2"
                  >
                    <CreditCard size={16} className="skew-x-6" />
                    <span className="skew-x-6 inline-block">Pay via Card (${grandTotal.toFixed(2)})</span>
                  </button>

                  <button
                    onClick={handleWireOrderSubmission}
                    className="w-full bg-[#0a0a0a] border border-white/20 text-white py-3 px-4 font-display font-black italic uppercase text-xs tracking-wider hover:border-white transition-all transform -skew-x-6 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FileText size={16} className="skew-x-6" />
                    <span className="skew-x-6 inline-block">Request Pro-Forma Invoice (Wire)</span>
                  </button>
                </div>

              </div>

              {/* Voucher Card - Only shown if active vouchers exist */}
              {availableVouchers && availableVouchers.length > 0 && (
                <div className="bg-[#18181b] border border-white/10 rounded-xl p-6 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                    <Tag size={14} className="text-[#dc2626]" />
                    <span>Have a Promo Voucher?</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. GOCART20 or DAAN50"
                      value={voucherCodeInput}
                      onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-[#0a0a0a] border border-white/20 rounded p-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#dc2626] uppercase"
                    />
                    <button
                      onClick={handleApplyVoucher}
                      className="bg-white text-[#0a0a0a] px-4 py-2.5 font-display font-black italic text-xs uppercase tracking-wider hover:bg-[#dc2626] hover:text-white transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>

                  {voucherMsg.text && (
                    <p className={`text-[11px] font-bold ${voucherMsg.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {voucherMsg.text}
                    </p>
                  )}
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      <CardPaymentModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        subtotalAmount={rawTotal}
        cartValue={cartValue}
        totalUnits={totalUnits}
        items={activeCartList.map(p => ({ id: p.id, name: p.name, price: p.new_price, quantity: cartItems[p.id] }))}
        userEmail={userEmail}
        availableVouchers={availableVouchers}
        initialVoucherCode={appliedVoucher?.code}
        initialDiscountAmount={discountAmount}
        onSuccess={() => navigate('/orders')}
      />
    </div>
  );
};

export default CartItems;

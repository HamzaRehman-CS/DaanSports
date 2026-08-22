import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { SUPABASE_URL, supabaseHeaders } from '../Context/defaultCatalog';

const CustomerOrders = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = isSignedIn 
    ? (user?.primaryEmailAddress?.emailAddress || user?.emailAddresses[0]?.emailAddress || "")
    : (localStorage.getItem('user-email') || "buyer@sportsbrand.com");

  const fetchUserOrders = async () => {
    if (!userEmail) {
      setLoading(false);
      setOrders([]);
      return;
    }

    setLoading(true);
    try {
      // 1. Try Supabase direct query
      const emailEncoded = encodeURIComponent(userEmail.toLowerCase().trim());
      const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?user_email=eq.${emailEncoded}&order=created_at.desc`, {
        headers: supabaseHeaders
      });
      if (supaRes.ok) {
        const supaData = await supaRes.json();
        if (Array.isArray(supaData) && supaData.length > 0) {
          const mapped = supaData.map(o => ({
            id: o.id,
            createdAt: o.created_at,
            customerName: o.customer_name,
            discountAmount: o.discount_amount,
            items: o.items,
            notes: o.notes,
            paymentMethod: o.payment_method,
            paymentStatus: o.payment_status,
            phone: o.phone,
            status: o.status,
            totalAmount: o.total_amount,
            totalUnits: o.total_units,
            trackingNumber: o.tracking_number,
            userEmail: o.user_email,
            voucherCode: o.voucher_code
          }));
          setOrders(mapped);
          setLoading(false);
          return;
        }
      }

      // 2. Fallback to API_URL
      const res = await fetch(`${API_URL}/user-orders?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isLoaded) {
      fetchUserOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, userEmail]);

  const getStepProgress = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes('delivered')) return 4;
    if (s.includes('shipped')) return 3;
    if (s.includes('production') || s.includes('processing')) return 2;
    if (s.includes('cancelled')) return 0;
    return 1;
  };

  return (
    <div className="pt-28 pb-24 bg-[#0a0a0a] min-h-screen text-white px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-[#18181b] border border-white/10 p-8 md:p-12 rounded-xl mb-10 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <span className="inline-block bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 mb-3 transform -skew-x-12">
              <span className="skew-x-12 inline-block">SECURED B2B PORTAL</span>
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-black italic uppercase text-white mb-2">
              Track Private Orders & Shipments
            </h1>
            <p className="text-zinc-400 text-sm">
              Live manufacturing updates & airway tracking for <strong className="text-white">{userEmail}</strong>
            </p>
          </div>
        </div>

        {/* Orders Content */}
        {loading ? (
          <div className="py-20 text-center text-zinc-500 font-display font-black italic text-xl animate-pulse">
            Loading Order History...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#18181b] border border-white/10 rounded-xl p-16 text-center max-w-lg mx-auto shadow-2xl">
            <Package size={48} className="mx-auto text-zinc-600 mb-4" />
            <h3 className="font-display font-black italic uppercase text-2xl text-white mb-2">No Active Orders</h3>
            <p className="text-zinc-400 text-sm mb-8">Place an order or request a pro-forma invoice to start live tracking for {userEmail}.</p>
            <Link to="/tracksuits" className="inline-block bg-white text-[#0a0a0a] px-8 py-3.5 font-display font-black italic uppercase text-xs tracking-wider transform -skew-x-12 hover:bg-[#dc2626] hover:text-white transition-all shadow-xl">
              <span className="skew-x-12 inline-block">Browse Collections & Place Order</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((ord) => {
              const stepNum = getStepProgress(ord.status);
              const isCancelled = ord.status === "Cancelled";

              return (
                <div key={ord.id} className="bg-[#18181b] border border-white/10 rounded-xl p-6 md:p-8 shadow-2xl space-y-6">
                  
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded ${
                          isCancelled ? 'bg-red-500/20 text-red-400' : 'bg-[#dc2626] text-white'
                        }`}>
                          {isCancelled ? 'CANCELLED' : 'WHOLESALE ORDER'}
                        </span>
                        <h3 className="font-display font-black italic text-xl text-white">{ord.id}</h3>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Date Placed: {new Date(ord.createdAt || Date.now()).toLocaleDateString()} • Payment: <strong className="text-white">{ord.paymentMethod}</strong>
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-zinc-400 uppercase font-bold">Total ({ord.totalUnits || 50} Pcs)</div>
                      <div className="font-display font-black italic text-2xl text-white">${Number(ord.totalAmount).toFixed(2)}</div>
                    </div>
                  </div>

                  {/* 4-Step Stepper */}
                  {!isCancelled ? (
                    <div className="py-4">
                      <div className="grid grid-cols-4 gap-2 relative">
                        {[
                          { num: 1, title: "Order Submitted" },
                          { num: 2, title: "In Production" },
                          { num: 3, title: "Airway Shipped" },
                          { num: 4, title: "Delivered" }
                        ].map((s) => {
                          const isDone = stepNum >= s.num;
                          return (
                            <div key={s.num} className="flex flex-col items-center text-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-sm mb-2 border transition-all ${
                                isDone ? 'bg-[#dc2626] border-[#dc2626] text-white shadow-lg' : 'bg-[#0a0a0a] border-white/20 text-zinc-600'
                              }`}>
                                {s.num}
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDone ? 'text-white' : 'text-zinc-500'}`}>
                                {s.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-950/40 border border-red-500/30 p-4 rounded text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-400" />
                      <span>This order was cancelled. Payment refunded or voided.</span>
                    </div>
                  )}

                  {/* Live Status Box */}
                  <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg text-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] animate-ping"></span>
                      <strong className="text-white uppercase font-bold">Status: {ord.status} ({ord.paymentStatus || 'Authorized'})</strong>
                    </div>

                    {ord.trackingNumber && (
                      <div className="text-zinc-300 pt-2 border-t border-white/10">
                        Airway Bill / Tracking #: <strong className="text-emerald-400 font-mono">{ord.trackingNumber}</strong>
                      </div>
                    )}

                    {ord.notes && (
                      <div className="text-zinc-400 pt-1">
                        Factory Notes: <span className="text-zinc-200 italic">"{ord.notes}"</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerOrders;

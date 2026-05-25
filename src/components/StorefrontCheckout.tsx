/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useDb } from '../dbContext';
import { Send, MapPin, Truck, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';

interface CheckoutProps {
  onNavigate: (route: string) => void;
}

export default function StorefrontCheckout({ onNavigate }: CheckoutProps) {
  const {
    cart,
    products,
    deliveryZones,
    createOrder,
    clearCart,
    currentUser
  } = useDb();

  // Load applied coupon from Cart step if stored
  const [coupon, setCoupon] = useState<any>(null);

  // Form Fields
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phoneNo, setPhoneNo] = useState(currentUser?.phone || '');
  const [emailAddress, setEmailAddress] = useState(currentUser?.email || '');
  const [shippingAddress, setShippingAddress] = useState(currentUser?.address || '');
  const [district, setDistrict] = useState(currentUser?.district || '');
  const [thana, setThana] = useState(currentUser?.thana || '');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const savedCoupon = localStorage.getItem('ht_applied_coupon');
    if (savedCoupon) {
      setCoupon(JSON.parse(savedCoupon));
    }
    
    // Choose first delivery zone as default
    if (deliveryZones.length > 0) {
      setSelectedZoneId(deliveryZones[0].id);
    }
  }, [deliveryZones]);

  // Hydrate cart item data
  const cartItems = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    return {
      ...item,
      product: prod
    };
  }).filter(item => item.product !== undefined);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-mono space-y-4">
        <p className="text-slate-500">⚠️ No active products inside your checkout cart.</p>
        <button onClick={() => onNavigate('#shop')} className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs font-mono">
          Return to showroom Catalog
        </button>
      </div>
    );
  }

  // Mathematics Sum calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product!.discountPrice || item.product!.price;
    return acc + (price * item.quantity);
  }, 0);

  const discountAmount = coupon
    ? (coupon.type === 'percentage' ? Math.round((subtotal * coupon.value) / 100) : coupon.value)
    : 0;

  const currentZone = deliveryZones.find(z => z.id === selectedZoneId);
  const deliveryCharge = currentZone ? currentZone.charge : 0;
  const estimatedDays = currentZone ? currentZone.estimatedDays : '2-4 Days';

  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Field sanitizations & validations
    const cleanName = fullName.trim();
    const cleanPhone = phoneNo.trim();
    const cleanMail = emailAddress.trim();
    const cleanAddr = shippingAddress.trim();
    
    if (!cleanName || !cleanPhone || !cleanAddr || !district.trim() || !thana.trim()) {
      setFormError('⚠️ Please complete all required billing fields before order dispatch.');
      return;
    }

    // BD Mobile structure validations: (e.g. 01712345678, simple 11 digit length verify)
    if (!/^(?:\+88)?01[3-9]\d{8}$/.test(cleanPhone.replace(/[-\s]/g, ''))) {
      setFormError('⚠️ Please insert a valid 11-digit Bangladeshi mobile number.');
      return;
    }

    setLoading(true);

    // Map cart items format to OrderItems layout schema
    const orderItemsMapped = cartItems.map(itm => ({
      productId: itm.productId,
      productName: itm.product!.name,
      productImage: itm.product!.mainImage,
      price: itm.product!.discountPrice || itm.product!.price,
      quantity: itm.quantity,
      sku: itm.product!.sku
    }));

    setTimeout(() => {
      try {
        const orderCreated = createOrder({
          customerName: cleanName,
          customerPhone: cleanPhone,
          customerEmail: cleanMail,
          shippingAddress: cleanAddr,
          district: district.trim(),
          thana: thana.trim(),
          subtotal,
          deliveryCharge,
          discountAmount,
          couponCode: coupon?.code,
          total: grandTotal,
          paymentMethod: 'Cash on Delivery',
          notes: orderNotes.trim(),
          items: orderItemsMapped
        });

        // Cleanup values
        clearCart();
        localStorage.removeItem('ht_applied_coupon');
        setLoading(false);

        // Redirect directly to Thank You Receipt screen
        onNavigate(`#thank-you?orderId=${orderCreated.id}`);
      } catch (err) {
        setLoading(false);
        setFormError('⚠️ Critical failure compiling order nodes. Try refreshing.');
      }
    }, 1500); // realistic payment gateway dispatch wait simulation
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 transition-colors py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-8 border-b dark:border-slate-800 pb-3">Secure Shipping Dispatch Terminal</h1>

        {formError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm font-mono font-bold rounded-2xl animate-in fade-in">
            {formError}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Form Entries - Column 1 & 2 */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Shipping addresses coordinates */}
            <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-5 sm:p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase text-slate-450 font-mono border-b dark:border-slate-900 pb-3 flex items-center gap-1.5"><MapPin className="w-4.5 h-4.5 text-orange-500" /> Customer Information & Shipping address</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Receiver Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g. Tanvir Hossain"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-3 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">BD Active Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    placeholder="E.g. 01712345678"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-3 rounded-xl focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">District *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="E.g. Dhaka or Chittagong"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-3 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Thana / Subdistrict *</label>
                  <input
                    type="text"
                    required
                    value={thana}
                    onChange={(e) => setThana(e.target.value)}
                    placeholder="E.g. Mirpur, Uttara or Nasirabad"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-3 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Dispatch Email address (For Invoices)</label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="E.g. receiver@email.com"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-3 rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Detailed physical dispatch location *</label>
                <textarea
                  required
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="E.g. House No 4A, Flat 2B, Road 12, Sector 3, Uttara, Dhaka"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-3 rounded-xl focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>

            {/* Delivery zones selecting list */}
            <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-5 sm:p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase text-slate-450 font-mono border-b dark:border-slate-900 pb-3 flex items-center gap-1.5"><Truck className="w-4.5 h-4.5 text-orange-500" /> Select Delivery Zone</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {deliveryZones.map(zone => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZoneId(zone.id)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-24 ${selectedZoneId === zone.id ? 'border-orange-500 bg-orange-500/10 text-orange-400 font-bold' : 'border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-400'}`}
                  >
                    <div>
                      <h4 className="text-xs font-bold leading-tight">{zone.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">EST: {zone.estimatedDays}</p>
                    </div>
                    <span className="text-sm font-black font-mono mt-1">৳{zone.charge}</span>
                  </button>
                ))}
              </div>
              
              <p className="text-[10px] text-slate-450 font-mono leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border dark:border-slate-900">
                ⚠️ Cash on delivery orders undergo short phone confirmations from support desk agents before courier dispatches.
              </p>
            </div>

            {/* Order notes entries */}
            <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-5 sm:p-6 rounded-2xl shadow-xs space-y-2">
              <label className="text-xs font-bold uppercase text-slate-450 font-mono flex items-center gap-1.5"><FileText className="w-4 h-4 text-orange-500" /> Dispatch Instructions / Order Notes (optional)</label>
              <textarea
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="E.g. Please check and unpack items for physical test before handing over, or call before 3 PM..."
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-3 rounded-xl focus:outline-none resize-none font-mono"
              ></textarea>
            </div>

          </div>

          {/* Checkout Review Sidebar Column 3 */}
          <div className="space-y-6">
            
            {/* Cart products review panel */}
            <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-5 rounded-2xl shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-505 font-mono border-b dark:border-slate-900 pb-3">Booking Review list ({cartItems.length})</h4>
              
              <div className="max-h-[220px] overflow-y-auto space-y-3.5 pr-1">
                {cartItems.map(itm => (
                  <div key={itm.productId} className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 max-w-[170px]">
                      <img src={itm.product!.mainImage} alt={itm.product!.name} className="w-8 h-8 object-cover rounded border dark:border-slate-850 shrink-0" />
                      <div className="truncate">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{itm.product!.name}</p>
                        <p className="text-[10px] text-slate-450">QTY: {itm.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-350">৳{((itm.product!.discountPrice || itm.product!.price) * itm.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing breakdown and place order locks */}
            <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-6 rounded-2xl shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-505 font-mono border-b dark:border-slate-900 pb-3">Final Billing calculations</h4>
              
              <div className="space-y-3.5 text-xs font-mono">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Cart Items subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-500">
                    <span>Applied Coupon Saving</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-605 dark:text-slate-400">
                  <span>Courier delivery charge</span>
                  <span>+৳{deliveryCharge}</span>
                </div>

                <div className="border-t dark:border-slate-900 pt-4 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Amount on Delivery</span>
                  <span className="text-xl font-black text-orange-600 dark:text-orange-500 font-mono">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Locks rules */}
              <div className="p-3 bg-indigo-505/10 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-xl space-y-1.5 text-xs">
                <p className="font-bold text-slate-950 dark:text-white font-mono flex items-center gap-1">💵 PAYMENT METHOD: CASH ON DELIVERY</p>
                <p className="text-[10px] leading-relaxed text-slate-550 dark:text-slate-500 font-mono">Pay with cash to courier delivery rider when unpacking and inspecting physical devices directly at your doorsteps.</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-orange-600/10 flex items-center justify-center gap-2 cursor-pointer ${loading ? 'animate-pulse cursor-wait' : ''}`}
                  id="checkout-confirm-btn"
                >
                  {loading ? 'Compiling Invoice nodes...' : 'Place Cash On Delivery Order'}
                </button>
              </div>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
}

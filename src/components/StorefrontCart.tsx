/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDb } from '../dbContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Tag, Percent, Receipt } from 'lucide-react';

interface CartProps {
  onNavigate: (route: string) => void;
}

export default function StorefrontCart({ onNavigate }: CartProps) {
  const {
    cart,
    products,
    coupons,
    addToCart,
    removeFromCart,
    clearCart
  } = useDb();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof coupons[0] | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Hydrate cart item data with complete product properties
  const cartItems = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    return {
      ...item,
      product: prod
    };
  }).filter(item => item.product !== undefined);

  // Math sum tallies
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product!.discountPrice || item.product!.price;
    return acc + (price * item.quantity);
  }, 0);

  // Apply Coupon logic checks
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const findCp = coupons.find(cp => cp.code === code);
    if (!findCp) {
      setCouponError('❌ Coupon code not found in our database campaign records.');
      setAppliedCoupon(null);
      return;
    }

    // Check expiry
    const expDate = new Date(findCp.expiryDate);
    if (expDate < new Date()) {
      setCouponError('❌ This coupon has expired.');
      setAppliedCoupon(null);
      return;
    }

    // Check usage limits
    if (findCp.usageCount >= findCp.usageLimit) {
      setCouponError('❌ Usage limit reached for this coupon.');
      setAppliedCoupon(null);
      return;
    }

    // Check minimum order criteria
    if (findCp.minOrderAmount && subtotal < findCp.minOrderAmount) {
      setCouponError(`❌ Minimum order total of ৳${findCp.minOrderAmount.toLocaleString()} required to apply this coupon.`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(findCp);
    setCouponSuccess(`🎉 Coupon "${findCp.code}" applied successfully!`);
    setCouponCode('');
  };

  const discountAmount = appliedCoupon
    ? (appliedCoupon.type === 'percentage'
        ? Math.round((subtotal * appliedCoupon.value) / 100)
        : appliedCoupon.value)
    : 0;

  const grandTotal = Math.max(0, subtotal - discountAmount);

  // Save calculated coupon state to localStorage for Checkout Page to read!
  const proceedToCheckout = () => {
    if (appliedCoupon) {
      localStorage.setItem('ht_applied_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('ht_applied_coupon');
    }
    onNavigate('#checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-slate-400 font-mono space-y-6">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-950 border dark:border-slate-850 rounded-full flex items-center justify-center mx-auto text-orange-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">You haven&apos;t added any original electronic gears from our catalog showroom yet.</p>
        </div>
        <button
          onClick={() => onNavigate('#shop')}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs font-mono transition inline-flex items-center gap-2 cursor-pointer shadow-md shadow-orange-600/10"
        >
          Begin Tech Shopping <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 transition-colors py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-8">Shopping Cart Summary</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Detailed Items list */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-5 sm:p-6 rounded-2xl shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b dark:border-slate-900 pb-3">
              <span className="text-xs font-bold font-mono text-slate-500 uppercase">Selected Products</span>
              <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-300 font-mono font-bold">Clear All Items</button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-900">
              {cartItems.map(item => {
                const prod = item.product!;
                const price = prod.discountPrice || prod.price;
                const grandItemTotal = price * item.quantity;
                return (
                  <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* item thumbnail */}
                      <img src={prod.mainImage} alt={prod.name} className="w-16 h-16 object-cover rounded-xl border dark:border-slate-900 shadow-sm shrink-0" />
                      
                      <div>
                        <button
                          onClick={() => onNavigate(`#product/${prod.slug}`)}
                          className="font-bold text-slate-900 dark:text-white text-sm text-left hover:text-orange-500 transition line-clamp-1"
                        >
                          {prod.name}
                        </button>
                        <p className="text-[11px] font-mono text-slate-504 dark:text-slate-500">{prod.brand} • SKU: {prod.sku}</p>
                        <p className="text-xs font-mono font-bold text-orange-500 mt-1">৳{price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0">
                      {/* Qty update selectors */}
                      <div className="flex items-center bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-lg overflow-hidden font-mono text-xs max-w-[100px] h-9">
                        <button
                          onClick={() => addToCart(item.productId, -1)}
                          className="px-2.5 h-full hover:bg-slate-100 dark:hover:bg-slate-800 font-black"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-bold px-2.5">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item.productId, 1)}
                          className="px-2.5 h-full hover:bg-slate-100 dark:hover:bg-slate-810 font-black"
                        >
                          +
                        </button>
                      </div>

                      {/* item aggregate pricing */}
                      <div className="text-right min-w-[70px]">
                        <p className="text-[11px] text-slate-450 font-mono">SUBTOTAL</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white font-mono">৳{grandItemTotal.toLocaleString()}</p>
                      </div>

                      {/* Trash action */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-slate-400 hover:text-red-400 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-red-500/10 transition"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkout Totals Summary sidebar */}
          <div className="space-y-6">
            
            {/* Coupon codes box */}
            <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-5 rounded-2xl shadow-xs">
              <h4 className="text-xs font-bold uppercase text-slate-500 font-mono mb-3 flex items-center gap-1"><Tag className="w-4.5 h-4.5 text-orange-500" /> Apply Discount Coupon</h4>
              
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="E.g. HARKUCH20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-2.5 text-xs rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-orange-600 text-white rounded-xl text-xs font-bold font-mono transition"
                >
                  Verify
                </button>
              </form>

              {couponError && <p className="text-[11px] text-red-405 font-mono mt-2" id="coupon-error-txt">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-500 font-mono mt-2" id="coupon-success-txt">{couponSuccess}</p>}

              {/* Display active offer help tags */}
              <div className="mt-4 border-t dark:border-slate-900 pt-3 flex flex-col gap-1.5 text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-1 text-orange-400"><Percent className="w-3.5 h-3.5" /> <strong>HARKUCH20</strong> - 20% discount on Laptops (min ৳2,000)</span>
                <span className="flex items-center gap-1 text-orange-400"><Percent className="w-3.5 h-3.5" /> <strong>SAVE500</strong> - Flat ৳500 OFF (min ৳10,000)</span>
              </div>
            </div>

            {/* Totals computation box */}
            <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-6 rounded-2xl shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-500 font-mono border-b dark:border-slate-900 pb-3 flex items-center gap-1"><Receipt className="w-4.5 h-4.5 text-orange-500" /> Order Checkout summary</h4>
              
              <div className="space-y-3.5 text-xs font-mono">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Cart Items sum</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-500">
                    <span>Coupon Promo savings</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-605 dark:text-slate-400">
                  <span>Shipping delivery surcharge</span>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Calculated Next step</span>
                </div>

                <div className="border-t dark:border-slate-900 pt-4 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Estimate Grand Total</span>
                  <span className="text-xl font-black text-orange-600 dark:text-orange-500 font-mono">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={proceedToCheckout}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-orange-600/15 flex items-center justify-center gap-1.5 cursor-pointer"
                  id="cart-next-checkout-btn"
                >
                  Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

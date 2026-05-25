/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDb } from '../dbContext';
import { CheckCircle, Printer, Download, MapPin, Phone, Truck, ArrowRight, ShoppingBag } from 'lucide-react';

interface ThankYouProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export default function StorefrontThankYou({ onNavigate, currentRoute }: ThankYouProps) {
  const { orders } = useDb();

  // Extract orderId query param: e.g. #thank-you?orderId=HT-12345
  const getOrderId = () => {
    const hash = currentRoute || window.location.hash || '';
    const paramString = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(paramString);
    return params.get('orderId') || '';
  };

  const orderId = getOrderId();
  const order = orders.find(o => o.id === orderId);

  // Trigger professional web printing
  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-slate-400 font-mono space-y-4">
        <p className="text-sm">⚠️ Under construction or Invoice order not found.</p>
        <button onClick={() => onNavigate('#home')} className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-mono">
          Return to home
        </button>
      </div>
    );
  }

  // Calculate est. delivery date
  const orderDate = new Date(order.orderDate);
  const estDateMin = new Date(orderDate);
  estDateMin.setDate(orderDate.getDate() + (order.deliveryCharge === 80 ? 1 : 3));
  const estDateMax = new Date(orderDate);
  estDateMax.setDate(orderDate.getDate() + (order.deliveryCharge === 80 ? 2 : 5));

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 transition-colors py-12 print:bg-white print:text-black print:p-0">
      <div className="max-w-4xl mx-auto px-4 print:max-w-full">
        
        {/* Actions header control - Hidden in PDF prints */}
        <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
          <button
            onClick={() => onNavigate('#shop')}
            className="text-xs text-slate-500 hover:text-orange-500 font-mono font-bold flex items-center gap-1.5 transition"
          >
            ← Return to Gadget showroom
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4.5 py-2 bg-slate-900 hover:bg-orange-600 text-white border dark:border-slate-800 rounded-xl text-xs font-semibold font-mono transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF Invoice
            </button>
          </div>
        </div>

        {/* Invoice Body Card */}
        <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-3xl overflow-hidden shadow-2xl print:border-0 print:shadow-none p-6 sm:p-10 space-y-8">
          
          {/* Success Top banner */}
          <div className="text-center space-y-3 pb-8 border-b dark:border-slate-900 print:hidden text-slate-900 dark:text-white">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-9 h-9" />
            </div>
            <div>
              <h2 className="text-2xl font-black">Hold on Tight! Order Booked</h2>
              <p className="text-xs font-mono text-slate-500">Your Booking Reference is <span className="text-orange-500 font-extrabold">{order.id}</span></p>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">We loaded an automated copy of this invoice layout. A support agent will call your active phone <strong className="text-slate-800 dark:text-white font-mono">{order.customerPhone}</strong> shortly for address dispatch approvals.</p>
            </div>
          </div>

          {/* Letterhead address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-between text-xs sm:text-sm">
            <div>
              <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">HARKUCH TECH</h1>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-widest">Premium BD Electronics Outlet</p>
              <div className="text-slate-550 dark:text-slate-400 font-mono space-y-1 mt-4">
                <p>📍 Multiplan Computer Center, Level 10</p>
                <p>Elephant Road, Dhaka - 1205</p>
                <p>📞 Hotline: +880 1712-345678 | support@harkuch.tech</p>
              </div>
            </div>
            
            <div className="md:text-right font-mono text-xs text-slate-550 dark:text-slate-400 space-y-1">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">CUSTOMER INVOICE</h3>
              <p>Reference: <strong className="text-orange-500 text-xs sm:text-sm">{order.id}</strong></p>
              <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
              <p>Payment: <strong className="text-slate-900 dark:text-white text-[10px] uppercase border dark:border-slate-800 px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-900">Cash on Delivery</strong></p>
            </div>
          </div>

          {/* Billing customer Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-900 text-xs sm:text-sm">
            <div className="space-y-1 font-mono">
              <p className="text-[10px] text-slate-500 font-mono uppercase font-bold">Receiver Information</p>
              <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{order.customerName}</p>
              <p className="text-slate-600 dark:text-slate-400">📞 {order.customerPhone}</p>
              {order.customerEmail && <p className="text-slate-600 dark:text-slate-400">✉️ {order.customerEmail}</p>}
            </div>

            <div className="space-y-1 font-mono">
              <p className="text-[10px] text-slate-500 font-mono uppercase font-bold">Shipping Address Coordinates</p>
              <p className="text-slate-700 dark:text-slate-350 font-bold">{order.shippingAddress}</p>
              <p className="text-slate-605 dark:text-slate-400">Region: Thana {order.thana}, Dist: {order.district}</p>
              <p className="text-slate-500">EST DISPATCH: <strong className="text-orange-500">{estDateMin.toLocaleDateString()} - {estDateMax.toLocaleDateString()}</strong></p>
            </div>
          </div>

          {/* List Ordered Materials */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-500 font-mono">Materials Booking itemization</h4>
            <div className="border border-slate-100 dark:border-slate-900 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/70 border-b border-slate-100 dark:border-slate-900 text-[10px] font-mono text-slate-500 uppercase">
                    <th className="py-3 px-4">Electronic Item Specs</th>
                    <th className="py-3 px-4">SKU Code</th>
                    <th className="py-3 px-4 text-center">Unit Price</th>
                    <th className="py-3 px-4 text-center">Quantity</th>
                    <th className="py-3 px-4 text-right">Sum Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900/60 font-mono">
                  {order.items.map((itm, idx) => (
                    <tr key={idx} className="last:border-0 hover:bg-slate-50/20">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{itm.productName}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 uppercase">{itm.sku}</td>
                      <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-400">৳{itm.price?.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">{itm.quantity}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">৳{(itm.price * itm.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order notes summary excerpt */}
          {order.notes && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border dark:border-slate-900 text-xs">
              <p className="font-bold text-slate-900 dark:text-white font-mono uppercase text-[10px] mb-1">📝 Receiver Dispatch notes</p>
              <p className="text-slate-500 italic font-mono">&ldquo;{order.notes}&rdquo;</p>
            </div>
          )}

          {/* Checkout grand total breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t dark:border-slate-900">
            <div className="text-xs text-slate-500 font-mono space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">📌 TERMS OF SERVICE</p>
              <p>• Verify serial IMEI packaging codes on courier delivery handovers.</p>
              <p>• Retain original cartoon box wrappers intact to qualify for Easy replacement policies.</p>
            </div>

            <div className="md:text-right font-mono text-xs sm:text-sm space-y-2 max-w-xs md:ml-auto w-full">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal</span>
                <span>৳{order.subtotal?.toLocaleString()}</span>
              </div>
              
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Coupon Promo savings {order.couponCode && `(${order.couponCode})`}</span>
                  <span>-৳{order.discountAmount?.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>Courier Charge ({order.deliveryCharge === 80 ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                <span>+৳{order.deliveryCharge}</span>
              </div>

              <div className="border-t border-slate-205 dark:border-slate-800 pt-3 flex justify-between items-baseline font-bold">
                <span className="text-slate-900 dark:text-white text-sm">Grand Amount</span>
                <span className="text-xl font-black text-orange-600 dark:text-orange-500">৳{order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer stamp signoff */}
          <div className="text-center pt-8 border-t dark:border-slate-900 leading-relaxed text-[10px] text-slate-400 font-mono">
            <p>Harkuch Tech BD Flagship Store • Authorized retail electronics and computer imports.</p>
            <p>Thank you for shopping with us! For tracking dispatch status, navigate to `#track-order?id={order.id}`</p>
          </div>

        </div>

        {/* Quick redirect controls - Hidden in Print */}
        <div className="flex justify-between pt-8 print:hidden">
          <button
            onClick={() => onNavigate('#track-order')}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
          >
            Track Order online <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onNavigate('#shop')}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs font-mono shadow-md shadow-orange-600/10 transition flex items-center gap-1.5 cursor-pointer"
          >
            Browse other gadgets
          </button>
        </div>

      </div>
    </div>
  );
}

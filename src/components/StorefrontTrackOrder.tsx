/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useDb } from '../dbContext';
import { Search, Loader2, ClipboardCheck, Ban, Clock, MapPin, Package, HelpCircle } from 'lucide-react';

interface TrackProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export default function StorefrontTrackOrder({ onNavigate, currentRoute }: TrackProps) {
  const { orders } = useDb();

  const [orderQuery, setOrderQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Extract initial tracking code if provided via url hashtag deep link: e.g. #track-order?orderId=HT-12345
  useEffect(() => {
    const hash = currentRoute || window.location.hash || '';
    const paramString = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(paramString);
    const code = params.get('orderId') || '';
    if (code.trim()) {
      setOrderQuery(code.trim());
      handleTrackQuery(code.trim());
    }
  }, [currentRoute]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSearchedOrder(null);
    
    const code = orderQuery.trim().toUpperCase();
    if (!code) return;

    handleTrackQuery(code);
  };

  const handleTrackQuery = (code: string) => {
    setSearching(true);
    setErrorMessage('');
    
    setTimeout(() => {
      const match = orders.find(o => o.id.toUpperCase() === code.toUpperCase());
      if (match) {
        setSearchedOrder(match);
      } else {
        setErrorMessage('⚠️ Order reference code not registered inside our records. Verify the code (E.g. HT-74391)');
      }
      setSearching(false);
    }, 800); // simulated lookup speed
  };

  // Helper to map status timeline indices
  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return -1; // Cancelled
    }
  };

  const currentStep = searchedOrder ? getStatusStepIndex(searchedOrder.status) : -1;

  const STATUS_TIMELINE_STEPS = [
    { title: 'Pending Approval', text: 'Waiting for telephone verification call.' },
    { title: 'Packaging/Processing', text: 'Original hardware verified and packed.' },
    { title: 'Dispatched / Courier', text: 'Handed over to nationwide express.' },
    { title: 'Delivered Packages', text: 'Checked, testing confirmed and paid.' }
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 transition-colors py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center space-y-3 mb-10">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500">Logistics tracking</p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-1000 dark:text-white">Track Order dispatch Status</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">Insert your 5-digit booking reference number printed on your checkout summaries or receipt emails.</p>
        </div>

        {/* Tracking Input */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-md mb-8">
          <form onSubmit={handleTrackSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="E.g. HT-74391"
                required
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-mono text-slate-910 dark:text-white uppercase font-bold"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-650 text-white rounded-xl text-sm font-bold font-mono transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              {searching ? 'Querying...' : 'Trace'}
            </button>
          </form>

          {errorMessage && <p className="text-xs font-mono font-semibold text-red-405 mt-3">{errorMessage}</p>}
        </div>

        {/* Lookup results */}
        {searching && (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        )}

        {!searching && searchedOrder && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Summary details card */}
            <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="space-y-1 font-mono">
                <p className="text-[10px] text-slate-450 uppercase font-bold">Booking code</p>
                <p className="font-bold text-slate-900 dark:text-white text-base">{searchedOrder.id}</p>
                <p className="text-slate-450">Date: {new Date(searchedOrder.orderDate).toLocaleDateString()}</p>
              </div>

              <div className="space-y-1 font-mono">
                <p className="text-[10px] text-slate-450 uppercase font-bold">Courier Shipping Zones</p>
                <p className="font-bold text-slate-900 dark:text-white">{searchedOrder.thana}, {searchedOrder.district}</p>
                <p className="text-slate-450">Method: Cash on Delivery</p>
              </div>

              <div className="space-y-1 font-mono md:text-right">
                <p className="text-[10px] text-slate-450 uppercase font-bold">Status level</p>
                <div>
                  {searchedOrder.status === 'Cancelled' ? (
                    <span className="px-2.5 py-0.5 roundedbg-red-500/10 text-red-500 font-bold uppercase tracking-wider text-[10px] bg-red-500/10 inline-block">❌ CANCELLED</span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded bg-orange-500/10 text-orange-400 font-extrabold uppercase tracking-widest text-[10px] inline-block animate-pulse">🚢 {searchedOrder.status}</span>
                  )}
                </div>
                <p className="font-black text-slate-900 dark:text-white text-sm sm:text-lg mt-1">৳{searchedOrder.total.toLocaleString()}</p>
              </div>
            </div>

            {/* Timelines flow charts - Rendered if NOT cancelled */}
            {searchedOrder.status !== 'Cancelled' ? (
              <div className="bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-xs space-y-8">
                <h4 className="text-xs font-bold uppercase text-slate-450 font-mono border-b dark:border-slate-900 pb-3 flex items-center gap-1.5"><Clock className="w-4.5 h-4.5 text-orange-500" /> Dispatch Progress Timeline</h4>
                
                <div className="relative pl-6 sm:pl-0 sm:grid sm:grid-cols-4 gap-4 before:contents-[''] before:absolute before:left-2.5 sm:before:left-auto sm:before:top-4 before:w-1 sm:before:w-full before:h-full sm:before:h-1 before:bg-slate-100 dark:before:bg-slate-850 before:z-0">
                  {STATUS_TIMELINE_STEPS.map((step, idx) => {
                    const isPassed = currentStep >= idx;
                    const isCurrent = currentStep === idx;
                    return (
                      <div key={idx} className="relative z-10 pb-8 sm:pb-0 text-left sm:text-center space-y-2 last:pb-0">
                        {/* Dot indicator marker */}
                        <div className="flex sm:justify-center">
                          <div className={`w-5 h-5 rounded-full border-4 flex items-center justify-center font-mono text-[9px] font-bold ${
                            isPassed ? 'bg-orange-500 border-orange-500/30 text-white' :
                            'bg-white dark:bg-slate-900 border-slate-205 dark:border-slate-800 text-slate-400'
                          }`}>
                            {isPassed && '✓'}
                          </div>
                        </div>

                        <div className="pl-6 sm:pl-0 space-y-1">
                          <h5 className={`font-bold text-xs sm:text-sm ${isCurrent ? 'text-orange-500 font-extrabold' : isPassed ? 'text-slate-800 dark:text-slate-200' : 'text-slate-450'}`}>{step.title}</h5>
                          <p className="text-[10px] leading-relaxed text-slate-500 max-w-[170px] sm:mx-auto">{step.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4 text-xs sm:text-sm">
                <Ban className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1 font-mono">
                  <h4 className="font-extrabold text-red-450">Order Terminated</h4>
                  <p className="text-slate-550 dark:text-slate-450 leading-relaxed">This order booking has been cancelled and voided. Contact live telephone support desk +880 1712-345678 to recover claims or verify parameters.</p>
                </div>
              </div>
            )}

            {/* Courier Tracking assistance info */}
            {searchedOrder.internalNotes && (
              <div className="p-4 bg-slate-900 text-white border border-slate-850 rounded-xl space-y-1 text-xs">
                <p className="font-bold font-mono uppercase text-[10px] text-orange-400 flex items-center gap-1">📌 Logistics Live Dispatch updates</p>
                <p className="text-slate-350 leading-relaxed font-mono italic">&ldquo;{searchedOrder.internalNotes}&rdquo;</p>
              </div>
            )}

            {/* Product items in reference summary table */}
            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-xs space-y-3 text-xs sm:text-sm">
              <h4 className="text-xs font-bold uppercase text-slate-450 font-mono display flex items-center gap-1.5"><Package className="w-4 h-4 text-orange-500" /> Booked Materials parcel Contents</h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-900 font-mono">
                {searchedOrder.items.map((itm: any, idx: number) => (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{itm.productName} (QTY: {itm.quantity})</span>
                    <span className="text-slate-450 uppercase text-[11px] shrink-0 font-mono">SKU: {itm.sku}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

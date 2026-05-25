/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDb } from '../dbContext';
import { Mail, Phone, MessageSquare, MapPin, Send, HelpCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface PagesProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export default function StorefrontPages({ onNavigate, currentRoute }: PagesProps) {
  const { footerSettings } = useDb();

  // Contact form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // FAQ Expand state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName.trim() && contactMsg.trim()) {
      setFormSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      setTimeout(() => setFormSuccess(false), 5000);
    }
  };

  const getHashPage = () => {
    const hash = currentRoute || window.location.hash || '#about';
    if (hash.startsWith('#policy/')) {
      return hash.split('/')[1] || 'privacy';
    }
    return hash.replace('#', '');
  };

  const pageId = getHashPage();

  const FAQS = [
    { q: 'Are all your electronic items original and authenticated?', a: 'Absolute yes. Harkuch Tech imports 100% genuine tech assets. All computer rigs, cameras, and mechanical keyboards contain verified QR codes and official warranty registrations which we help activate on purchase handovers.' },
    { q: 'What are the delivery sub-charges inside Bangladesh?', a: 'Inside Dhaka City limits are priced at ৳80 flat. Suburbs are ৳120, and all other outer divisions (Sylhet, Chittagong, Rajshahi) are shipped securely for ৳150 with protective double bubble sleeves.' },
    { q: 'How does checking items before handovers operate?', a: 'Our delivery partners support "parcel-opening checks". When the rider reaches your doorsteps, you are fully authorized to open Carton wrappers, physically inspect the screen, verify power levels, and complete Cash payments to riders afterward.' },
    { q: 'Where do I register for easy replacement claims?', a: 'Any replacement request must occur within 7 days of package receipt. Submit IMEI validation checks to support support@harkuch.tech or contact active hotlines for immediate replacements.' }
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 transition-colors py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* CONTACT PAGE LAYOUT */}
        {pageId === 'contact' && (
          <div className="space-y-12">
            <div className="text-center space-y-2">
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500">Store direction & Support</p>
              <h1 className="text-3xl font-black text-slate-1000 dark:text-white">Contact Our Team</h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">Active service hotlines available daily 9 AM to 10 PM. Stop by our Multiplan outlet showroom.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Contact Information block */}
              <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-xs space-y-6">
                <h3 className="font-bold text-slate-900 dark:text-white border-b dark:border-slate-900 pb-3 uppercase text-xs font-mono tracking-wider">Harkuch Outlets</h3>
                
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Flagship Showroom</p>
                      <p className="text-slate-500 leading-relaxed font-mono mt-1 text-xs">Level 10, Multiplan Computer Center, Elephant Road, Dhanmondi, Dhaka - 1205</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Customer Support Hotline</p>
                      <p className="text-slate-500 leading-relaxed font-mono mt-1 text-xs">{footerSettings.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Support Emails</p>
                      <p className="text-slate-500 leading-relaxed font-mono mt-1 text-xs">{footerSettings.email}</p>
                    </div>
                  </div>
                </div>

                {/* Mock Google maps container representation */}
                <div className="w-full h-44 bg-slate-100 dark:bg-slate-900 rounded-xl relative overflow-hidden border dark:border-slate-900/65 flex items-center justify-center font-mono text-[10px] text-slate-450 text-center uppercase p-4">
                  <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=500')" }}></div>
                  <div className="relative z-10 space-y-1">
                    <p className="font-bold">📍 Google MAPS OUTLET MOCKUP</p>
                    <p className="lowercase">Multiplex center Elephant road, DHAKA 1205</p>
                  </div>
                </div>

              </div>

              {/* Inquiry email forms */}
              <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white border-b dark:border-slate-900 pb-3 uppercase text-xs font-mono tracking-wider">Leave an Inquiry</h3>
                
                {formSuccess ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm rounded-xl font-medium font-mono animate-in fade-in">
                    ✅ Message dispatched successfully! Our support agents will write back inside 24 hours.
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="E.g. Tanveer"
                        className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-3 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Your email *</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="E.g. customer@email.com"
                        className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-3 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Inquiry Msg details *</label>
                      <textarea
                        required
                        rows={3}
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        placeholder="Write down specifications query, corporate orders request, or career opportunities..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-3 rounded-xl focus:outline-none resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Send Message <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}

              </div>

            </div>
          </div>
        )}

        {/* ABOUT US PAGE LAYOUT */}
        {pageId === 'about' && (
          <div className="space-y-8 text-xs sm:text-base leading-relaxed text-slate-650 dark:text-slate-300">
            <div className="text-center space-y-2 mb-8">
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500">ABOUT HARKUCH TECH</p>
              <h1 className="text-3xl font-black text-slate-1000 dark:text-white leading-tight">Our Tech Journey in Bangladesh</h1>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Providing high-performance computational devices and tactile mechanical systems.</p>
            </div>

            <div className="w-full h-64 rounded-3xl overflow-hidden shadow-md">
              <img src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1000" alt="About US Cover" className="w-full h-full object-cover animate-pulse" />
            </div>

            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">The Origin Story</h3>
              <p>Harkuch Tech started in late 2024 with a single visual focus: to bridge high-fps laptops and audiophile acoustics into the hands of Bangladeshi engineers, programmers, and gamers without the traditional inflation or trust gaps associated with brick-and-mortar technology shops.</p>
              <p>We realized that while high-end specs are available, the customer relationship is often lost in bureaucracy. Hence, we pioneered 72-hour doorstep inspections, authentic IMEI activations, and rapid support hotlines, setting a premium new benchmark across the country.</p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-center shadow-xs">
              <div>
                <h4 className="text-2xl font-black text-orange-500 font-mono">100%</h4>
                <p className="text-xs text-slate-500 font-mono">Genuine Warranty</p>
              </div>
              <div className="border-y sm:border-y-0 sm:border-x dark:border-slate-905 py-4 sm:py-0">
                <h4 className="text-2xl font-black text-orange-500 font-mono">5K+</h4>
                <p className="text-xs text-slate-500 font-mono">Satisfied Shoppers</p>
              </div>
              <div>
                <h4 className="text-2xl font-black text-orange-500 font-mono">24H</h4>
                <p className="text-xs text-slate-500 font-mono">Dhaka city Shipping</p>
              </div>
            </div>
          </div>
        )}

        {/* FAQS ACCORDION PAGE */}
        {pageId === 'faq' && (
          <div className="space-y-8">
            <div className="text-center space-y-2 mb-8">
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500">FAQ center</p>
              <h1 className="text-3xl font-black text-slate-1000 dark:text-white">Frequently Asked Questions</h1>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Quick support resolutions to help you understand our logistics and warrant covers.</p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden shadow-xs transition"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center justify-between gap-4 outline-none"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-orange-500" /> : <ChevronDown className="w-4 h-4 text-orange-500" />}
                    </button>
                    
                    {isOpen && (
                      <div className="p-5 pt-0 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono leading-relaxed border-t dark:border-slate-900">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PRIVACY POLICY */}
        {pageId === 'privacy' && (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-650 dark:text-slate-300">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Privacy Policy</h1>
            <p className="font-mono text-slate-550">Last adjusted: May 2026</p>
            <p>Harkuch Tech values customer privacy blocks very highly. This framework outlines the processes and methods we deploy to cache customer details:</p>
            <h3 className="font-black text-slate-900 dark:text-white mt-4 text-sm sm:text-base">1. Personal Information Collection</h3>
            <p>We log Name, Shipping Address Coordinates, email, and phone references purely to verify billing matrices, compile PDF invoices, and dispatch packages to designated courier warehouses securely.</p>
            <h3 className="font-black text-slate-900 dark:text-white mt-4 text-sm sm:text-base">2. Local browser persistence</h3>
            <p>Our store coordinates checkout carts and bookmark wishlists using modern localStorage engines to save sessions. We do not transmit this data unless actions are triggered directly by checkout dispatches or profiles updates.</p>
          </div>
        )}

        {/* TERMS & CONDITIONS */}
        {pageId === 'terms' && (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-650 dark:text-slate-300">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Terms & Conditions</h1>
            <p className="font-mono text-slate-550">Last updated: May 2026</p>
            <p>Welcome to Harkuch Tech. By accessing the showroom, you accept these terms of service agreements:</p>
            <h3 className="font-black text-slate-900 dark:text-white mt-4 text-sm sm:text-base">1. Cash On Delivery agreements</h3>
            <p>All buyers placing Cash on delivery orders verify phone dispatches within 24 hours of checkout. Failure to coordinate verifications entitles staff nodes to cancel the shipment automatically.</p>
            <h3 className="font-black text-slate-900 dark:text-white mt-4 text-sm sm:text-base">2. Warranty bounds</h3>
            <p>Original manufacturing seals must remain completely non-tampered. Any structural hardware modification completely voids the warranty entitlements.</p>
          </div>
        )}

        {/* REFUND & RETURNS */}
        {pageId === 'refund' && (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-650 dark:text-slate-300">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Return & Refund Policy</h1>
            <p className="font-mono text-slate-550">Last integrated: May 2026</p>
            <p>Customer satisfaction remains our utmost priority. We structure simple returns with these matrices:</p>
            <h3 className="font-black text-slate-900 dark:text-white mt-4 text-sm sm:text-base">1. 7-Day Easy Replacements</h3>
            <p>If you encounter hardware defects or technical discrepancies in specifications within 7 days of package handovers, Harkuch Tech promises immediate replacements upon verifying product security serial codes.</p>
            <h3 className="font-black text-slate-900 dark:text-white mt-4 text-sm sm:text-base">2. Refund timelines</h3>
            <p>Refund values take 3 to 5 business days to revert into your specified mobile banking structures (bKash/Nagad) once physical electronics packages are safely returned and verified by multiplan center expert panels.</p>
          </div>
        )}

        {/* SHIPPING POLICY */}
        {pageId === 'shipping' && (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-650 dark:text-slate-300">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Shipping & Dispatch Policy</h1>
            <p className="font-mono text-slate-550">Last adjusted: May 2026</p>
            <p>Harkuch Tech operates super-fast double-insured delivery blocks across the nation:</p>
            <h3 className="font-black text-slate-900 dark:text-white mt-4 text-sm sm:text-base">1. Timelines and couriers</h3>
            <p>• Inside Dhaka: Undergoes delivery inside 24 hours via reliable local delivery riders.</p>
            <p>• Outer division divisions: Handed over securely to leading courier networks (Sundarban, SA Par परिवहन, Pathao Courier) reaching you inside 72 to 120 hours.</p>
            <h3 className="font-black text-slate-900 dark:text-white mt-4 text-sm sm:text-base">2. Insurance guarantees</h3>
            <p>If a parcel is compromised or physically damaged during courier transitions, Harkuch Tech provides full insurance, replacing damaged assets immediately with alternative fresh packages.</p>
          </div>
        )}

      </div>
    </div>
  );
}

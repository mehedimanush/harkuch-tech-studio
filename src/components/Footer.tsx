/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDb } from '../dbContext';
import { Facebook, Instagram, Phone, Mail, MessageSquare, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { footerSettings, categories } = useDb();

  return (
    <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand/About description */}
          <div className="lg:col-span-2">
            <button
              onClick={() => onNavigate('#home')}
              className="text-2xl font-black tracking-tight text-white mb-4 block hover:opacity-90 text-left"
            >
              HARKUCH<span className="text-orange-500">TECH</span>
            </button>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-sm">
              {footerSettings.aboutText}
            </p>
            
            {/* Social handles */}
            <div className="flex items-center gap-3">
              <a
                href={footerSettings.facebookUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-orange-500 hover:text-white text-slate-300 transition-all border border-slate-800"
                title="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={footerSettings.instagramUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-orange-500 hover:text-white text-slate-300 transition-all border border-slate-800"
                title="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={footerSettings.whatsappUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-emerald-500 hover:text-white text-slate-300 transition-all border border-slate-800"
                title="Chat over WhatsApp"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href={footerSettings.messengerUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white text-slate-300 transition-all border border-slate-800"
                title="Message on Messenger"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-mono">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('#home')} className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                  Homepage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#shop')} className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                  Shop Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#blog')} className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                  Tech Blog & news
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#about')} className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                  About Us page
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#contact')} className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                  Store Coordinates
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-mono">Customer Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('#faq')} className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                  FAQs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#policy/shipping')} className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                  Shipping & Dispatch
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#policy/refund')} className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                  Returns & Refunds
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#policy/terms')} className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#policy/privacy')} className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Hotlines Column */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-mono">Get in Touch</h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">BD CUSTOMER HOTLINE</p>
                  <a href={`tel:${footerSettings.phone}`} className="text-white hover:text-orange-500 transition-colors font-mono">
                    {footerSettings.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">SUPPORT DISPATCH EMAIL</p>
                  <a href={`mailto:${footerSettings.email}`} className="text-white hover:text-orange-500 transition-colors font-mono line-clamp-1 block">
                    {footerSettings.email}
                  </a>
                </div>
              </li>
              <div className="text-[11px] font-mono leading-relaxed bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-400">
                📌 Multiplan Center, Elephant Road, Level X, Dhaka-1205
              </div>
            </ul>
          </div>

        </div>

        {/* Level copyright */}
        <div className="border-t border-slate-900 pt-8 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <p className="text-xs font-mono text-slate-500">
            {footerSettings.copyrightText}
          </p>
          <div className="flex items-center gap-4 text-xs font-mono">
            <button onClick={() => onNavigate('#admin')} className="text-slate-600 hover:text-orange-500 transition-all transition-colors">
              Staff Portal Access
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

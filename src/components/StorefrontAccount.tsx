/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useDb } from '../dbContext';
import { User, ClipboardList, Heart, Edit3, LogOut, CheckCircle2, ShieldAlert, ShoppingCart, ArrowRight } from 'lucide-react';

interface AccountProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export default function StorefrontAccount({ onNavigate, currentRoute }: AccountProps) {
  const {
    currentUser,
    loginUser,
    registerUser,
    logoutUser,
    updateUserProfile,
    orders,
    products,
    wishlist,
    toggleWishlist,
    addToCart,
    updateOrderStatus
  } = useDb();

  // Route tab parsing hashtag query `?tab=wishlist` state
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');
  
  // Auth Forms
  const [isRegister, setIsRegister] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // Profile Edit fields
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editThana, setEditThana] = useState('');
  const [editedSuccess, setEditedSuccess] = useState(false);

  useEffect(() => {
    const hash = currentRoute || window.location.hash || '';
    const parts = hash.split('?');
    if (parts[1]) {
      const q = new URLSearchParams(parts[1]);
      const tabParam = q.get('tab');
      if (tabParam === 'wishlist' || tabParam === 'orders' || tabParam === 'profile') {
        setActiveTab(tabParam as any);
      }
    }
  }, [currentRoute]);

  // Load profile editing values
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditPhone(currentUser.phone || '');
      setEditAddress(currentUser.address || '');
      setEditDistrict(currentUser.district || '');
      setEditThana(currentUser.thana || '');
    }
  }, [currentUser]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const mail = authEmail.trim();
    const phone = authPhone.trim();

    if (!mail || !phone) return;

    if (isRegister) {
      if (!authName.trim()) {
        setAuthError('⚠️ Please specify your name to register.');
        return;
      }
      registerUser(authName.trim(), mail, phone, '', '', '');
    } else {
      const success = loginUser(mail, phone);
      if (!success) {
        setAuthError('⚠️ Credentials error. Verify values.');
      }
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditedSuccess(false);

    if (currentUser) {
      updateUserProfile({
        name: editName.trim(),
        phone: editPhone.trim(),
        address: editAddress.trim(),
        district: editDistrict.trim(),
        thana: editThana.trim()
      });
      setEditedSuccess(true);
      setTimeout(() => setEditedSuccess(false), 4000);
    }
  };

  // Filter orders made by this user (or fallback lists of all orders matching customer phone)
  const userOrders = currentUser
    ? orders.filter(o => o.customerPhone.trim() === currentUser.phone.trim() || o.customerEmail?.toLowerCase().trim() === currentUser.email.toLowerCase().trim())
    : [];

  // Wishlist mapping
  const wishedProducts = products.filter(p => wishlist.includes(p.id));

  // IF NOT LOGGED IN - RENDER AUTHENTICATION PORTS
  if (!currentUser) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 transition-colors py-20">
        <div className="max-w-md mx-auto px-4">
          
          <div className="bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-2xl space-y-6">
            <div className="text-center space-y-1">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">HARKUCH TECH</span>
              <h2 className="text-lg font-bold text-slate-910 dark:text-white">
                {isRegister ? 'Join Customer Accounts' : 'Sign in to Storefront'}
              </h2>
              <p className="text-xs text-slate-500 font-mono">Simulate a quick login using any email & phone combo.</p>
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono rounded-xl">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs sm:text-sm">
              {isRegister && (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="E.g. Tanveer Hossain"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-3 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Email address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="E.g. customer@email.com"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-3 rounded-xl focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Bangladeshi Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  placeholder="E.g. 01712345678"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-3 rounded-xl focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold font-mono transition shadow-lg shadow-orange-600/10 cursor-pointer"
              >
                {isRegister ? 'Register Account' : 'Verify & Enter'}
              </button>
            </form>

            <div className="text-center pt-2 border-t dark:border-slate-900">
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setAuthError('');
                }}
                className="text-xs text-orange-500 hover:text-orange-600 font-bold font-mono"
              >
                {isRegister ? 'Already registered? Sign in here' : 'New Customer? Create account here'}
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 transition-colors py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome customer banner layout */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-3xl mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-orange-600 text-white font-black text-xl flex items-center justify-center font-mono uppercase shadow-lg">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">Verified customer accounts</p>
              <h1 className="text-xl sm:text-2xl font-black">{currentUser.name}</h1>
              <p className="text-xs font-mono text-slate-450">{currentUser.email} • 📱 {currentUser.phone}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logoutUser();
              onNavigate('#home');
            }}
            className="px-4.5 py-2.5 bg-slate-800 hover:bg-red-600 border border-slate-700 text-white rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer hover:border-transparent"
          >
            <LogOut className="w-4 h-4" /> Log Out Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Tabs links side buttons menu */}
          <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-xs flex flex-col gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left p-3 rounded-xl text-xs font-bold font-mono flex items-center gap-2.5 transition ${activeTab === 'profile' ? 'bg-orange-500/10 text-orange-400' : 'hover:bg-slate-50 dark:hover:bg-slate-900'}`}
            >
              <User className="w-4.5 h-4.5" /> Edit Profile Details
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left p-3 rounded-xl text-xs font-bold font-mono flex items-center justify-between transition ${activeTab === 'orders' ? 'bg-orange-500/10 text-orange-400' : 'hover:bg-slate-50 dark:hover:bg-slate-900'}`}
            >
              <span className="flex items-center gap-2.5"><ClipboardList className="w-4.5 h-4.5" /> My Orders History</span>
              <span className="px-2 py-0.5 roundedbg-slate-200 dark:bg-slate-900 font-extrabold text-[9px] bg-slate-800 text-white font-mono">{userOrders.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left p-3 rounded-xl text-xs font-bold font-mono flex items-center justify-between transition ${activeTab === 'wishlist' ? 'bg-orange-500/10 text-orange-400' : 'hover:bg-slate-50 dark:hover:bg-slate-900'}`}
            >
              <span className="flex items-center gap-2.5"><Heart className="w-4.5 h-4.5" /> Saved Wishlist items</span>
              <span className="px-2 py-0.5 roundedbg-slate-200 dark:bg-slate-900 font-extrabold text-[9px] bg-slate-800 text-white font-mono">{wishlist.length}</span>
            </button>
          </div>

          <div className="lg:col-span-3">
            
            {/* TAB PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-xs space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase text-slate-450 font-mono border-b dark:border-slate-900 pb-3 flex items-center gap-1.5"><Edit3 className="w-4 h-4 text-orange-500" /> Modify Profile Details</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Ensure physical dispatch addresses and contact details are fully updated to complete next purchases faster.</p>
                </div>

                {editedSuccess && (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium rounded-xl animate-in fade-in">
                    ✅ Profiles information adjusted and compiled successfully.
                  </div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Full Name</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Contact Phone (Verified ID)</label>
                      <input
                        type="text"
                        disabled
                        value={editPhone}
                        className="w-full text-xs bg-slate-100 dark:bg-slate-900 border dark:border-slate-850 p-2.5 rounded-xl focus:outline-none text-slate-450 cursor-not-allowed font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">District</label>
                      <input
                        type="text"
                        value={editDistrict}
                        onChange={(e) => setEditDistrict(e.target.value)}
                        placeholder="E.g. Dhaka or Chittagong"
                        className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Thana / Subdistrict</label>
                      <input
                        type="text"
                        value={editThana}
                        onChange={(e) => setEditThana(e.target.value)}
                        placeholder="E.g. Uttara or Nasirabad"
                        className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Default Delivery Address coordinates</label>
                    <textarea
                      rows={3}
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      placeholder="E.g. House 4A, Flat 2B, Road 12, Sector 3, Uttara"
                      className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-2.5 rounded-xl focus:outline-none resize-none font-mono"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold font-mono flex items-center justify-center cursor-pointer"
                  >
                    Adjust Profiles
                  </button>
                </form>
              </div>
            )}

            {/* TAB ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-xs space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase text-slate-450 font-mono border-b dark:border-slate-900 pb-3 flex items-center gap-1.5"><ClipboardList className="w-4 h-4 text-orange-500" /> Historical Bookings List</h3>
                  <p className="text-xs text-slate-500 mt-1">Review live dispatch stages or track physical invoice entries.</p>
                </div>

                {userOrders.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-900 font-mono text-xs sm:text-sm">
                    {userOrders.map(ord => (
                      <div key={ord.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
                        <div className="space-y-1 font-mono">
                          <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono text-sm sm:text-base">
                            <span>Reference Code: {ord.id}</span>
                          </p>
                          <p className="text-slate-500 font-mono text-xs">Date: {new Date(ord.orderDate).toLocaleDateString()} | Total Items: {ord.items.length}</p>
                          <div className="flex gap-2 pt-1 font-mono text-[10px]">
                            {ord.items.map((itm, i) => (
                              <span key={i} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 border dark:border-slate-850 rounded truncate max-w-[120px]">{itm.productName}</span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 font-mono">
                          <div className="text-right shrink-0 min-w-[70px]">
                            <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] uppercase font-mono border ${
                              ord.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                              ord.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              ord.status === 'Shipped' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-sm animate-pulse' :
                              ord.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                              'bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-205 dark:border-slate-800'
                            }`}>
                              {ord.status}
                            </span>
                            <p className="font-extrabold text-slate-900 dark:text-white mt-1 font-mono">৳{ord.total.toLocaleString()}</p>
                          </div>

                          <button
                            onClick={() => onNavigate(`#track-order?orderId=${ord.id}`)}
                            className="px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border dark:border-slate-850 hover:bg-orange-500 hover:text-white rounded-lg font-bold text-xs transition cursor-pointer"
                          >
                            Trace
                          </button>

                          {ord.status === 'Pending' && (
                            <button
                              onClick={() => {
                                if (confirm('Cancel this dispatch booking?')) {
                                  updateOrderStatus(ord.id, 'Cancelled', 'Cancelled directly by buyer from customer dashboard portal.');
                                }
                              }}
                              className="px-3.5 py-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-bold transition font-mono cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-8 text-center text-slate-500 font-mono text-xs bg-slate-50 dark:bg-slate-900/30 rounded-xl">⚠️ You haven&apos;t placed any order bookings in active sessions.</p>
                )}
              </div>
            )}

            {/* TAB WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-xs space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase text-slate-450 font-mono border-b dark:border-slate-900 pb-3 flex items-center gap-1.5"><Heart className="w-4 h-4 text-orange-500" /> Saved Wishlist</h3>
                  <p className="text-xs text-slate-500 mt-1">Gears bookmarked during showcase visits.</p>
                </div>

                {wishedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishedProducts.map(p => {
                      const price = p.discountPrice || p.price;
                      return (
                        <div key={p.id} className="p-4 border dark:border-slate-900 bg-slate-500/5 rounded-2xl flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={p.mainImage} alt={p.name} className="w-12 h-12 object-cover rounded-lg border dark:border-slate-800" />
                            <div>
                              <h4
                                onClick={() => onNavigate(`#product/${p.slug}`)}
                                className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-orange-500 transition cursor-pointer line-clamp-1"
                              >
                                {p.name}
                              </h4>
                              <span className="text-xs font-bold font-mono text-orange-500">৳{price.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {p.stock > 0 ? (
                              <button
                                onClick={() => addToCart(p.id, 1)}
                                className="p-2 bg-slate-900 text-white rounded-lg hover:bg-orange-600 transition"
                                title="Add to Cart"
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-red-500 font-mono font-bold">Sold Out</span>
                            )}
                            <button
                              onClick={() => toggleWishlist(p.id)}
                              className="text-red-400 p-2 rounded-lg hover:bg-red-500/15 transition-all text-xs font-mono"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-4">
                    <p className="text-xs text-slate-450 font-mono">No electronic items bookmarked yet.</p>
                    <button
                      onClick={() => onNavigate('#shop')}
                      className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-mono font-bold rounded-lg flex items-center justify-center mx-auto gap-2"
                    >
                      Browse Showroom <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

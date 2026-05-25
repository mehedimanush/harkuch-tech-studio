/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDb } from '../dbContext';
import { ArrowRight, ShoppingCart, Star, Flame, Trophy, ShieldCheck, Truck, RotateCcw, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  onNavigate: (route: string) => void;
}

export default function StorefrontHome({ onNavigate }: HomeProps) {
  const { products, categories, reviews, addToCart } = useDb();
  const [newsEmail, setNewsEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Filter lists
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);
  const flashSaleProducts = products.filter(p => p.discountPrice && p.stock > 0).slice(0, 3);
  const approvedReviews = reviews.filter(r => r.isApproved).slice(0, 3);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim()) {
      setSubscribed(true);
      setNewsEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-250 pb-16">
      
      {/* 1. HERO SLIDER BANNER */}
      <section className="relative overflow-hidden bg-slate-900 py-20 px-4 text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1920')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-full font-mono text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-spin" /> Dhaka Flagship Tech Outlet
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Upgrade to Premium <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300">
                High-Performance Gear
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-lg">
              Unlock maximum performance with original laptops, gaming mechanical accessories, pro-cameras, and flagship devices delivered securely across Bangladesh inside 72 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => onNavigate('#shop')}
                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-orange-600/20 flex items-center justify-center gap-2"
                id="hero-shop-now-btn"
              >
                Browse Premium catalog <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('#shop?categoryId=cat-laptops')}
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl transition-all flex items-center justify-center"
              >
                View Laptops 💻
              </button>
            </div>
          </div>
          
          <div className="hidden lg:flex justify-center">
            {/* Display high quality mock product banner item */}
            <div className="relative p-6 bg-slate-800/80 border border-slate-700/60 rounded-3xl w-full max-w-md shadow-2xl backdrop-blur-md">
              <span className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-red-600 to-orange-500 text-xs font-mono font-bold uppercase rounded-full tracking-wider shadow-lg">Save ৳11,000</span>
              <img src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=500" alt="Special Deal" className="w-full h-56 object-cover rounded-2xl mb-4 border border-slate-700" />
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-orange-400 uppercase tracking-widest font-semibold">ASUS ROG SERIES</span>
                <span className="text-xs text-emerald-400 font-mono font-bold">● Genuine Warranty</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">Asus ROG Strix G16 (2026)</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white font-mono">৳174,000</span>
                <span className="text-sm text-slate-500 line-through font-mono">৳185,000</span>
              </div>
              <button
                onClick={() => onNavigate('#product/asus-rog-strix-g16-2026')}
                className="w-full mt-4 py-3 bg-slate-700 hover:bg-orange-600 text-white rounded-xl text-center text-sm font-semibold transition-all border border-slate-600 hover:border-orange-500"
              >
                Order this Flagship Laptop Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES/BENEFITS */}
      <section className="bg-white dark:bg-slate-950 py-10 shadow-xs border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-900 rounded-2xl">
            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Fast Nationwide Express</h4>
              <p className="text-xs text-slate-500">Dhaka in 24h, outside in 72h</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-900 rounded-2xl">
            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">100% Genuine Tech</h4>
              <p className="text-xs text-slate-500">Official serial verified cover</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-900 rounded-2xl">
            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Easy Returns policy</h4>
              <p className="text-xs text-slate-500">Hassle-free replacement claims</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-900 rounded-2xl">
            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Top Rated Support</h4>
              <p className="text-xs text-slate-500">Call active 9 AM - 10 PM daily</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES DISPLAY */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500">Quick Access</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Shop by Top Categories</h2>
          </div>
          <button onClick={() => onNavigate('#shop')} className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1">
            See All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigate(`#shop?categoryId=${cat.id}`)}
              className="group p-4 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800/80 rounded-2xl text-center shadow-xs hover:shadow-lg hover:border-orange-500/40 dark:hover:border-orange-500/30 transition-all duration-200"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-3.5 bg-slate-100 dark:bg-slate-900 relative">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight line-clamp-2">{cat.name}</h3>
            </button>
          ))}
        </div>
      </section>

      {/* 4. FLASH SALES WITH EXTRA TIMER */}
      {flashSaleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="bg-gradient-to-r from-red-950 to-orange-950 border border-red-900/50 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-800/10 rounded-full blur-3xl"></div>
            
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-md text-center lg:text-left">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600/35 border border-red-500 text-red-300 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                  <Flame className="w-4 h-4 animate-bounce text-orange-400" /> Hourly Flash Sale
                </span>
                <h3 className="text-2xl sm:text-3xl font-black">Limited Stock, Limitless Deals</h3>
                <p className="text-xs sm:text-sm text-red-200 leading-relaxed">
                  Apply coupon <strong className="text-yellow-400 font-mono">HARKUCH20</strong> during checkout to clear an extra 20% flat discount off your order summary total!
                </p>
                <div className="flex items-center justify-center lg:justify-start gap-3 text-xs font-mono">
                  <span className="px-3 py-2 bg-black/45 rounded-md border border-white/10 text-white"><strong className="text-xl text-yellow-400">12</strong>H</span>
                  <span className="px-3 py-2 bg-black/45 rounded-md border border-white/10 text-white"><strong className="text-xl text-yellow-400">45</strong>M</span>
                  <span className="px-3 py-2 bg-black/45 rounded-md border border-white/10 text-white"><strong className="text-xl text-yellow-400">18</strong>S</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:max-w-3xl">
                {flashSaleProducts.map(p => (
                  <div key={p.id} className="relative bg-black/45 border border-white/10 p-4 rounded-2xl group flex flex-col justify-between">
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-600 text-[9px] font-mono font-bold rounded-md">SAVE ৳{(p.price - (p.discountPrice || p.price)).toLocaleString()}</span>
                    <div>
                      <img src={p.mainImage} alt={p.name} className="w-full h-32 object-cover rounded-xl mb-3 group-hover:scale-[1.03] transition-all" />
                      <h4 className="font-bold text-sm text-white line-clamp-1 mb-1">{p.name}</h4>
                      <div className="flex items-baseline gap-1.5 mb-3">
                        <span className="text-base font-black text-orange-400 font-mono">৳{p.discountPrice?.toLocaleString()}</span>
                        <span className="text-[11px] text-slate-500 line-through font-mono">৳{p.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate(`#product/${p.slug}`)}
                      className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-center text-xs font-semibold transition"
                    >
                      Buy Today
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. FEATURED PRODUCTS SCROLL */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500">Premium Tech</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Featured Showroom</h2>
          </div>
          <button onClick={() => onNavigate('#shop?filter=featured')} className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1">
            See All Featured <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(p => {
            const hasDiscount = p.discountPrice !== undefined && p.discountPrice < p.price;
            return (
              <div
                key={p.id}
                className="group bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-500/30 transition-all duration-200 flex flex-col h-full"
              >
                {/* Image center */}
                <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden">
                  <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  
                  {/* Badges */}
                  {p.badge && (
                    <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-md tracking-wider shadow-md ${
                      p.badge === 'Hot' ? 'bg-red-600 text-white' :
                      p.badge === 'New' ? 'bg-orange-500 text-white' :
                      p.badge === 'Sale' ? 'bg-amber-600 text-white' :
                      'bg-slate-700 text-white'
                    }`}>
                      {p.badge}
                    </span>
                  )}
                  
                  {/* Quick-view / Floating controls */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => onNavigate(`#product/${p.slug}`)}
                      className="p-3 bg-white hover:bg-orange-500 hover:text-white text-slate-900 rounded-xl shadow-lg transition-all text-xs font-semibold"
                    >
                      View Specifications
                    </button>
                  </div>
                </div>

                {/* Info block */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-orange-500 uppercase font-mono">{p.brand}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span className="text-xs font-bold font-mono">{p.rating}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate(`#product/${p.slug}`)}
                      className="text-left font-bold text-slate-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 block transition mb-2 text-sm sm:text-base line-clamp-2"
                    >
                      {p.name}
                    </button>
                    {/* Stock Status indicator */}
                    <div className="mb-4">
                      {p.stock > 0 ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400">Available: <span className="font-mono text-emerald-500 font-bold">{p.stock} units left</span></p>
                      ) : (
                        <p className="text-xs text-red-500 font-mono font-bold">Out of Stock</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
                        ৳{(hasDiscount ? p.discountPrice : p.price)?.toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through font-mono">
                          ৳{p.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {/* Add to action */}
                    {p.stock > 0 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p.id, 1);
                        }}
                        className="w-full py-3 bg-slate-900 dark:bg-slate-800 hover:bg-orange-600 text-white rounded-xl text-center text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" /> Add to Shopping Cart
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl text-center text-xs font-bold cursor-not-allowed"
                      >
                        SOLD OUT / Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. PROMOTIONAL DOUBLE BANNER */}
      <section className="max-w-7xl mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 border border-slate-800">
          <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800')" }}></div>
          <div className="relative space-y-4">
            <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-wider">Premium Sound Gears</span>
            <h3 className="text-xl sm:text-2xl font-black">Audiophile Wireless Over-Ears</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              Discover unparalleled clarity. Order authorized wireless active noise cancellation devices with official servicing coverage.
            </p>
            <button
              onClick={() => onNavigate('#shop?categoryId=cat-audio')}
              className="px-5 py-2.5 bg-white text-slate-950 hover:bg-orange-500 hover:text-white rounded-xl font-bold text-xs transition"
            >
              Shop Headphones 🎧
            </button>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 to-slate-950 text-white p-8 border border-slate-800">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800')" }}></div>
          <div className="relative space-y-4">
            <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-wider">Apex Esports Setup</span>
            <h3 className="text-xl sm:text-2xl font-black">Pro Tactile Keyboards</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              Take typing speed to astronomical levels. Customizable macros, dynamic RGB panels, and direct service warranty keys.
            </p>
            <button
              onClick={() => onNavigate('#shop?categoryId=cat-accessories')}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs transition"
            >
              View Mechanical Boards ⌨️
            </button>
          </div>
        </div>
      </section>

      {/* 7. TRENDING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500">Popular Tech Demands</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Trending Bangladesh</h2>
          </div>
          <button onClick={() => onNavigate('#shop?filter=trending')} className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1">
            See All Trending <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map(p => {
            const hasDiscount = p.discountPrice !== undefined && p.discountPrice < p.price;
            return (
              <div
                key={p.id}
                className="group bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-500/30 transition-all duration-200 flex flex-col h-full"
              >
                <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-900/40 overflow-hidden">
                  <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  
                  {p.badge && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-mono font-bold rounded">
                      {p.badge}
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase font-mono mb-1 block">{p.brand}</span>
                    <button
                      onClick={() => onNavigate(`#product/${p.slug}`)}
                      className="text-left font-bold text-slate-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 block transition mb-2 text-sm line-clamp-2"
                    >
                      {p.name}
                    </button>
                    <p className="text-xs text-slate-450 dark:text-slate-400 line-clamp-2 mb-4">{p.shortDescription}</p>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono">
                        ৳{(hasDiscount ? p.discountPrice : p.price)?.toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through font-mono">
                          ৳{p.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {p.stock > 0 ? (
                      <button
                        onClick={() => addToCart(p.id, 1)}
                        className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-800 dark:text-slate-200 rounded-lg text-center text-xs font-bold transition"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <span className="block w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 text-center text-xs font-bold rounded-lg cursor-not-allowed">
                        Stock Empty
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. BRANDS SHOWCASE */}
      <section className="bg-white dark:bg-slate-950 py-12 border-y border-slate-200/50 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-mono uppercase text-slate-400 tracking-widest mb-6">Authorized official partners</p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-65 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
            <span className="text-2xl font-black tracking-tighter text-slate-600 dark:text-slate-400">ASUS ROG</span>
            <span className="text-2xl font-black tracking-widest text-slate-600 dark:text-slate-400">APPLE</span>
            <span className="text-2xl font-black tracking-normal text-slate-600 dark:text-slate-400">SONY</span>
            <span className="text-2xl font-black tracking-tight text-slate-600 dark:text-slate-400">SAMSUNG</span>
            <span className="text-2xl font-bold tracking-tight text-slate-600 dark:text-slate-400">STEELSERIES</span>
          </div>
        </div>
      </section>

      {/* 9. REVIEWS FEED */}
      {approvedReviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500">Unbiased Feedback</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">What Shoppers Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approvedReviews.map(r => (
              <div key={r.id} className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-150 dark:border-slate-800 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed">
                    &ldquo;{r.comment}&rdquo;
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-4">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">{r.customerName}</h5>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500 font-mono">Verified Buyer</p>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 10. NEWSLETTER SECTION */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-md mx-auto space-y-4">
            <h3 className="text-xl sm:text-2xl font-black">Subscribe to Newsletter</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Get weekly stock alert updates, secret coupon codes, and specifications comparison guides directly into your mail.
            </p>
            
            {subscribed ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl font-medium font-mono animate-in fade-in">
                🎉 Awesome! Email loaded. We will send stock drops!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 pt-2">
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-semibold transition shrink-0"
                >
                  Join Up
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

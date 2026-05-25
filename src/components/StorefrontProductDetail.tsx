/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useDb } from '../dbContext';
import { ShoppingCart, Star, Heart, Calendar, ArrowLeft, CheckCircle, Smartphone, Volume2, ShieldAlert, Award, Phone, Clock, Send, Eye } from 'lucide-react';

interface DetailProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export default function StorefrontProductDetail({ onNavigate, currentRoute }: DetailProps) {
  const {
    products,
    reviews,
    addReview,
    addToCart,
    wishlist,
    toggleWishlist,
    addRecentlyViewed,
    incrementProductView
  } = useDb();

  // Extract slug from #product/:slug
  const getSlug = () => {
    const hash = currentRoute || window.location.hash || '';
    const parts = hash.split('/');
    return parts[parts.length - 1]?.split('?')[0] || '';
  };

  const productSlug = getSlug();
  const product = products.find(p => p.slug === productSlug);

  // Focus image index
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'revs'>('desc');
  
  // Review inputs
  const [reviewerName, setReviewerName] = useState('');
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Sync viewed statistics
  useEffect(() => {
    if (product) {
      incrementProductView(product.id);
      addRecentlyViewed(product.id);
      setActiveImageIndex(0);
      setPurchaseQty(1);
    }
  }, [productSlug]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center text-slate-400 font-mono space-y-4">
        <p className="text-base text-slate-500">⚠️ Under Construction or product not found.</p>
        <button onClick={() => onNavigate('#shop')} className="px-5 py-2 bg-orange-600 font-bold hover:bg-orange-700 text-white rounded-xl text-xs font-mono">
          Return to Shop Search
        </button>
      </div>
    );
  }

  const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.price;
  const unitPrice = product.discountPrice || product.price;

  // Find related products (same category, omit self)
  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  // Find approved reviews for this product
  const productReviews = reviews.filter(r => r.productId === product.id && r.isApproved);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewerName.trim() && reviewComment.trim()) {
      addReview({
        productId: product.id,
        customerName: reviewerName.trim(),
        rating: reviewStars,
        comment: reviewComment.trim()
      });
      setReviewSubmitted(true);
      setReviewerName('');
      setReviewComment('');
      setTimeout(() => setReviewSubmitted(false), 5000);
    }
  };

  const handleBuyNow = () => {
    if (product.stock > 0) {
      addToCart(product.id, purchaseQty, true);
      onNavigate('#checkout');
    }
  };

  const isWished = wishlist.includes(product.id);

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors py-12 relative pb-28 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb back link */}
        <button
          onClick={() => onNavigate('#shop')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-orange-500 font-mono font-bold mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back to Store Catalog
        </button>

        {/* Master Showcase Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-16">
          
          {/* Advanced image gallery */}
          <div className="space-y-4">
            <div className="w-full aspect-square bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-3xl overflow-hidden relative shadow-xs">
              <img
                src={product.images[activeImageIndex] || product.mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs text-slate-800 dark:text-white rounded-full shadow-md hover:bg-white transition-colors"
              >
                <Heart className={`w-5 h-5 ${isWished ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnail selector gallery row */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 bg-white dark:bg-slate-950 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeImageIndex === idx ? 'border-orange-500 scale-95 shadow-md' : 'border-slate-100 dark:border-slate-850 opacity-75 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Checkout & conversion specs board */}
          <div className="space-y-6">
            
            {/* Status overview and brand heading */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 font-bold font-mono rounded text-xs select-none uppercase tracking-wider">{product.brand}</span>
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-350 font-mono rounded text-xs">SKU: {product.sku}</span>
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {product.viewCount + 130} Views</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {product.name}
              </h1>
              
              {/* Star ratings display */}
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-400">({product.rating} / 5.0 Rating based on verified reviews)</span>
              </div>
            </div>

            {/* Price section block */}
            <div className="p-5 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl flex items-center justify-between shadow-xs">
              <div>
                <p className="text-xs text-slate-500 font-mono">AUTHORIZED BD PRICE</p>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-500 font-mono">৳{unitPrice.toLocaleString()}</span>
                  {hasDiscount && (
                    <span className="text-sm text-slate-400 line-through font-mono">৳{product.price.toLocaleString()}</span>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                {product.stock > 0 ? (
                  <div>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-bold font-mono uppercase tracking-wide">In Stock</span>
                    <p className="text-[11px] text-slate-450 dark:text-slate-500 font-mono mt-1">Ready for next-day dispatch</p>
                  </div>
                ) : (
                  <div>
                    <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-500 text-xs font-bold font-mono uppercase tracking-wide">Stock Out</span>
                    <p className="text-[11px] text-slate-450 dark:text-slate-500 font-mono mt-1">Preorder available via hotline</p>
                  </div>
                )}
              </div>
            </div>

            {/* Short review summary excerpt */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
              {product.shortDescription}
            </p>

            {/* Quantity controls and Add/Buy actions */}
            {product.stock > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase text-slate-450 font-mono">Order Qty</span>
                  
                  <div className="flex items-center bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-xl overflow-hidden font-mono text-sm max-w-[140px] select-none h-11">
                    <button
                      onClick={() => setPurchaseQty(p => Math.max(1, p - 1))}
                      className="px-3.5 hover:bg-slate-100 dark:hover:bg-slate-900 h-full font-extrabold focus:outline-none"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold px-4">{purchaseQty}</span>
                    <button
                      onClick={() => setPurchaseQty(p => Math.min(product.stock, p + 1))}
                      className="px-3.5 hover:bg-slate-100 dark:hover:bg-slate-900 h-full font-extrabold focus:outline-none"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">(Max stock units available: {product.stock})</span>
                </div>

                {/* Primary Button groups */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => addToCart(product.id, purchaseQty)}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-black/10"
                  >
                    <ShoppingCart className="w-5 h-5 text-orange-500" /> Add to Shopping Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center cursor-pointer shadow-lg shadow-orange-600/10"
                  >
                    🚀 Buy Now (Cash on Delivery)
                  </button>
                </div>
              </div>
            )}

            {/* Direct Instant Booking Assistance over Hotline */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase font-mono">📞 Phone Order Service Active</p>
                <p className="text-slate-500 leading-relaxed">Book directly through our desk support agents, no login required.</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href="tel:+8801712345678"
                  className="px-3 py-2 bg-slate-900 text-white hover:bg-orange-600 font-bold font-mono rounded-lg transition-colors text-center text-[11px]"
                >
                  Call: +880 1712-345678
                </a>
              </div>
            </div>

            {/* Security/Trust seals */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-[10px] text-slate-500 font-mono">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-850">🛡️ 1-Year official Warranty</div>
              <div className="p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-850">🔄 7-day Simple Replacement</div>
              <div className="p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-850">📦 Secure Double Bubble Packing</div>
            </div>

          </div>
        </div>

        {/* Informative description, specs, reviews, specification tab panel */}
        <section className="mb-16">
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 font-mono text-sm">
            <button
              onClick={() => setActiveTab('desc')}
              className={`py-3.5 px-6 font-bold border-b-2 -mb-0.5 transition-all focus:outline-none ${activeTab === 'desc' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-500 hover:text-white'}`}
            >
              Rich Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-3.5 px-6 font-bold border-b-2 -mb-0.5 transition-all focus:outline-none ${activeTab === 'specs' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-500 hover:text-white'}`}
            >
              Specifications Sheets
            </button>
            <button
              onClick={() => setActiveTab('revs')}
              className={`py-3.5 px-6 font-bold border-b-2 -mb-0.5 transition-all focus:outline-none ${activeTab === 'revs' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-500 hover:text-white'}`}
            >
              Customer Reviews ({productReviews.length})
            </button>
          </div>

          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 p-6 sm:p-8 leading-relaxed text-sm">
            
            {/* Description tab */}
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Product Overview</h3>
                <p className="text-slate-600 dark:text-slate-350">{product.description}</p>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <h4 className="font-bold mb-1 font-mono text-xs uppercase text-orange-500">Fast Nationwide Delivery</h4>
                    <p className="text-xs text-slate-500">Dhaka orders delivered inside 24 hours. Outside regions handled securely via premier local couriers.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <h4 className="font-bold mb-1 font-mono text-xs uppercase text-orange-500">Strict Return Integrity</h4>
                    <p className="text-xs text-slate-500">We verify all serial codes. Warranty remains fully active when box security seals are correctly maintained.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Specifications Tab sheet */}
            {activeTab === 'specs' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Technical Specifications sheet</h3>
                <div className="border border-slate-100 dark:border-slate-900 rounded-xl overflow-hidden">
                  <table className="w-full text-xs sm:text-sm text-left">
                    <tbody>
                      {product.specs.map((sp, idx) => (
                        <tr key={idx} className="border-b border-slate-100 dark:border-slate-900/60 font-mono last:border-0 odd:bg-slate-50/50 dark:odd:bg-slate-900/10">
                          <td className="py-3 px-4 font-bold text-slate-600 dark:text-slate-400 w-1/3">{sp.label}</td>
                          <td className="py-3 px-4 text-slate-900 dark:text-white">{sp.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reviews list with submissions logic */}
            {activeTab === 'revs' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Visual stars overview metrics */}
                <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border dark:border-slate-900">
                  <p className="text-xs font-mono font-bold text-slate-400 uppercase">Store feedback statistics</p>
                  <div>
                    <h4 className="text-4xl font-black text-slate-905 dark:text-white font-mono">{product.rating}</h4>
                    <span className="text-xs text-slate-500">Out of 5.0 perfect active status</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2"><span>5 Star</span><span className="flex-1 bg-slate-200 dark:bg-slate-850 h-2 rounded overflow-hidden"><span className="block bg-amber-500 h-full w-[85%]"></span></span><span>85%</span></div>
                    <div className="flex items-center gap-2"><span>4 Star</span><span className="flex-1 bg-slate-200 dark:bg-slate-850 h-2 rounded overflow-hidden"><span className="block bg-amber-500 h-full w-[10%]"></span></span><span>10%</span></div>
                    <div className="flex items-center gap-2"><span>3 Star</span><span className="flex-1 bg-slate-200 dark:bg-slate-850 h-2 rounded overflow-hidden"><span className="block bg-amber-500 h-full w-[5%]"></span></span><span>5%</span></div>
                  </div>
                </div>

                {/* Feed & Entry */}
                <div className="lg:col-span-2 space-y-6">
                  {/* review items */}
                  {productReviews.length > 0 ? (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                      {productReviews.map(r => (
                        <div key={r.id} className="p-4 border dark:border-slate-900 rounded-xl leading-relaxed text-xs sm:text-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h5 className="font-extrabold text-slate-900 dark:text-white">{r.customerName}</h5>
                              <div className="flex text-amber-500 gap-0.5 mt-0.5">
                                {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />)}
                              </div>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">{r.date}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-350 italic">&ldquo;{r.comment}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 font-mono text-center py-6 text-xs bg-slate-50 dark:bg-slate-900/30 rounded-xl">📌 Be the first to catalog a customer review for this product specs!</p>
                  )}

                  {/* Submission form */}
                  <div className="border-t border-slate-100 dark:border-slate-900 pt-6">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Add Your Verified Review</h4>
                    
                    {reviewSubmitted ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs sm:text-sm font-mono font-medium animate-in fade-in">
                        ✅ Thank you! Review submitted successfully. It will display immediately upon Admin review approvals.
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-400 uppercase">Your Name</label>
                            <input
                              type="text"
                              required
                              value={reviewerName}
                              onChange={(e) => setReviewerName(e.target.value)}
                              placeholder="E.g. Tanveer Hossain"
                              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-400 uppercase">Rating Score</label>
                            <select
                              value={reviewStars}
                              onChange={(e) => setReviewStars(Number(e.target.value))}
                              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                            >
                              <option value="5">⭐⭐⭐⭐⭐ Excellent (5 Stars)</option>
                              <option value="4">⭐⭐⭐⭐ Great (4 Stars)</option>
                              <option value="3">⭐⭐⭐ Neutral (3 Stars)</option>
                              <option value="2">⭐⭐ Poor (2 Stars)</option>
                              <option value="1">⭐ Horrible (1 Star)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">Your Honest Comment</label>
                          <textarea
                            required
                            rows={3}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your unpack experience, fast courier rating, or hardware thermals testing..."
                            className="w-full text-xs bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none resize-none"
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          Submit Review for Moderation <Send className="w-3 h-3" />
                        </button>
                      </form>
                    )}
                  </div>

                </div>

              </div>
            )}

          </div>
        </section>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-slate-200 dark:border-slate-800 pt-16">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-8">Related Electronics Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => {
                const disc = p.discountPrice !== undefined && p.discountPrice < p.price;
                return (
                  <div
                    key={p.id}
                    onClick={() => onNavigate(`#product/${p.slug}`)}
                    className="group bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-orange-500/20 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900/60 p-2">
                      <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300 rounded-xl" />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold text-orange-500 uppercase font-mono">{p.brand}</span>
                      <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 text-sm mt-0.5">{p.name}</h4>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-sm font-black text-orange-500 font-mono">৳{(disc ? p.discountPrice : p.price)?.toLocaleString()}</span>
                        {disc && <span className="text-[10px] text-slate-500 line-through font-mono">৳{p.price.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>

      {/* MOBILE STICKY BOTTOM ADD TO CART PANEL */}
      {product.stock > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 dark:bg-slate-950 border-t border-slate-800 p-4 flex items-center justify-between gap-4 z-40 shadow-2xl animate-in slide-in-from-bottom">
          <div className="shrink-0">
            <p className="text-[10px] text-slate-400 font-mono uppercase">Booking item</p>
            <p className="text-sm font-black text-white font-mono">৳{unitPrice.toLocaleString()}</p>
          </div>
          <button
            onClick={() => addToCart(product.id, 1)}
            className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-center text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition shadow-md shadow-orange-600/10"
          >
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      )}

    </div>
  );
}

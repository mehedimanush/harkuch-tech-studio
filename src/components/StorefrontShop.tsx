/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useDb } from '../dbContext';
import { Filter, Star, ShoppingCart, SlidersHorizontal, Grid3X3, Trash2, Heart, Search, CheckCircle } from 'lucide-react';

interface ShopProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export default function StorefrontShop({ onNavigate, currentRoute }: ShopProps) {
  const { products, categories, cart, wishlist, toggleWishlist, addToCart } = useDb();

  // Extract hash parameters manually
  const getHashParams = () => {
    const hash = currentRoute || window.location.hash || '#shop';
    const paramString = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(paramString);
    return {
      categoryId: params.get('categoryId') || '',
      search: params.get('search') || '',
      filterType: params.get('filter') || '' // featured or trending
    };
  };

  const hashParams = getHashParams();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(hashParams.categoryId);
  const [searchQuery, setSearchQuery] = useState(hashParams.search);
  const [priceRange, setPriceRange] = useState(250000); // Max price representation
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  // Sync state if parameters in URL changes
  useEffect(() => {
    const updated = getHashParams();
    if (updated.categoryId !== selectedCategory) setSelectedCategory(updated.categoryId);
    if (updated.search !== searchQuery) setSearchQuery(updated.search);
  }, [currentRoute]);

  // Extract list of all unique brands available for filter lists
  const availableBrands = Array.from(new Set(products.map(p => p.brand)));

  // Perform filtration algorithms
  const filteredProducts = products.filter(p => {
    // 1. Category matched?
    if (selectedCategory && p.categoryId !== selectedCategory) return false;

    // 2. Search text matched name, brand, tag?
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchBrand && !matchTags) return false;
    }

    // 3. Max Price matched?
    const currentPrice = p.discountPrice || p.price;
    if (currentPrice > priceRange) return false;

    // 4. Brand matched?
    if (selectedBrand && p.brand !== selectedBrand) return false;

    // 5. Star ratings matched?
    if (selectedRating > 0 && p.rating < selectedRating) return false;

    // 6. In stock check?
    if (onlyInStock && p.stock <= 0) return false;

    // 7. General cover badges (featured/trending)
    if (hashParams.filterType === 'featured' && !p.isFeatured) return false;
    if (hashParams.filterType === 'trending' && !p.isTrending) return false;

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;

    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return b.id.localeCompare(a.id); // simulate id dates
    return b.viewCount - a.viewCount; // popular
  });

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange(250000);
    setSelectedBrand('');
    setSelectedRating(0);
    setOnlyInStock(false);
    setSortBy('popular');
    onNavigate('#shop'); // reset params query string
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 transition-colors py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner section header */}
        <div className="mb-8 p-6 sm:p-8 bg-slate-900 text-white rounded-3xl relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800')" }}></div>
          <div className="relative space-y-2">
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest block">Explore our catalog</span>
            <h1 className="text-2xl sm:text-3xl font-black">All Original Electronics & Accessories</h1>
            <p className="text-xs sm:text-sm text-slate-350 max-w-xl font-mono">
              Use filters below to find the exact hardware spec you desire. Secure BDT cash on delivery across Bangladesh.
            </p>
          </div>
        </div>

        {/* Filters and Controls Area */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* SIDEBAR FILTERS (DESKTOP) */}
          <aside className="hidden lg:block w-72 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-150 dark:border-slate-850 shrink-0 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-4">
              <span className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <SlidersHorizontal className="w-4 h-4 text-orange-500" /> Filter Criteria
              </span>
              <button onClick={clearFilters} className="text-xs text-orange-600 hover:text-orange-700 font-mono font-semibold">
                Clear All
              </button>
            </div>

            {/* Keyword Search field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-450 dark:text-slate-400 font-mono">Keywords</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Spec, code, name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 outline-none focus:border-orange-500 font-mono text-slate-900 dark:text-white"
                />
                <Search className="w-3.5 h-3.5 absolute right-2.5 top-3 text-slate-400" />
              </div>
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-450 dark:text-slate-400 font-mono">Category list</label>
              <div className="grid gap-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left text-xs p-2 rounded-lg transition-colors flex items-center justify-between ${!selectedCategory ? 'bg-orange-500/10 text-orange-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] font-mono opacity-60">({products.length})</span>
                </button>
                {categories.map(cat => {
                  const totalCount = products.filter(p => p.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left text-xs p-2 rounded-lg transition-colors flex items-center justify-between ${selectedCategory === cat.id ? 'bg-orange-500/10 text-orange-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] font-mono opacity-60">({totalCount})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-450 dark:text-slate-400 font-mono">Max Budget</label>
                <span className="text-xs font-bold text-orange-500 font-mono">৳{priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="250000"
                step="5000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>৳1K</span>
                <span>৳125K</span>
                <span>৳250K</span>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-450 dark:text-slate-400 font-mono">Popular Brands</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setSelectedBrand('')}
                  className={`px-2 py-1.5 rounded-lg border text-xs text-center transition-all ${!selectedBrand ? 'border-orange-500 bg-orange-500/10 text-orange-400 font-mono font-bold' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono'}`}
                >
                  All Brands
                </button>
                {availableBrands.map(br => (
                  <button
                    key={br}
                    onClick={() => setSelectedBrand(br)}
                    className={`px-2 py-1.5 rounded-lg border text-xs text-center truncate transition-all ${selectedBrand === br ? 'border-orange-500 bg-orange-500/10 text-orange-400 font-mono font-bold' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono'}`}
                  >
                    {br}
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating threshold */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-450 dark:text-slate-400 font-mono">Minimum Rating</label>
              <div className="flex gap-1 justify-between">
                {[0, 3, 4, 4.5].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setSelectedRating(stars)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center justify-center gap-1 transition ${selectedRating === stars ? 'border-orange-500 bg-orange-500/10 text-orange-400 font-bold' : 'border-slate-200 dark:border-slate-800'}`}
                  >
                    {stars === 0 ? 'Any' : (
                      <>
                        <span>{stars}</span>
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability checklist */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-900">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 accent-orange-500"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* MAIN PRODUCT LISTS */}
          <section className="flex-1 w-full space-y-6">
            
            {/* Top Sort Controls */}
            <div className="bg-white dark:bg-slate-950 px-5 py-4 rounded-2xl border border-slate-150 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
              <p className="text-xs font-mono text-slate-500">
                Found <span className="text-orange-500 font-extrabold">{sortedProducts.length}</span> matching products in active store
              </p>
              
              <div className="flex items-center gap-2.5">
                {/* Mobile Filter slide toggle button */}
                <button
                  onClick={() => setShowMobileDrawer(true)}
                  className="lg:hidden px-3.5 py-2 flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5 text-orange-500" /> Filters
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono">SortBy:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-xs rounded-xl px-3 py-1.5 focus:outline-none text-slate-900 dark:text-slate-200 font-mono cursor-pointer"
                  >
                    <option value="popular">Most Popular Hits</option>
                    <option value="price-low">Price Low to High</option>
                    <option value="price-high">Price High to Low</option>
                    <option value="rating">Top Rated Stars</option>
                    <option value="newest">Recently Added</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List products grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map(p => {
                  const hasDiscount = p.discountPrice !== undefined && p.discountPrice < p.price;
                  const isWish = wishlist.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      className="group bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-500/30 transition-all duration-200 flex flex-col justify-between"
                    >
                      {/* Image showcase */}
                      <div className="relative aspect-square bg-slate-50 dark:bg-slate-900/40 overflow-hidden shrink-0">
                        <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        
                        {/* Discount save label */}
                        {hasDiscount && (
                          <span className="absolute top-3 left-3 px-2 py-0.5 bg-red-600 text-white text-[9px] font-mono font-black uppercase rounded shadow-sm">
                            SAVE ৳{(p.price - (p.discountPrice || p.price)).toLocaleString()}
                          </span>
                        )}

                        {/* Top corner badge */}
                        {p.badge && (
                          <span className="absolute top-3 right-12 px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-mono font-bold rounded">
                            {p.badge}
                          </span>
                        )}

                        {/* Wishlist toggle anchor */}
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/45 hover:bg-black/80 backdrop-blur-xs text-white transition-all shadow-md cursor-pointer"
                          title="Save to Wishlist"
                        >
                          <Heart className={`w-4 h-4 ${isWish ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
                        </button>
                      </div>

                      {/* Info details */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-mono font-semibold text-orange-500 uppercase">{p.brand}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span className="text-xs font-mono font-bold">{p.rating}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => onNavigate(`#product/${p.slug}`)}
                            className="text-left font-bold text-slate-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 block transition mb-2.5 text-sm sm:text-base line-clamp-2"
                          >
                            {p.name}
                          </button>
                          
                          <p className="text-xs text-slate-500 dark:text-slate-450 line-clamp-2 mb-4 leading-relaxed">
                            {p.shortDescription}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-lg font-black text-slate-910 dark:text-white font-mono">
                              ৳{(hasDiscount ? p.discountPrice : p.price)?.toLocaleString()}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-slate-400 line-through font-mono">
                                ৳{p.price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-auto">
                            <button
                              onClick={() => onNavigate(`#product/${p.slug}`)}
                              className="w-full py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-center text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                              Specs Info
                            </button>
                            {p.stock > 0 ? (
                              <button
                                onClick={() => addToCart(p.id, 1)}
                                className="w-full py-2 bg-slate-900 dark:bg-slate-800 hover:bg-orange-600 text-white rounded-xl text-center text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" /> Cart It
                              </button>
                            ) : (
                              <span className="block w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 text-center text-xs font-bold rounded-xl cursor-not-allowed">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-950 p-16 text-center border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col items-center justify-center space-y-4">
                <p className="text-base text-slate-400 font-mono">⚠️ No matching electronic items found for current filter set.</p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold font-mono"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </section>

        </div>
      </div>

      {/* MOBILE FLOATING FILTER DRAWER */}
      {showMobileDrawer && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div onClick={() => setShowMobileDrawer(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-colors"></div>
          
          <div className="relative flex flex-col w-5/6 max-w-sm bg-white dark:bg-slate-950 h-full p-6 text-slate-800 dark:text-white shadow-2xl overflow-y-auto animate-in slide-in-from-right z-50">
            <div className="flex items-center justify-between border-b dark:border-slate-850 pb-4 mb-6">
              <span className="font-bold text-sm">Fine-Tune Search</span>
              <button onClick={() => setShowMobileDrawer(false)} className="text-xs text-orange-500 font-mono font-bold">Done</button>
            </div>

            <div className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 font-bold uppercase">Subcategory</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-2 text-xs font-mono cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Price range */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-400 uppercase font-bold">Max pricing</span>
                  <span className="font-bold text-orange-500 font-mono">৳{priceRange.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="250000"
                  step="5000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 font-bold uppercase">Popular brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-2 text-xs font-mono cursor-pointer"
                >
                  <option value="">All Brands</option>
                  {availableBrands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* In stock */}
              <label className="flex items-center gap-2.5 pt-4 border-t dark:border-slate-850 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-xs font-semibold">Available In-Stock Only</span>
              </label>

              <button
                onClick={clearFilters}
                className="w-full mt-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs font-semibold font-mono text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

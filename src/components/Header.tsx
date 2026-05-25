/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useDb } from '../dbContext';
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown, User, Sun, Moon, Laptop, Smartphone, Watch, Headphones, Keyboard, Monitor, Camera, Settings, LogOut, ArrowRight, Eye } from 'lucide-react';

interface HeaderProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export default function Header({ onNavigate, currentRoute }: HeaderProps) {
  const {
    products,
    categories,
    cart,
    wishlist,
    isDark,
    toggleDarkMode,
    currentUser,
    currentAdmin,
    logoutUser,
    logoutAdmin,
    headerSettings
  } = useDb();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions based on searchQuery
  const suggestions = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const cartCount = cart.reduce((acc, c) => acc + c.quantity, 0);

  // Get Category icon
  function getCategoryIcon(catId: string) {
    switch (catId) {
      case 'cat-laptops': return <Laptop className="w-4 h-4 text-orange-500" />;
      case 'cat-smartphones': return <Smartphone className="w-4 h-4 text-orange-500" />;
      case 'cat-watches': return <Watch className="w-4 h-4 text-orange-500" />;
      case 'cat-audio': return <Headphones className="w-4 h-4 text-orange-500" />;
      case 'cat-accessories': return <Keyboard className="w-4 h-4 text-orange-500" />;
      case 'cat-monitors': return <Monitor className="w-4 h-4 text-orange-500" />;
      case 'cat-cameras': return <Camera className="w-4 h-4 text-orange-500" />;
      default: return <Settings className="w-4 h-4" />;
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`#shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 text-white dark:bg-slate-950 border-b border-slate-800 transition-all duration-250">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowMobileMenu(true); }}
              className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
              id="harkuch-mobi-drawer-open"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => onNavigate('#home')}
              className="flex items-center gap-2 text-left"
            >
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300">
                  {headerSettings.logoUrl}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 font-semibold uppercase">
                  BD Electronics
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => onNavigate('#home')}
              className={`hover:text-orange-500 transition-colors ${currentRoute === '#home' ? 'text-orange-500 font-semibold' : 'text-slate-300'}`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('#shop')}
              className={`hover:text-orange-500 transition-colors ${currentRoute.startsWith('#shop') ? 'text-orange-500 font-semibold' : 'text-slate-300'}`}
            >
              Shop All
            </button>
            
            {/* Mega Menu Toggle */}
            <div
              className="relative"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <button className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors py-4">
                Categories
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Absolute dropdown */}
              {showMegaMenu && (
                <div 
                  id="harkuch-categories-mega-menu"
                  className="absolute top-12 left-0 w-80 bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <p className="text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider px-2">Shop by Category</p>
                  <div className="grid gap-1">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onNavigate(`#shop?categoryId=${cat.id}`);
                          setShowMegaMenu(false);
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-lg text-left text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all text-sm group"
                      >
                        <div className="p-1.5 rounded bg-slate-800 group-hover:bg-orange-500/20 transition-all">
                          {getCategoryIcon(cat.id)}
                        </div>
                        <div>
                          <div className="font-medium">{cat.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('#blog')}
              className={`hover:text-orange-500 transition-colors ${currentRoute.startsWith('#blog') ? 'text-orange-500 font-semibold' : 'text-slate-300'}`}
            >
              Blog
            </button>
            <button
              onClick={() => onNavigate('#contact')}
              className={`hover:text-orange-500 transition-colors ${currentRoute === '#contact' ? 'text-orange-500 font-semibold' : 'text-slate-300'}`}
            >
              Contact
            </button>
          </nav>

          {/* Search bar wrapper */}
          <div ref={searchRef} className="hidden sm:block flex-1 max-w-md relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Query products, specs, brands..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-4 pr-10 text-sm placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                />
                <button type="submit" className="absolute right-3 top-3 text-slate-400 hover:text-white" id="desktop-search-bttn">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* suggestions dropdown */}
            {showSuggestions && searchQuery.trim() && (
              <div className="absolute top-12 left-0 w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150">
                {suggestions.length > 0 ? (
                  <div>
                    <p className="text-xs font-mono text-slate-500 py-2 px-4 border-b border-slate-800 bg-slate-900/50">MATCHING SPECIFICATIONS</p>
                    {suggestions.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onNavigate(`#product/${p.slug}`);
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between p-3 hover:bg-slate-800/80 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={p.mainImage} alt={p.name} className="w-10 h-10 object-cover rounded border border-slate-800" />
                          <div>
                            <p className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors line-clamp-1">{p.name}</p>
                            <p className="text-xs text-slate-400 font-mono">{p.brand} • SKU: {p.sku}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-orange-400 font-mono">৳{p.discountPrice || p.price}</p>
                          {p.discountPrice && (
                            <p className="text-[10px] text-slate-500 line-through font-mono">৳{p.price}</p>
                          )}
                        </div>
                      </button>
                    ))}
                    <div className="p-2 border-t border-slate-800 bg-slate-900/50">
                      <button
                        onClick={() => {
                          onNavigate(`#shop?search=${encodeURIComponent(searchQuery)}`);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-center py-2 text-xs text-slate-400 hover:text-orange-400 font-mono flex items-center justify-center gap-1.5"
                      >
                        See all matching results <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 text-sm font-mono">
                    ⚠️ No products found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Icons stack */}
          <div className="flex items-center gap-2 sm:gap-4 select-none">
            
            {/* Theme switcher */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={isDark ? "Light theme" : "Dark theme"}
              id="harkuch-theme-toggler"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => onNavigate('#account?tab=wishlist')}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative"
              title="My Wishlist"
              id="harkuch-wish-icon"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-orange-600 text-[10px] font-bold flex items-center justify-center text-white font-mono animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => onNavigate('#cart')}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative"
              title="Shopping Cart"
              id="harkuch-cart-icon"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-orange-600 text-[10px] font-bold flex items-center justify-center text-white font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Customer accounts list */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
                id="header-user-menu-trigger"
              >
                <User className="w-5 h-5 text-slate-200" />
                {currentUser && <span className="hidden md:inline text-xs text-orange-400 font-mono truncate max-w-[80px]">{currentUser.name}</span>}
                {currentAdmin && <span className="hidden md:inline text-xs text-emerald-400 font-mono border border-emerald-500/45 px-1.5 py-0.5 rounded-md uppercase tracking-wider font-semibold">Adm</span>}
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 top-12 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-slate-200">
                  {/* If regular user logged in */}
                  {currentUser && (
                    <div className="p-3 border-b border-slate-800 mb-1">
                      <p className="text-xs text-slate-400 uppercase font-mono">Signed In As</p>
                      <p className="font-semibold text-white truncate">{currentUser.name}</p>
                      <p className="text-xs font-mono text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                  )}

                  {/* If admin logged in */}
                  {currentAdmin && (
                    <div className="p-3 border-b border-slate-800 mb-1">
                      <p className="text-xs text-emerald-400 uppercase font-mono font-semibold tracking-wider flex items-center gap-1">🛠️ {currentAdmin.role}</p>
                      <p className="font-semibold text-white truncate">{currentAdmin.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{currentAdmin.email}</p>
                    </div>
                  )}

                  <div className="grid gap-0.5 text-sm">
                    {/* General customer interactions */}
                    <button
                      onClick={() => {
                        onNavigate('#account');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      Customer Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('#track-order');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      Track Order Status
                    </button>

                    {/* Admin links */}
                    {!currentAdmin ? (
                      <button
                        onClick={() => {
                          onNavigate('#admin');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left p-2 rounded-lg text-orange-400 hover:bg-orange-500/10 hover:text-orange-300 transition-colors font-mono font-semibold"
                      >
                        Admin Workspace ⚙️
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onNavigate('#admin/dashboard');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors font-mono font-semibold"
                      >
                        Admin Dashboard ⚙️
                      </button>
                    )}

                    <div className="border-t border-slate-800 my-1"></div>

                    {currentUser && (
                      <button
                        onClick={() => {
                          logoutUser();
                          setShowUserDropdown(false);
                          onNavigate('#home');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Customer Log Out
                      </button>
                    )}

                    {currentAdmin && (
                      <button
                        onClick={() => {
                          logoutAdmin();
                          setShowUserDropdown(false);
                          onNavigate('#home');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Admin Log Out
                      </button>
                    )}

                    {!currentUser && !currentAdmin && (
                      <button
                        onClick={() => {
                          onNavigate('#account');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-center mt-1 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg text-xs transition-colors"
                      >
                        Login / Register
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-in fade-in duration-300">
          {/* Overlay background */}
          <div
            onClick={() => setShowMobileMenu(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-all"
          ></div>

          {/* Drawer content body */}
          <div className="relative flex flex-col w-5/6 max-w-sm bg-slate-900 border-r border-slate-800 h-full p-6 text-white shadow-2xl animate-in slide-in-from-left duration-250 z-50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xl font-black text-orange-500">{headerSettings.logoUrl}</span>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">BD Premium Gadgets</p>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 text-slate-300 hover:text-white"
                id="mobi-drawer-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search input */}
            <form onSubmit={handleSearchSubmit} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type specs, laptops, iphones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-4 pl-10 text-sm focus:outline-none focus:border-orange-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </form>

            {/* List links */}
            <div className="flex-1 flex flex-col gap-5 text-base font-medium">
              <button
                onClick={() => { onNavigate('#home'); setShowMobileMenu(false); }}
                className="w-full text-left py-2 border-b border-slate-800"
              >
                Home
              </button>
              <button
                onClick={() => { onNavigate('#shop'); setShowMobileMenu(false); }}
                className="w-full text-left py-2 border-b border-slate-800"
              >
                Shop All Products
              </button>
              
              {/* Category sub menu lists */}
              <div>
                <p className="text-xs uppercase font-mono text-slate-500 tracking-widest mb-2">Category Hotlist</p>
                <div className="grid gap-2 pl-2">
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onNavigate(`#shop?categoryId=${c.id}`);
                        setShowMobileMenu(false);
                      }}
                      className="w-full text-left text-sm text-slate-300 hover:text-white flex items-center gap-2 py-1"
                    >
                      {getCategoryIcon(c.id)}
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { onNavigate('#blog'); setShowMobileMenu(false); }}
                className="w-full text-left py-2 border-b border-slate-800"
              >
                Tech Blog
              </button>
              <button
                onClick={() => { onNavigate('#contact'); setShowMobileMenu(false); }}
                className="w-full text-left py-2 border-b border-slate-800"
              >
                Contact Shop
              </button>
            </div>

            {/* Footer level details in mobile drawer */}
            <div className="border-t border-slate-800 pt-6 mt-auto">
              {currentUser ? (
                <div className="mb-4">
                  <p className="text-xs text-slate-400 font-mono">Logged in as {currentUser.name}</p>
                  <button
                    onClick={() => {
                      logoutUser();
                      setShowMobileMenu(false);
                      onNavigate('#home');
                    }}
                    className="mt-2 text-xs text-red-400 block"
                  >
                    Log Out Accounts
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('#account');
                    setShowMobileMenu(false);
                  }}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-center text-sm font-semibold transition"
                >
                  Join Account / Sign In
                </button>
              )}
              <p className="text-[10px] text-slate-500 font-mono text-center mt-4">Harkuch Tech BD • 2026</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

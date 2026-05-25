/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useDb } from '../dbContext';
import { Product, Coupon, Order } from '../types';
import {
  LayoutDashboard, Package, ShoppingCart, Tag, Users, Settings,
  LogOut, Plus, Edit2, Trash2, CheckCircle2, TrendingUp, DollarSign, RefreshCw, Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function AdminPanel() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    coupons,
    addCoupon,
    deleteCoupon,
    customers,
    announcement,
    setAnnouncement,
    footerSettings,
    updateFooterSettings
  } = useDb();

  // Authentication barrier
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Tab control states: 'dashboard' | 'products' | 'orders' | 'coupons' | 'customers' | 'settings'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'coupons' | 'customers' | 'settings'>('dashboard');

  // Form modals state variables
  const [currentProductEdit, setCurrentProductEdit] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  // New/Edit product form fields
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodDiscountPrice, setProdDiscountPrice] = useState<number | undefined>(undefined);
  const [prodStock, setProdStock] = useState(0);
  const [prodCategory, setProdCategory] = useState('laptops');
  const [prodImage, setProdImage] = useState('');
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodFullDesc, setProdFullDesc] = useState('');
  const [prodSpecsText, setProdSpecsText] = useState('Processor: Intel i5\nRAM: 16GB RAM\nStorage: 512GB SSD');

  // New coupon form fields
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [couponValue, setCouponValue] = useState(0);
  const [couponMinOrder, setCouponMinOrder] = useState(0);
  const [couponLimit, setCouponLimit] = useState(500);

  // System settings fields
  const [sysAnnouncement, setSysAnnouncement] = useState(announcement);
  const [sysPhone, setSysPhone] = useState(footerSettings.phone);
  const [sysEmail, setSysEmail] = useState(footerSettings.email);
  const [sysLogo, setSysLogo] = useState('');

  // Status adjustment notes
  const [logNotes, setLogNotes] = useState('');
  const [activeOrderNoteId, setActiveOrderNoteId] = useState<string | null>(null);

  // Authentication check
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (adminEmail.trim() === 'admin@harkuch.tech' && adminPassword.trim() === 'admin123') {
      setIsAdminAuthenticated(true);
    } else {
      setAuthError('❌ Unauthorized credentials. Please use admin@harkuch.tech & admin123');
    }
  };

  // Analytics tallies
  const validOrdersCount = orders.filter(o => o.status !== 'Cancelled').length;
  const grossSalesVolume = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.total, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const dispatchActiveCount = orders.filter(o => o.status === 'Shipped').length;

  // Process daily order volume and total revenue over time
  const chartData = useMemo(() => {
    const dailyMap: Record<string, { rawDate: string; revenue: number; volume: number }> = {};
    
    orders.forEach(order => {
      if (order.status === 'Cancelled') return;
      
      const dateStr = order.orderDate || new Date().toISOString();
      const dayKey = dateStr.split('T')[0];
      
      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = {
          rawDate: dayKey,
          revenue: 0,
          volume: 0
        };
      }
      dailyMap[dayKey].revenue += order.total;
      dailyMap[dayKey].volume += 1;
    });

    // Sort chronologically
    const sortedKeys = Object.keys(dailyMap).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    return sortedKeys.map(key => {
      const item = dailyMap[key];
      let displayLabel = key;
      try {
        const d = new Date(key);
        if (!isNaN(d.getTime())) {
          displayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      } catch (err) {}

      return {
        date: displayLabel,
        revenue: item.revenue,
        volume: item.volume
      };
    });
  }, [orders]);

  const handleEditProductClick = (p: Product) => {
    setCurrentProductEdit(p);
    setProdName(p.name);
    setProdBrand(p.brand);
    setProdPrice(p.price);
    setProdDiscountPrice(p.discountPrice);
    setProdStock(p.stock);
    setProdCategory(p.categoryId);
    setProdImage(p.mainImage);
    setProdShortDesc(p.shortDescription);
    setProdFullDesc(p.description);
    setProdSpecsText(p.specs.map(sp => `${sp.label}: ${sp.value}`).join('\n'));
    setIsProductFormOpen(true);
  };

  const handleCreateProductClick = () => {
    setCurrentProductEdit(null);
    setProdName('');
    setProdBrand('');
    setProdPrice(0);
    setProdDiscountPrice(undefined);
    setProdStock(5);
    setProdCategory('laptops');
    setProdImage('https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=600');
    setProdShortDesc('Latest benchmark tech processor and optimized hardware architecture units.');
    setProdFullDesc('Experience stellar multitasking speed, next-gen tactile thermals, and optimized battery cycles curated for computing professionals.');
    setProdSpecsText('Processor: High Performance\nMemory: Next-Gen RAM\nPorts: Insured');
    setIsProductFormOpen(true);
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse specs text line format "Label: Value"
    const parsedSpecs = prodSpecsText.split('\n').map(line => {
      const parts = line.split(':');
      return {
        label: parts[0]?.trim() || 'Specification',
        value: parts.slice(1).join(':')?.trim() || 'Standard'
      };
    });

    const slug = prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const productPayload = {
      name: prodName.trim(),
      slug,
      price: Number(prodPrice),
      discountPrice: prodDiscountPrice ? Number(prodDiscountPrice) : undefined,
      brand: prodBrand.trim(),
      categoryId: prodCategory,
      stock: Number(prodStock),
      mainImage: prodImage.trim(),
      images: [prodImage.trim()],
      shortDescription: prodShortDesc.trim(),
      description: prodFullDesc.trim(),
      specs: parsedSpecs,
      sku: currentProductEdit ? currentProductEdit.sku : `HT-${Math.floor(100000 + Math.random() * 900000)}`,
      rating: currentProductEdit ? currentProductEdit.rating : 5.0,
      isFeatured: currentProductEdit ? currentProductEdit.isFeatured : true,
      isTrending: currentProductEdit ? currentProductEdit.isTrending : false,
      badge: prodStock < 3 ? 'Low Stock' : undefined,
      viewCount: currentProductEdit ? currentProductEdit.viewCount : 47
    };

    if (currentProductEdit) {
      updateProduct(currentProductEdit.id, productPayload);
    } else {
      addProduct({
        ...productPayload,
        tags: []
      });
    }

    setIsProductFormOpen(false);
    setCurrentProductEdit(null);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    addCoupon({
      code: couponCode.trim().toUpperCase(),
      type: couponType,
      value: Number(couponValue),
      minOrderAmount: Number(couponMinOrder),
      usageLimit: Number(couponLimit),
      usageCount: 0,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days valid
    });

    setCouponCode('');
    setCouponValue(0);
    setCouponMinOrder(0);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setAnnouncement(sysAnnouncement);
    updateFooterSettings({
      phone: sysPhone,
      email: sysEmail
    });
    alert('✅ Store configurations updated immediately!');
  };

  // IF NOT AUTHENTICATED
  if (!isAdminAuthenticated) {
    return (
      <div className="w-full bg-slate-950 min-h-screen text-slate-200 flex items-center justify-center py-20 px-4 font-mono">
        <div className="max-w-md w-full bg-slate-910 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500">Authorized Portal</span>
            <h2 className="text-xl font-black text-white">Harkuch Admin login</h2>
            <p className="text-[10px] text-slate-500">Insert admin credentials to adjust product directories or update client logs.</p>
          </div>

          {authError && <p className="text-xs text-red-400 text-center font-bold">{authError}</p>}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@harkuch.tech"
                className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl focus:outline-none focus:border-orange-500 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Password Key</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl focus:outline-none focus:border-orange-500 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold font-mono transition text-xs"
            >
              Unlock Terminal (admin123)
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-350 font-mono text-xs flex flex-col md:flex-row transition-colors">
      
      {/* Side Control Board Navigation rail */}
      <aside className="w-full md:w-64 bg-slate-910 border-r md:border-b-0 border-b border-slate-850 p-5 shrink-0 flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            <h1 className="text-base text-white font-black tracking-wider uppercase">Harkuch Admin</h1>
            <p className="text-[9px] text-orange-550 font-extrabold uppercase mt-0.5 tracking-widest text-orange-500">Control center</p>
          </div>

          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left p-2.5 rounded-lg font-bold flex items-center gap-2 transition ${activeTab === 'dashboard' ? 'bg-orange-500/10 text-orange-400' : 'hover:bg-slate-900 text-slate-400'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> CRM Dashboard
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full text-left p-2.5 rounded-lg font-bold flex items-center gap-2 transition ${activeTab === 'products' ? 'bg-orange-500/10 text-orange-400' : 'hover:bg-slate-900 text-slate-400'}`}
            >
              <Package className="w-4 h-4" /> Inventory ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left p-2.5 rounded-lg font-bold flex items-center justify-between transition ${activeTab === 'orders' ? 'bg-orange-500/10 text-orange-400' : 'hover:bg-slate-900 text-slate-400'}`}
            >
              <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Bookings tracking</span>
              <span className="px-1.5 py-0.5 rounded bg-orange-600/20 text-orange-400 font-extrabold text-[9px]">{orders.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full text-left p-2.5 rounded-lg font-bold flex items-center gap-2 transition ${activeTab === 'coupons' ? 'bg-orange-500/10 text-orange-400' : 'hover:bg-slate-900 text-slate-400'}`}
            >
              <Tag className="w-4 h-4" /> Offer Campaigns
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full text-left p-2.5 rounded-lg font-bold flex items-center gap-2 transition ${activeTab === 'customers' ? 'bg-orange-500/10 text-orange-400' : 'hover:bg-slate-900 text-slate-400'}`}
            >
              <Users className="w-4 h-4" /> Customers Directory
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left p-2.5 rounded-lg font-bold flex items-center gap-2 transition ${activeTab === 'settings' ? 'bg-orange-500/10 text-orange-400' : 'hover:bg-slate-900 text-slate-400'}`}
            >
              <Settings className="w-4 h-4" /> Global Options
            </button>
          </nav>
        </div>

        <button
          onClick={() => setIsAdminAuthenticated(false)}
          className="mt-8 p-2.5 hover:bg-red-500/10 hover:text-red-400 rounded-lg flex items-center gap-2 font-bold transition text-slate-500 text-left border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" /> Shutdown Control
        </button>
      </aside>

      {/* Main Panel Content screen */}
      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-x-hidden">
        
        {/* TAB 1: CORE CRM DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-sm font-bold uppercase text-white border-b border-slate-850 pb-2">CRM Statistics Dashboard</h2>

            {/* Quick numerical counters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-910 rounded-2xl border border-slate-850">
                <p className="text-slate-540 font-bold uppercase tracking-wider text-[9px]">Lifetime booking revenue</p>
                <p className="text-lg sm:text-2xl font-black text-white mt-1">৳{grossSalesVolume.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-slate-910 rounded-2xl border border-slate-850">
                <p className="text-slate-540 font-bold uppercase tracking-wider text-[9px]">Verified sales dispatches</p>
                <p className="text-lg sm:text-2xl font-black text-white mt-1">{validOrdersCount} Orders</p>
              </div>
              <div className="p-4 bg-slate-910 rounded-2xl border border-slate-850 animate-pulse">
                <p className="text-slate-540 font-bold uppercase tracking-wider text-[9px] text-orange-400">🚨 Pending dispatch approvals</p>
                <p className="text-lg sm:text-2xl font-black text-white mt-1">{pendingOrdersCount} Bookings</p>
              </div>
              <div className="p-4 bg-slate-910 rounded-2xl border border-slate-850">
                <p className="text-slate-540 font-bold uppercase tracking-wider text-[9px]">Dispatched courier shipments</p>
                <p className="text-lg sm:text-2xl font-black text-white mt-1">{dispatchActiveCount} Units</p>
              </div>
            </div>

            {/* Real-time CRM Analytics visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Daily Revenue Trend Chart */}
              <div className="p-5 bg-slate-910 rounded-2xl border border-slate-850 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-white text-[11px] uppercase tracking-wider">Revenue Performance (৳)</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Gross value of daily bookings over active campaign days</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-orange-400 font-mono font-bold uppercase py-0.5 px-2 bg-orange-500/10 rounded">৳ Gross</span>
                  </div>
                </div>
                
                <div className="h-64 w-full text-slate-400">
                  {chartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[10px] text-slate-500 font-mono">
                      No matching order activity logs found.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} />
                        <XAxis 
                          dataKey="date" 
                          stroke="#64748b" 
                          fontSize={9} 
                          tickLine={false} 
                          axisLine={false}
                          fontFamily="monospace"
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={9} 
                          tickLine={false} 
                          axisLine={false}
                          fontFamily="monospace"
                          tickFormatter={(val) => `৳${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                          labelStyle={{ fontWeight: 'bold', color: '#fff', fontSize: '10px', fontFamily: 'monospace' }}
                          itemStyle={{ fontSize: '10px', fontFamily: 'monospace' }}
                          formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Total Revenue']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#f97316" 
                          strokeWidth={2} 
                          fillOpacity={1} 
                          fill="url(#revenueGrad)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Order Volume Tracking */}
              <div className="p-5 bg-slate-910 rounded-2xl border border-slate-850 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-white text-[11px] uppercase tracking-wider">Daily Order Volume</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Count of confirmed consumer checkout invoices</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-blue-400 font-mono font-bold uppercase py-0.5 px-2 bg-blue-500/10 rounded">Volume</span>
                  </div>
                </div>

                <div className="h-64 w-full text-slate-400">
                  {chartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[10px] text-slate-500 font-mono">
                      No matching order activity logs found.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} />
                        <XAxis 
                          dataKey="date" 
                          stroke="#64748b" 
                          fontSize={9} 
                          tickLine={false} 
                          axisLine={false}
                          fontFamily="monospace"
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={9} 
                          tickLine={false} 
                          axisLine={false}
                          allowDecimals={false}
                          fontFamily="monospace"
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                          labelStyle={{ fontWeight: 'bold', color: '#fff', fontSize: '10px', fontFamily: 'monospace' }}
                          itemStyle={{ fontSize: '10px', fontFamily: 'monospace' }}
                          formatter={(value: any) => [`${value} Orders`, 'Order Count']}
                        />
                        <Bar 
                          dataKey="volume" 
                          fill="#3b82f6" 
                          radius={[4, 4, 0, 0]} 
                          maxBarSize={30}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS DIRECTORY CRUD */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <h2 className="text-sm font-bold uppercase text-white">Registered Inventories directory</h2>
              <button
                onClick={handleCreateProductClick}
                className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer outline-none"
              >
                <Plus className="w-4 h-4" /> Register New Gear
              </button>
            </div>

            {/* List products inside table */}
            <div className="bg-slate-910 border border-slate-850 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-850 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">Device visual</th>
                      <th className="py-3 px-4">Brand / Model</th>
                      <th className="py-3 px-4">SKU Code</th>
                      <th className="py-3 px-4 text-center">Price Rate</th>
                      <th className="py-3 px-4 text-center">Discount Price</th>
                      <th className="py-3 px-4 text-center">Remaining Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60 font-mono">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-900/60 font-mono">
                        <td className="py-3 px-4">
                          <img src={p.mainImage} alt={p.name} className="w-8 h-8 object-cover rounded border border-slate-800" />
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-extrabold text-white truncate max-w-[200px]">{p.name}</p>
                          <span className="text-[10px] text-slate-500 block">Category: {p.categoryId}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[10px] uppercase">{p.sku}</td>
                        <td className="py-3 px-4 text-center font-bold font-mono">৳{p.price.toLocaleString()}</td>
                        <td className="py-3 px-4 text-center font-bold text-orange-500 font-mono">{p.discountPrice ? `৳${p.discountPrice.toLocaleString()}` : 'No Promo'}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] ${p.stock < 3 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{p.stock} Units</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleEditProductClick(p)}
                              className="p-1.5 bg-slate-900 hover:bg-orange-500 hover:text-white rounded border border-slate-800 transition"
                              title="Edit device details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Delete this product directory record completely?')) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 bg-red-500/5 hover:bg-red-500/20 border border-red-500/10 text-red-400 rounded transition"
                              title="Trash product record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product New/Edit Modal form representation overlayed */}
            {isProductFormOpen && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
                <div className="bg-slate-910 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative space-y-6">
                  
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 className="font-extrabold text-white text-sm uppercase">{currentProductEdit ? 'Adjust Product Directory Profile' : 'Register New Electronic Gear'}</h3>
                    <button
                      onClick={() => setIsProductFormOpen(false)}
                      className="text-slate-400 hover:text-white text-base focus:outline-none"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleProductFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">Interactive Device Name *</label>
                        <input
                          type="text"
                          required
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          placeholder="E.g. Mech Pro Tactile Red"
                          className="w-full text-xs bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">Manufacturer brand *</label>
                        <input
                          type="text"
                          required
                          value={prodBrand}
                          onChange={(e) => setProdBrand(e.target.value)}
                          placeholder="E.g. Razer or Asus"
                          className="w-full text-xs bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">Base Price Rate (৳) *</label>
                        <input
                          type="number"
                          required
                          value={prodPrice}
                          onChange={(e) => setProdPrice(Number(e.target.value))}
                          className="w-full text-xs bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">Discount Markdown Price (Optional)</label>
                        <input
                          type="number"
                          value={prodDiscountPrice || ''}
                          onChange={(e) => setProdDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full text-xs bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">Stock inventories *</label>
                        <input
                          type="number"
                          required
                          value={prodStock}
                          onChange={(e) => setProdStock(Number(e.target.value))}
                          className="w-full text-xs bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">Device Category *</label>
                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                          className="w-full text-xs bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-orange-500 text-white cursor-pointer"
                        >
                          <option value="laptops">Pro computing Laptops</option>
                          <option value="keyboards">Mechanical Keyboards</option>
                          <option value="monitors">Ultra Monitors</option>
                          <option value="audio">Audiophile Acoustics</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">Cover Visual Image URL *</label>
                        <input
                          type="text"
                          required
                          value={prodImage}
                          onChange={(e) => setProdImage(e.target.value)}
                          className="w-full text-xs bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-orange-500 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase">Short specifications excerpt *</label>
                      <input
                        type="text"
                        required
                        value={prodShortDesc}
                        onChange={(e) => setProdShortDesc(e.target.value)}
                        className="w-full text-xs bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase">Full product specifications Details *</label>
                      <textarea
                        required
                        rows={3}
                        value={prodFullDesc}
                        onChange={(e) => setProdFullDesc(e.target.value)}
                        className="w-full text-xs bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none resize-none text-white"
                      ></textarea>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase">Specifications Sheets (One Label: Value entry per line) *</label>
                      <textarea
                        required
                        rows={3}
                        value={prodSpecsText}
                        onChange={(e) => setProdSpecsText(e.target.value)}
                        placeholder="Processor: Elite\nRAM: 16GB\nStorage: Extreme"
                        className="w-full text-[11px] bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none resize-none font-mono text-white"
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-850">
                      <button
                        type="button"
                        onClick={() => setIsProductFormOpen(false)}
                        className="px-4.5 py-2.5 bg-slate-950 hover:bg-slate-900 rounded-xl transition text-slate-400 text-xs font-bold font-mono"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4.5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition text-xs font-bold font-mono"
                      >
                        Compile Profile
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: ORDERS DISPATCH CONTROL */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase text-white border-b border-slate-850 pb-2">Client-side Bookings management</h2>

            <div className="bg-slate-910 border border-slate-850 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-850 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">Booking ID</th>
                      <th className="py-3 px-4">Customer info</th>
                      <th className="py-3 px-4">Shipments Region</th>
                      <th className="py-3 px-4 text-center">Amount Due</th>
                      <th className="py-3 px-4 text-center">Current Status</th>
                      <th className="py-3 px-4 text-right">Dispatch adjustment Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60 font-mono text-[11px] sm:text-xs">
                    {orders.map(ord => (
                      <tr key={ord.id} className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 font-bold text-orange-400 font-mono uppercase">{ord.id}</td>
                        <td className="py-3 px-4 font-mono">
                          <p className="font-extrabold text-white">{ord.customerName}</p>
                          <p className="text-[10px] text-slate-500">📱 {ord.customerPhone} {ord.customerEmail && `| ${ord.customerEmail}`}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-400 whitespace-normal max-w-[150px] font-mono leading-relaxed">
                          <p className="truncate max-w-[140px]" title={ord.shippingAddress}>{ord.shippingAddress}</p>
                          <span className="text-[10px] text-slate-500 block">Thana: {ord.thana}, District: {ord.district}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold font-mono">৳{ord.total.toLocaleString()}</td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] uppercase font-mono border ${
                            ord.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            ord.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            ord.status === 'Shipped' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                            ord.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            'bg-slate-100 dark:bg-slate-900 text-slate-500 border-slate-205 dark:border-slate-800'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <select
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as any, ord.internalNotes)}
                              className="bg-slate-950 border border-slate-800 p-1 rounded font-bold font-mono text-[10px] cursor-pointer"
                            >
                              <option value="Pending">Approval Pending</option>
                              <option value="Processing">Processing Pack</option>
                              <option value="Shipped">Dispatch Courier</option>
                              <option value="Delivered">Delivered Handover</option>
                              <option value="Cancelled">Cancelled Terminate</option>
                            </select>

                            <button
                              onClick={() => {
                                setActiveOrderNoteId(ord.id);
                                setLogNotes(ord.internalNotes || '');
                              }}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded font-bold text-[10px] text-slate-350 cursor-pointer"
                            >
                              Edit Notes
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Logistics live notes edit modal overlay */}
            {activeOrderNoteId && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-slate-910 border border-slate-800 p-5 rounded-2xl max-w-sm w-full space-y-4">
                  <h4 className="font-bold text-white uppercase text-xs">Edit Live courier Logistics logs</h4>
                  <p className="text-[11px] text-slate-500 font-mono">This text is displayed to the buyer tracking their orders from the front-end status tracing screens.</p>
                  
                  <textarea
                    rows={3}
                    value={logNotes}
                    onChange={(e) => setLogNotes(e.target.value)}
                    placeholder="E.g. Package dispatched via Sundarban courier and tracking Airbill is SB-742918"
                    className="w-full bg-slate-950 text-white border border-slate-800 text-xs p-2.5 rounded-xl focus:outline-none resize-none font-mono"
                  ></textarea>

                  <div className="flex justify-end gap-2 text-xs font-mono">
                    <button onClick={() => setActiveOrderNoteId(null)} className="px-3.5 py-2 text-slate-450 hover:text-white font-bold cursor-pointer">Close</button>
                    <button
                      onClick={() => {
                        const targetOrd = orders.find(o => o.id === activeOrderNoteId);
                        if (targetOrd) {
                          updateOrderStatus(activeOrderNoteId, targetOrd.status, logNotes.trim());
                        }
                        setActiveOrderNoteId(null);
                      }}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold cursor-pointer"
                    >
                      Save update
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: COUPON OPERATIONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase text-white border-b border-slate-850 pb-2">Promotional Campaigns CRUD</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              
              {/* Creator form */}
              <div className="md:col-span-1 bg-slate-910 border border-slate-850 p-5 rounded-2xl shadow-xs space-y-4">
                <h3 className="font-bold text-white text-[11px] uppercase tracking-wider">Schedule Promo Coupon</h3>
                
                <form onSubmit={handleCouponSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase">Promo Key Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. SUMMER30"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono rounded-lg focus:outline-none text-white uppercase"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Discount type *</label>
                    <select
                      value={couponType}
                      onChange={(e) => setCouponType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono rounded-lg focus:outline-none text-white"
                    >
                      <option value="percentage">Percentage ( % ) Off</option>
                      <option value="flat">Flat Cash Rate ( ৳ ) Off</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Promo value *</label>
                    <input
                      type="number"
                      required
                      value={couponValue}
                      onChange={(e) => setCouponValue(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono rounded-lg focus:outline-none text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Min Order Total (৳?)</label>
                    <input
                      type="number"
                      required
                      value={couponMinOrder}
                      onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono rounded-lg focus:outline-none text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Usage limits *</label>
                    <input
                      type="number"
                      required
                      value={couponLimit}
                      onChange={(e) => setCouponLimit(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono rounded-lg focus:outline-none text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition text-xs font-mono cursor-pointer"
                  >
                    Deploy Promo Node
                  </button>
                </form>
              </div>

              {/* Campaign lists table */}
              <div className="md:col-span-2 bg-slate-910 border border-slate-850 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left font-mono">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-850 text-slate-505 font-bold uppercase text-[9px]">
                      <th className="py-3 px-4">Coupon keys</th>
                      <th className="py-3 px-4">Discount details</th>
                      <th className="py-3 px-4 text-center">Usage tracking</th>
                      <th className="py-3 px-4 text-right">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60 font-mono text-[11px] sm:text-xs">
                    {coupons.map(cp => (
                      <tr key={cp.id} className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 font-bold text-orange-400 font-mono uppercase">{cp.code}</td>
                        <td className="py-3 px-4 font-mono leading-relaxed">
                          <p className="text-white font-semibold">{cp.type === 'percentage' ? `${cp.value}% Off` : `৳${cp.value} Flat Off`}</p>
                          <span className="text-[10px] text-slate-500">Min Order: ৳{cp.minOrderAmount.toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          <span>{cp.usageCount} / {cp.usageLimit} Max</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              if (confirm('Delete this coupon code?')) {
                                deleteCoupon(cp.id);
                              }
                            }}
                            className="p-1.5 bg-red-500/5 hover:bg-red-500/20 border border-red-500/10 text-red-400 rounded transition"
                            title="Trash Coupon campaign"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMERS DIRECTORY MONITOR */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase text-white border-b border-slate-850 pb-2">Client-side profiles Directory</h2>

            <div className="bg-slate-910 border border-slate-850 rounded-2xl overflow-hidden shadow-xs font-mono">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-850 text-slate-505 font-bold uppercase text-[9px]">
                    <th className="py-3 px-4">Contact name</th>
                    <th className="py-3 px-3">E-mail coords</th>
                    <th className="py-3 px-4">Delivery Addresses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60 font-mono text-[11px] sm:text-xs text-slate-350">
                  {customers.map(cust => (
                    <tr key={cust.id} className="hover:bg-slate-900/40 font-mono">
                      <td className="py-3 px-4 font-bold text-white">{cust.name}</td>
                      <td className="py-3 px-3 lowercase text-orange-400 select-all font-mono">{cust.email}</td>
                      <td className="py-3 px-4 whitespace-normal max-w-[200px] leading-relaxed font-mono">
                        <p>{cust.address || 'Address coordinates not configured.'}</p>
                        <span className="text-[9px] text-slate-500 font-mono block">Thana: {cust.thana || 'N/A'}, Dist: {cust.district || 'N/A'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: GLOBAL OPTION SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase text-white border-b border-slate-850 pb-2">System configs portal</h2>

            <form onSubmit={handleSaveSettings} className="bg-slate-910 border border-slate-850 p-5 sm:p-6 rounded-2xl shadow-xs space-y-4 max-w-xl">
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Homepage marquee announcement bar text *</label>
                <input
                  type="text"
                  required
                  value={sysAnnouncement}
                  onChange={(e) => setSysAnnouncement(e.target.value)}
                  className="w-full bg-slate-950 text-white border border-slate-800 text-xs p-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Hotline numbers parameter *</label>
                  <input
                    type="text"
                    required
                    value={sysPhone}
                    onChange={(e) => setSysPhone(e.target.value)}
                    className="w-full bg-slate-950 text-white border border-slate-800 text-xs p-2.5 rounded-xl focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Official support e-mail address *</label>
                  <input
                    type="email"
                    required
                    value={sysEmail}
                    onChange={(e) => setSysEmail(e.target.value)}
                    className="w-full bg-slate-950 text-white border border-slate-800 text-xs p-2.5 rounded-xl focus:outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold font-mono transition"
              >
                Apply configurations
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}

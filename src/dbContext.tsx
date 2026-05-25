/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, DeliveryZone, Coupon, BlogPost, Review, Order, AdminUser, Customer, HeaderSettings, FooterSettings } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_DELIVERY_ZONES,
  INITIAL_COUPONS,
  INITIAL_BLOGS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_HEADER_SETTINGS,
  INITIAL_FOOTER_SETTINGS
} from './dummyData';

interface DbContextType {
  // States
  products: Product[];
  categories: Category[];
  deliveryZones: DeliveryZone[];
  coupons: Coupon[];
  blogs: BlogPost[];
  reviews: Review[];
  orders: Order[];
  headerSettings: HeaderSettings;
  footerSettings: FooterSettings;
  currentUser: Customer | null;
  currentAdmin: AdminUser | null;
  wishlist: string[];
  recentlyViewed: string[];
  cart: { productId: string; quantity: number }[];
  isDark: boolean;

  // Setters/CRUD actions
  addProduct: (product: Omit<Product, 'id' | 'viewCount' | 'rating'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  incrementProductView: (id: string) => void;

  addCategory: (category: Omit<Category, 'id' | 'slug'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addDeliveryZone: (zone: Omit<DeliveryZone, 'id'>) => void;
  updateDeliveryZone: (id: string, zone: Partial<DeliveryZone>) => void;
  deleteDeliveryZone: (id: string) => void;

  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  addBlog: (blog: Omit<BlogPost, 'id' | 'slug' | 'publishedAt'>) => void;
  updateBlog: (id: string, blog: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;

  addReview: (review: Omit<Review, 'id' | 'date' | 'isApproved'>) => void;
  approveReview: (id: string) => void;
  deleteReview: (id: string) => void;

  createOrder: (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>) => Order;
  updateOrderStatus: (id: string, status: Order['status'], internalNotes?: string) => void;
  deleteOrder: (id: string) => void;

  // Authentication
  loginUser: (email: string, phone: string) => boolean;
  registerUser: (name: string, email: string, phone: string, address: string, district: string, thana: string) => void;
  logoutUser: () => void;
  updateUserProfile: (profile: Partial<Customer>) => void;

  loginAdmin: (email: string, passwordHash: string) => { success: boolean; role?: AdminUser['role']; name?: string; error?: string };
  logoutAdmin: () => void;

  // Settings Override
  updateHeaderSettings: (settings: Partial<HeaderSettings>) => void;
  updateFooterSettings: (settings: Partial<FooterSettings>) => void;

  // Shopper Interaction
  toggleWishlist: (productId: string) => void;
  addRecentlyViewed: (productId: string) => void;
  addToCart: (productId: string, qty: number, replace?: boolean) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Mode Toggler
  toggleDarkMode: () => void;
}

const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize states with Local Storage integration
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ht_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('ht_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => {
    const saved = localStorage.getItem('ht_delivery_zones');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERY_ZONES;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('ht_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('ht_blogs');
    return saved ? JSON.parse(saved) : INITIAL_BLOGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('ht_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ht_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [headerSettings, setHeaderSettings] = useState<HeaderSettings>(() => {
    const saved = localStorage.getItem('ht_header_settings');
    return saved ? JSON.parse(saved) : INITIAL_HEADER_SETTINGS;
  });

  const [footerSettings, setFooterSettings] = useState<FooterSettings>(() => {
    const saved = localStorage.getItem('ht_footer_settings');
    return saved ? JSON.parse(saved) : INITIAL_FOOTER_SETTINGS;
  });

  const [currentUser, setCurrentUser] = useState<Customer | null>(() => {
    const saved = localStorage.getItem('ht_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('ht_current_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('ht_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem('ht_recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>(() => {
    const saved = localStorage.getItem('ht_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('ht_dark_mode');
    return saved ? saved === 'true' : true;
  });

  // Sync state to local storage on change
  useEffect(() => { localStorage.setItem('ht_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('ht_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('ht_delivery_zones', JSON.stringify(deliveryZones)); }, [deliveryZones]);
  useEffect(() => { localStorage.setItem('ht_coupons', JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem('ht_blogs', JSON.stringify(blogs)); }, [blogs]);
  useEffect(() => { localStorage.setItem('ht_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('ht_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('ht_header_settings', JSON.stringify(headerSettings)); }, [headerSettings]);
  useEffect(() => { localStorage.setItem('ht_footer_settings', JSON.stringify(footerSettings)); }, [footerSettings]);
  useEffect(() => { localStorage.setItem('ht_current_user', currentUser ? JSON.stringify(currentUser) : ''); }, [currentUser]);
  useEffect(() => { localStorage.setItem('ht_current_admin', currentAdmin ? JSON.stringify(currentAdmin) : ''); }, [currentAdmin]);
  useEffect(() => { localStorage.setItem('ht_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('ht_recently_viewed', JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  useEffect(() => { localStorage.setItem('ht_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    localStorage.setItem('ht_dark_mode', isDark.toString());
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // CRUD Implementations
  const addProduct = (p: Omit<Product, 'id' | 'viewCount' | 'rating'>) => {
    const newId = 'prod-' + Math.random().toString(36).substring(2, 9);
    const newProduct: Product = {
      ...p,
      id: newId,
      viewCount: 0,
      rating: 5.0
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const duplicateProduct = (id: string) => {
    const origin = products.find(p => p.id === id);
    if (origin) {
      const duplicated: Product = {
        ...origin,
        id: 'prod-' + Math.random().toString(36).substring(2, 9),
        name: `${origin.name} (Copy)`,
        sku: `${origin.sku}-COPY-${Math.floor(Math.random() * 1000)}`,
        viewCount: 0,
        rating: 5.0
      };
      setProducts(prev => [duplicated, ...prev]);
    }
  };

  const incrementProductView = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, viewCount: p.viewCount + 1 } : p));
  };

  const addCategory = (c: Omit<Category, 'id' | 'slug'>) => {
    const genSlug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat: Category = {
      ...c,
      id: 'cat-' + Math.random().toString(36).substring(2, 9),
      slug: genSlug
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addDeliveryZone = (z: Omit<DeliveryZone, 'id'>) => {
    const newZone: DeliveryZone = { ...z, id: 'zone-' + Math.random().toString(36).substring(2, 9) };
    setDeliveryZones(prev => [...prev, newZone]);
  };

  const updateDeliveryZone = (id: string, updated: Partial<DeliveryZone>) => {
    setDeliveryZones(prev => prev.map(z => z.id === id ? { ...z, ...updated } : z));
  };

  const deleteDeliveryZone = (id: string) => {
    setDeliveryZones(prev => prev.filter(z => z.id !== id));
  };

  const addCoupon = (cp: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCp: Coupon = { ...cp, id: 'cp-' + Math.random().toString(36).substring(2, 9), usageCount: 0 };
    setCoupons(prev => [...prev, newCp]);
  };

  const updateCoupon = (id: string, updated: Partial<Coupon>) => {
    setCoupons(prev => prev.map(cp => cp.id === id ? { ...cp, ...updated } : cp));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(cp => cp.id !== id));
  };

  const addBlog = (b: Omit<BlogPost, 'id' | 'slug' | 'publishedAt'>) => {
    const genSlug = b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newBlog: BlogPost = {
      ...b,
      id: 'blog-' + Math.random().toString(36).substring(2, 9),
      slug: genSlug,
      publishedAt: new Date().toISOString().split('T')[0]
    };
    setBlogs(prev => [newBlog, ...prev]);
  };

  const updateBlog = (id: string, updated: Partial<BlogPost>) => {
    setBlogs(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
  };

  const deleteBlog = (id: string) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
  };

  const addReview = (r: Omit<Review, 'id' | 'date' | 'isApproved'>) => {
    const newRev: Review = {
      ...r,
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split('T')[0],
      isApproved: false // Auto goes to admin moderation first
    };
    setReviews(prev => [newRev, ...prev]);
  };

  const approveReview = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: true } : r));
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>) => {
    const orderNum = 'HT-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      ...orderData,
      id: orderNum,
      orderDate: new Date().toISOString(),
      status: 'Pending'
    };

    setOrders(prev => [newOrder, ...prev]);

    // Handle coupon count update if there is one applied
    if (orderData.couponCode) {
      setCoupons(prev => prev.map(cp => cp.code.toUpperCase() === orderData.couponCode?.toUpperCase() ? { ...cp, usageCount: cp.usageCount + 1 } : cp));
    }

    // Deduct stock levels of purchased products
    orderData.items.forEach(itm => {
      setProducts(prev => prev.map(p => {
        if (p.id === itm.productId) {
          const newStock = Math.max(0, p.stock - itm.quantity);
          const badgeValue = newStock === 0 ? 'Auto Stock Out' : p.badge;
          return { ...p, stock: newStock, badge: badgeValue };
        }
        return p;
      }));
    });

    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order['status'], internalNotes?: string) => {
    setOrders(prev => prev.map(o => o.id === id ? {
      ...o,
      status,
      internalNotes: internalNotes !== undefined ? internalNotes : o.internalNotes
    } : o));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // User Accounts
  const loginUser = (email: string, phone: string) => {
    // Check if customer exists in simulated orders or registered database
    // For local simulation, we can log in anyone and instantiate their profile automatically
    // Email lookup
    const cleanMail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    if (!cleanMail || !cleanPhone) return false;

    // Retrieve previous profile details or auto-generate
    const guest: Customer = {
      id: 'cust-' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0].toUpperCase(),
      email: cleanMail,
      phone: cleanPhone,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(guest);
    return true;
  };

  const registerUser = (name: string, email: string, phone: string, address: string, district: string, thana: string) => {
    const fresh: Customer = {
      id: 'cust-' + Math.random().toString(36).substring(2, 9),
      name,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address,
      district,
      thana,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(fresh);
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (profile: Partial<Customer>) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, ...profile } : null);
    }
  };

  // Admin users accounts
  const loginAdmin = (email: string, passwordHash: string) => {
    const mail = email.trim().toLowerCase();
    // Pre-registered admin credentials
    if ((mail === 'admin@harkuch.tech' || mail === 'manager@harkuch.tech' || mail === 'editor@harkuch.tech') && passwordHash === 'admin123') {
      let role: AdminUser['role'] = 'Super Admin';
      let name = 'Super Admin';
      if (mail.startsWith('manager')) {
        role = 'Manager';
        name = 'Abrar Manager';
      } else if (mail.startsWith('editor')) {
        role = 'Editor';
        name = 'Ismail Editor';
      }
      const adminSession: AdminUser = {
        id: 'admin-' + role.toLowerCase(),
        email: mail,
        role,
        name
      };
      setCurrentAdmin(adminSession);
      return { success: true, role, name };
    }
    return { success: false, error: 'Incorrect email or password combination. Try admin@harkuch.tech / admin123' };
  };

  const logoutAdmin = () => {
    setCurrentAdmin(null);
  };

  const updateHeaderSettings = (updated: Partial<HeaderSettings>) => {
    setHeaderSettings(prev => ({ ...prev, ...updated }));
  };

  const updateFooterSettings = (updated: Partial<FooterSettings>) => {
    setFooterSettings(prev => ({ ...prev, ...updated }));
  };

  // Wishlist and Cart operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 10); // store last 10
    });
  };

  const addToCart = (productId: string, qty: number, replace = false) => {
    const itemTarget = products.find(p => p.id === productId);
    if (!itemTarget) return;

    setCart(prev => {
      const exist = prev.find(item => item.productId === productId);
      if (exist) {
        let finalQty = replace ? qty : exist.quantity + qty;
        // stock safety guard
        if (finalQty > itemTarget.stock) {
          finalQty = itemTarget.stock;
        }
        if (finalQty <= 0) {
          return prev.filter(item => item.productId !== productId);
        }
        return prev.map(item => item.productId === productId ? { ...item, quantity: finalQty } : item);
      } else {
        const finalQty = qty > itemTarget.stock ? itemTarget.stock : qty;
        if (finalQty <= 0) return prev;
        return [...prev, { productId, quantity: finalQty }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  return (
    <DbContext.Provider value={{
      products,
      categories,
      deliveryZones,
      coupons,
      blogs,
      reviews,
      orders,
      headerSettings,
      footerSettings,
      currentUser,
      currentAdmin,
      wishlist,
      recentlyViewed,
      cart,
      isDark,

      addProduct,
      updateProduct,
      deleteProduct,
      duplicateProduct,
      incrementProductView,

      addCategory,
      updateCategory,
      deleteCategory,

      addDeliveryZone,
      updateDeliveryZone,
      deleteDeliveryZone,

      addCoupon,
      updateCoupon,
      deleteCoupon,

      addBlog,
      updateBlog,
      deleteBlog,

      addReview,
      approveReview,
      deleteReview,

      createOrder,
      updateOrderStatus,
      deleteOrder,

      loginUser,
      registerUser,
      logoutUser,
      updateUserProfile,

      loginAdmin,
      logoutAdmin,

      updateHeaderSettings,
      updateFooterSettings,

      toggleWishlist,
      addRecentlyViewed,
      addToCart,
      removeFromCart,
      clearCart,

      toggleDarkMode
    }}>
      {children}
    </DbContext.Provider>
  );
};

export const useDb = () => {
  const context = useContext(DbContext);
  if (!context) throw new Error('useDb must be used with a DbProvider');
  return context;
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string; // supports rich-text specifications
  shortDescription: string;
  price: number;
  discountPrice?: number;
  sku: string;
  stock: number;
  mainImage: string;
  images: string[]; // gallery paths/urls
  categoryId: string;
  brand: string;
  rating: number;
  isFeatured: boolean;
  isTrending: boolean;
  badge?: 'New' | 'Hot' | 'Sale' | 'Auto Stock Out';
  viewCount: number;
  specs: { label: string; value: string }[];
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  district?: string;
  thana?: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  sku: string;
}

export interface Order {
  id: string;
  customerId?: string; // empty for guest checkout
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  district: string;
  thana: string;
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'Cash on Delivery';
  notes?: string;
  orderDate: string;
  items: OrderItem[];
  internalNotes?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  minOrderAmount?: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  charge: number;
  estimatedDays: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'Super Admin' | 'Manager' | 'Editor';
  name: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string; // rich-text content
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  isPublished: boolean;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface RecentlyViewedProduct {
  productId: string;
  viewedAt: string;
}

export interface HeaderSettings {
  logoUrl: string;
  logoHeight: number;
  logoWidth: number;
  announcementText: string;
  showAnnouncement: boolean;
  announcementBgColor: string;
  announcementTextColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface FooterSettings {
  facebookUrl: string;
  instagramUrl: string;
  whatsappUrl: string;
  messengerUrl: string;
  phone: string;
  email: string;
  copyrightText: string;
  aboutText: string;
}

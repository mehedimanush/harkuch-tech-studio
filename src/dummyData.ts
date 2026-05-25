/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, DeliveryZone, Coupon, BlogPost, Review, Order, HeaderSettings, FooterSettings } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-laptops',
    name: 'Laptops & Computers',
    slug: 'laptops-computers',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=500',
    description: 'High-performance work laptops, ultra-portables, and high-FPS gaming rigs.'
  },
  {
    id: 'cat-smartphones',
    name: 'Smartphones & Tablets',
    slug: 'smartphones-tablets',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=500',
    description: 'Latest iOS and Android flagship devices and premium mid-rangers.'
  },
  {
    id: 'cat-watches',
    name: 'Smart Watches & Wearables',
    slug: 'smart-watches-wearables',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=500',
    description: 'Track your fitness, notifications, and vital signs in premium style.'
  },
  {
    id: 'cat-audio',
    name: 'Headphones & Audio',
    slug: 'headphones-audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500',
    description: 'Studio-quality wireless over-ears, noise-cancelling buds, and desk speakers.'
  },
  {
    id: 'cat-accessories',
    name: 'Gaming Accessories & Keyboards',
    slug: 'gaming-accessories-keyboards',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=500',
    description: 'Tactile mechanical keyboards, precise optical sensors, and ergonomic wrist rests.'
  },
  {
    id: 'cat-monitors',
    name: 'Monitors & Displays',
    slug: 'monitors-displays',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=500',
    description: 'High-refresh IPS panels, color-accurate design screens, and ultra-wide curves.'
  },
  {
    id: 'cat-cameras',
    name: 'Cameras & Videography',
    slug: 'cameras-videography',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=500',
    description: 'Full-frame mirrorless marvels, pristine studio lenses, and action content rigs.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-rog-g16',
    slug: 'asus-rog-strix-g16-2026',
    name: 'Asus ROG Strix G16 (2026)',
    brand: 'ASUS',
    price: 185000,
    discountPrice: 174000,
    sku: 'LAP-AS-ROG16-01',
    stock: 7,
    mainImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800'
    ],
    categoryId: 'cat-laptops',
    rating: 4.8,
    isFeatured: true,
    isTrending: true,
    badge: 'Hot',
    viewCount: 1420,
    shortDescription: 'Unleash elite gaming performance with the Asus ROG Strix G16. Armed with the latest Intel Core i9-14900HX CPU and an NVIDIA RTX 4070 GPU.',
    description: 'Crafted for esports champions and casual enthusiasts alike, the ROG Strix G16 delivers uncompromising power. Built with a stunning 16-inch 240Hz ROG Nebula Display matching 100% DCI-P3 colors, and dynamic Tri-Fan cooling tech keeping thermals optimal during intensive gaming marathons in local climates. Encased in a stealth graphite armor chassis accented by immersive Aura Sync RGB underglow wrapping the front.',
    specs: [
      { label: 'Processor', value: 'Intel Core i9-14900HX (Up to 5.8 GHz)' },
      { label: 'Graphics', value: 'NVIDIA GeForce RTX 4070 8GB GDDR6' },
      { label: 'Memory', value: '16GB DDR5 5600MHz Dual Channel' },
      { label: 'Storage', value: '1TB PCIe 4.0 NVMe M.2 SSD' },
      { label: 'Display', value: '16" QHD+ IPS 240Hz, 3ms, 100% DCI-P3' },
      { label: 'OS', value: 'Windows 11 Home Licensed' }
    ],
    tags: ['asus', 'rog', 'gaming', 'laptop', 'rtx 4070']
  },
  {
    id: 'prod-macbook-m3',
    slug: 'apple-macbook-pro-m3-pro',
    name: 'Apple MacBook Pro 14" M3 Pro',
    brand: 'Apple',
    price: 245000,
    discountPrice: 235000,
    sku: 'LAP-AP-MBP14-02',
    stock: 5,
    mainImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800'
    ],
    categoryId: 'cat-laptops',
    rating: 4.9,
    isFeatured: true,
    isTrending: false,
    badge: 'New',
    viewCount: 940,
    shortDescription: 'The pinnacle of portable power for programmers, designers, and multimedia creators. Space Black Edition.',
    description: 'The standard of premium workstations, the 14-inch MacBook Pro features the Apple M3 Pro chip with an 11-core CPU and 14-core GPU. Experience breathtaking speed with a gorgeous Liquid Retina XDR screen offering 1,600 nits peak brightness, up to 18 hours of real battery life, and complete support for high-fidelity developers.',
    specs: [
      { label: 'Chipset', value: 'Apple M3 Pro Chip with 11 CPU / 14 GPU Cores' },
      { label: 'Memory', value: '18GB Unified Memory' },
      { label: 'Storage', value: '512GB Ultra-Fast SSD' },
      { label: 'Screen Size', value: '14.2" Liquid Retina XDR display' },
      { label: 'Battery Life', value: 'Up to 18 Hours video playback' },
      { label: 'Color', value: 'Space Black' }
    ],
    tags: ['apple', 'macbook', 'm3', 'creator', 'premium']
  },
  {
    id: 'prod-iphone15',
    slug: 'apple-iphone-15-pro-max',
    name: 'Apple iPhone 15 Pro Max',
    brand: 'Apple',
    price: 152000,
    discountPrice: 142500,
    sku: 'PHN-AP-IP15PM-01',
    stock: 9,
    mainImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1695048133156-f084ba7bf611?auto=format&fit=crop&q=80&w=800'
    ],
    categoryId: 'cat-smartphones',
    rating: 4.7,
    isFeatured: true,
    isTrending: true,
    badge: 'Sale',
    viewCount: 2210,
    shortDescription: 'Forged in Aerospace titanium. Featuring the groundbreaking A17 Pro chip, a customizable Action Button, and the most powerful iPhone camera system.',
    description: 'Super-efficient 3nm architecture makes mobile gaming look spectacular. Featuring a customizable optical 5x telephoto zoom lens inside an beautiful satin-brushed raw titanium framework. TrueTone Dynamic Island, Always-on Super Retina XDR layout, and custom structural improvements for heat dispersion.',
    specs: [
      { label: 'Processor', value: 'A17 Pro chip with 6-core GPU' },
      { label: 'Camera', value: '48MP Main | 12MP Ultra Wide | 12MP 5x Telephoto' },
      { label: 'Display', value: '6.7-inch Super Retina XDR OLED 120Hz' },
      { label: 'Storage', value: '256GB NVMe Storage' },
      { label: 'Chassis', value: 'Aerospace-grade Titanium rails' },
      { label: 'Port', value: 'USB-C supporting USB 3 high-speed' }
    ],
    tags: ['apple', 'iphone', 'titanium', 'ios', 'smartphone']
  },
  {
    id: 'prod-s24-ultra',
    slug: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 145000,
    discountPrice: 135000,
    sku: 'PHN-SS-S24U-02',
    stock: 12,
    mainImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800'
    ],
    categoryId: 'cat-smartphones',
    rating: 4.8,
    isFeatured: false,
    isTrending: true,
    viewCount: 1680,
    shortDescription: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity and productivity.',
    description: 'Equipped with a built-in S Pen, Snapdragon 8 Gen 3 chipset tailored specifically for Galaxy, a titanium exterior frame, and brilliant generative photo editing features built directly into Galaxy AI. Ideal for Bangladeshi professionals and remote content creators.',
    specs: [
      { label: 'Processor', value: 'Snapdragon 8 Gen 3 for Galaxy' },
      { label: 'RAM', value: '12GB LPDDR5X' },
      { label: 'Storage', value: '256GB UFS 4.0' },
      { label: 'Camera', value: '200MP Quad-lens with 50MP 5x optical tele' },
      { label: 'Battery', value: '5000mAh with 45W Fast Charge' },
      { label: 'AI Features', value: 'Circle to Search, Live Translate, Notes Assist' }
    ],
    tags: ['samsung', 'galaxy', 'android', 'stylus', 'ai']
  },
  {
    id: 'prod-iwatch-9',
    slug: 'apple-watch-series-9-gps',
    name: 'Apple Watch Series 9 GPS',
    brand: 'Apple',
    price: 49500,
    discountPrice: 45900,
    sku: 'WTC-AP-S9-01',
    stock: 15,
    mainImage: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=800'
    ],
    categoryId: 'cat-watches',
    rating: 4.6,
    isFeatured: true,
    isTrending: true,
    viewCount: 810,
    shortDescription: 'Smarter. Brighter. Mightier. The flagship wearable with the S9 SiP chip and Double Tap gesture.',
    description: 'An advanced health device monitoring Blood Oxygen, ECG, Sleep tracker, and crash detection. Crafted with a premium sports band and bright retina display tracking metrics in pure sunlight.',
    specs: [
      { label: 'Chipset', value: 'Apple S9 SiP' },
      { label: 'Display Max Brightness', value: '2000 nits Retina Display' },
      { label: 'Gestures', value: 'Double Tap finger gesture' },
      { label: 'Water Protection', value: 'WR50 Swimproof (50m)' }
    ],
    tags: ['apple', 'watch', 'series 9', 'wearable', 'fitness']
  },
  {
    id: 'prod-apex-7',
    slug: 'steelseries-apex-7-tkl',
    name: 'SteelSeries Apex 7 TKL Mechanical Keyboard',
    brand: 'SteelSeries',
    price: 18500,
    discountPrice: 16200,
    sku: 'ACC-SS-APX7-01',
    stock: 4,
    mainImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=800'
    ],
    categoryId: 'cat-accessories',
    rating: 4.8,
    isFeatured: true,
    isTrending: true,
    badge: 'Sale',
    viewCount: 430,
    shortDescription: 'Tenkeyless layout keyboard with OLED Smart Display and durable red linear mechanical switches.',
    description: 'Forged with aircraft-grade aluminum casing and an integrated smart screen displaying games, macros, and Discord states. Highly durable mechanical red switches with click feedback rated for 50 million keypresses.',
    specs: [
      { label: 'Switch Type', value: 'SteelSeries Red Linear Mechanical Switches' },
      { label: 'Layout', value: 'TKL (Tenkeyless) compact form-factor' },
      { label: 'Chassis Material', value: 'Aircraft-grade Aluminum Alloy Frame' },
      { label: 'Backlight', value: 'Per-key dynamic RGB illumination' }
    ],
    tags: ['keyboard', 'rgb', 'mechanical', 'gaming', 'steelseries']
  },
  {
    id: 'prod-sony-wh1000xm5',
    slug: 'sony-wh-1000xm5-wireless',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    price: 43000,
    discountPrice: 38500,
    sku: 'AUD-SO-WHXM5-01',
    stock: 0, // Auto stock out
    mainImage: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
    ],
    categoryId: 'cat-audio',
    rating: 4.9,
    isFeatured: false,
    isTrending: true,
    badge: 'Auto Stock Out',
    viewCount: 1540,
    shortDescription: 'Industry-leading noise cancelling wireless headphones with dual processors, 8 microphones, and breathtaking audio.',
    description: 'Setting a new benchmark in audio precision, the WH-1000XM5 uses Sony V1 system processor paired with dynamic auto-NC optimizes, premium beamforming microphones, and LDAC audio transmission high-res.',
    specs: [
      { label: 'ANC Tech', value: 'Industry Leading active noise cancellation' },
      { label: 'Battery Life', value: 'Up to 30 Hours with ANC on' },
      { label: 'Driver Size', value: '30mm high-compliance dome' },
      { label: 'Bluetooth Codecs', value: 'SBC, AAC, LDAC high-fidelity' }
    ],
    tags: ['sony', 'anc', 'headphones', 'audio', 'wireless']
  },
  {
    id: 'prod-sony-a7iv',
    slug: 'sony-alpha-a7-iv-mirrorless',
    name: 'Sony Alpha a7 IV Mirrorless Camera (Body Only)',
    brand: 'Sony',
    price: 245000,
    discountPrice: 232000,
    sku: 'CAM-SO-A7M4-01',
    stock: 3,
    mainImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'
    ],
    categoryId: 'cat-cameras',
    rating: 4.9,
    isFeatured: true,
    isTrending: false,
    badge: 'Hot',
    viewCount: 650,
    shortDescription: 'A versatile hybrid masterpiece. 33MP Exmor R CMOS sensor, 4K 60p recording, and unmatched Autofocus tracking.',
    description: 'Designed as the modern premium camera standard, the a7 IV features real-time Eye Autofocus, dual fast card slots, active image stabilization, and stunning dynamic spectrum for low light shooting in Dhaka landscapes.',
    specs: [
      { label: 'Sensor Type', value: '33 MP Full-Frame Exmor R Back-Illuminated CMOS' },
      { label: 'Processor', value: 'BIONZ XR high speed machine' },
      { label: 'Video Quality', value: '4K 60p 10-bit 4:2:2 recording capability' },
      { label: 'AF Points', value: '759 Phase-detection auto-focus coordinates' }
    ],
    tags: ['camera', 'sony', 'full frame', 'video', 'creator']
  }
];

export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'zone-dhaka-in', name: 'Inside Dhaka City', charge: 80, estimatedDays: '1-2 Days' },
  { id: 'zone-dhaka-out', name: 'Dhaka Suburbs (Gazipur, Savar)', charge: 120, estimatedDays: '2-3 Days' },
  { id: 'zone-bd-out', name: 'Outside Dhaka (Chittagong, Sylhet, Khulna)', charge: 150, estimatedDays: '3-5 Days' }
];

export const INITIAL_COUPONS: Coupon[] = [
  { id: 'cp-harkuch20', code: 'HARKUCH20', type: 'percentage', value: 20, expiryDate: '2027-12-31', usageLimit: 500, usageCount: 22, minOrderAmount: 2000 },
  { id: 'cp-flat500', code: 'SAVE500', type: 'fixed', value: 500, expiryDate: '2027-06-30', usageLimit: 200, usageCount: 14, minOrderAmount: 10000 },
  { id: 'cp-newyear', code: 'NEWGEAR', type: 'percentage', value: 10, expiryDate: '2026-12-31', usageLimit: 1000, usageCount: 112, minOrderAmount: 500 }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'prod-rog-g16',
    customerName: 'Samiur Rahman',
    rating: 5,
    comment: 'Absolutely spectacular gaming beast! Thermals are very well handled even on 35C Dhaka summer weather. Harkuch delivered and unpacked it in 1 day flat with pristine security packaging. Highly recommended tech shop!',
    date: '2026-04-12',
    isApproved: true
  },
  {
    id: 'rev-02',
    productId: 'prod-rog-g16',
    customerName: 'Anika Bushra',
    rating: 4,
    comment: 'Performance is incredible. Screen is gorgeous. Quite heavy, but the i9 HX and RTX 4070 is totally worth it for video editing rendering. Friendly staff over hotline.',
    date: '2026-05-02',
    isApproved: true
  },
  {
    id: 'rev-03',
    productId: 'prod-iphone15',
    customerName: 'Mehrab Hossain',
    rating: 5,
    comment: 'Brought the Raw Titanium edition. Best pricing inside Dhaka. Authentic product, checked Apple IMEI coverage. Excellent customer satisfaction!',
    date: '2026-05-18',
    isApproved: true
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-01',
    slug: 'why-mechanical-keyboards-matter-2026',
    title: 'Why Mechanical Keyboards are Essential for Coding and Typing Speed',
    excerpt: 'Deep dive into the tactical switches, layouts, lifespan durability, and ergonomic benefits of moving to a solid mechanical setup.',
    content: '<p>If you spend more than 4 hours a day typing, the tool you use matters. Membrane keyboards are quiet but mushy. A premium mechanical keyboard like the <strong>Apex 7 TKL</strong> changes typing from a chore into a highly rewarding tactile ritual.</p><h2>The Switch Categories</h2><ul><li><strong>Linear (Red):</strong> Smooth movement without tactile bumps. Great for fast gaming response.</li><li><strong>Tactile (Brown):</strong> Subtle feedback bump. Celebrated by software programmers.</li><li><strong>Clicky (Blue):</strong> Loud satisfying tick. Incredible acoustics, although less friendly in dense workspaces.</li></ul><p>We recommend starting with tactile or red linear switches depending on your room space. Check out Harkuch Tech accessories for authorized genuine boards with native service warranties!</p>',
    featuredImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800',
    category: 'Guides',
    tags: ['keyboards', 'desk setup', 'productivity'],
    author: 'Ismail Harkuch',
    publishedAt: '2026-03-15',
    isPublished: true
  },
  {
    id: 'blog-02',
    slug: 'rtx-40-series-gaming-tips',
    title: 'Optimizing RTX 4070 Laptop Performance for Bangladeshi Climates',
    excerpt: 'How to manage high-temp esports performance through custom under-volting, thermal profiles, and fan controls.',
    content: '<p>Esports titles like Valorant, Apex Legends, and PUBG run seamlessly at 200+ FPS on laptops like the ROG Strix G16. However, high external temperatures require proactive performance configurations.</p><h2>Key Tips</h2><ol><li><strong>Use Manual Mode:</strong> Lift your back chassis by 1-inch matching cold spacing airflow.</li><li><strong>Configure FPS Limiters:</strong> Limit game refresh to 240Hz matching stock screen Nebula layouts to prevent thermal saturation.</li><li><strong>Undervolt Safely:</strong> Clean your fans once every 6 months to remove micro-dust particles characteristic of local Dhaka air.</li></ol>',
    featuredImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    category: 'Gaming Tech',
    tags: ['asus', 'gaming laptops', 'overclocking', 'maintenance'],
    author: 'Abrar Tanveer',
    publishedAt: '2026-05-10',
    isPublished: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'HT-74391',
    customerName: 'Tanvir Hossain Shimul',
    customerPhone: '01712345678',
    customerEmail: 'shimul@gmail.com',
    shippingAddress: 'House 42, Road 11, Sector 4, Uttara',
    district: 'Dhaka',
    thana: 'Uttara',
    subtotal: 174000,
    deliveryCharge: 80,
    discountAmount: 0,
    total: 174080,
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    notes: 'Please pack securely and call beforehand.',
    orderDate: '2026-05-10T12:30:00Z',
    items: [
      {
        productId: 'prod-rog-g16',
        productName: 'Asus ROG Strix G16 (2026)',
        productImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=200',
        price: 174000,
        quantity: 1,
        sku: 'LAP-AS-ROG16-01'
      }
    ],
    internalNotes: 'Customer verified via phone call. Delivered securely in time.'
  },
  {
    id: 'HT-74392',
    customerName: 'Afra Anjum',
    customerPhone: '01887654321',
    customerEmail: 'afra.anjum@gmail.com',
    shippingAddress: 'Flat 4B, Shonalu Tower, Nasirabad Housing',
    district: 'Chittagong',
    thana: 'Nasirabad',
    subtotal: 45900,
    deliveryCharge: 150,
    discountAmount: 4590,
    couponCode: 'NEWGEAR',
    total: 41460,
    status: 'Processing',
    paymentMethod: 'Cash on Delivery',
    notes: 'Deliver on a weekday afternoon if possible.',
    orderDate: '2026-05-19T08:15:00Z',
    items: [
      {
        productId: 'prod-iwatch-9',
        productName: 'Apple Watch Series 9 GPS',
        productImage: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=200',
        price: 45900,
        quantity: 1,
        sku: 'WTC-AP-S9-01'
      }
    ],
    internalNotes: 'Dispatched from primary warehouse. Waiting for SA Par परिवहन dispatch number.'
  },
  {
    id: 'HT-74393',
    customerName: 'Nazmus Sakib',
    customerPhone: '01999888777',
    customerEmail: 'sakib_tech@yahoo.com',
    shippingAddress: 'Master Para, Sadar',
    district: 'Sylhet',
    thana: 'Sadar',
    subtotal: 16200,
    deliveryCharge: 150,
    discountAmount: 0,
    total: 16350,
    status: 'Pending',
    paymentMethod: 'Cash on Delivery',
    notes: 'I need it before Friday.',
    orderDate: '2026-05-20T19:40:00Z',
    items: [
      {
        productId: 'prod-apex-7',
        productName: 'SteelSeries Apex 7 TKL Mechanical Keyboard',
        productImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=200',
        price: 16200,
        quantity: 1,
        sku: 'ACC-SS-APX7-01'
      }
    ]
  }
];

export const INITIAL_HEADER_SETTINGS: HeaderSettings = {
  logoUrl: 'Harkuch Tech', // We can use elegant text logo to stay clean and highly customizable, or generic SVG
  logoHeight: 60,
  logoWidth: 200,
  announcementText: '⚡ Flash Offer: Extra 20% discount on Laptops using Coupon "HARKUCH20" | Super-fast Cash on Delivery BD ⚡',
  showAnnouncement: true,
  announcementBgColor: 'bg-orange-600',
  announcementTextColor: 'text-white',
  primaryColor: '#0F172A',
  secondaryColor: '#1E293B',
  accentColor: '#F97316'
};

export const INITIAL_FOOTER_SETTINGS: FooterSettings = {
  facebookUrl: 'https://facebook.com/harkuch.tech',
  instagramUrl: 'https://instagram.com/harkuch.tech',
  whatsappUrl: 'https://wa.me/8801700000000',
  messengerUrl: 'https://m.me/harkuch.tech',
  phone: '+880 1712-345678',
  email: 'support@harkuch.tech',
  copyrightText: '© 2026 Harkuch Tech. All rights reserved. Built with exceptional premium service.',
  aboutText: 'Harkuch Tech is Bangladesh’s ultimate premium destination for original high-performance computers, flagship devices, tactile keyboards, and audiophile gears since 2024.'
};

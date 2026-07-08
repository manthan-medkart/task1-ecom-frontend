import { API_BASE_URL, ENDPOINTS } from './endpoints';

// Set this to false when you are ready to connect to your Spring Boot backend!
export const USE_MOCK_API = true;

// Artificial loading delay for mock API requests (in milliseconds)
const MOCK_DELAY = 600;

// ==========================================
// MOCK DATA STORAGE (In-memory for session)
// ==========================================
const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'MediGuard Advanced Stethoscope',
    description: 'A professional-grade acoustic stethoscope with double-sided chestpiece, tuned diaphragm, and ergonomic acoustic tubing for unmatched clinical diagnostics.',
    price: 189.99,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    category: 'Diagnostic Tools',
    stockQuantity: 45,
    rating: 4.8,
    reviewsCount: 124,
    features: [
      'High acoustic sensitivity for performing general physical assessment',
      'Dual-single chestpiece with tuneable diaphragms on both adult and pediatric sides',
      'Next-generation longer-life tubing resistant to skin oils and alcohol',
      'Comfortable soft-seal eartips provide an excellent acoustic seal'
    ],
    specifications: {
      'Chestpiece Weight': '95 grams',
      'Diaphragm Diameter': '4.3 cm / 1.7 in',
      'Diaphragm Material': 'Epoxy/Fiberglass',
      'Overall Length': '69 cm / 27.2 in',
      'Warranty': '5 Years'
    },
    reviews: [
      { id: 1, user: 'Dr. Sarah Mitchell', rating: 5, comment: 'Absolutely clear acoustic clarity. The soft eartips are fantastic for long shifts.', date: '2026-06-15' },
      { id: 2, user: 'Nurse James Carter', rating: 4, comment: 'Very durable. Feels premium and doesn\'t stain easily with alcohol rubs.', date: '2026-06-28' }
    ]
  },
  {
    id: 'prod-2',
    name: 'AeroPulse Smart Pulse Oximeter',
    description: 'Precision digital pulse oximeter featuring OLED multi-directional display, blood oxygen saturation (SpO2) tracker, and pulse rate bar graph.',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80',
    category: 'Monitoring Devices',
    stockQuantity: 120,
    rating: 4.6,
    reviewsCount: 89,
    features: [
      'Accurate measurement of SpO2 (Oxygen Saturation level) and PR (Pulse Rate)',
      'Dual-color bright OLED display with adjustable brightness settings',
      'Automatic power-off after 8 seconds of inactivity to save battery',
      'Includes lanyard and 2 AAA batteries for immediate operation'
    ],
    specifications: {
      'SpO2 Range': '70% - 100% (±2% accuracy)',
      'Pulse Rate Range': '30 - 250 bpm (±2 bpm)',
      'Display Mode': 'OLED with 4 directions',
      'Power Source': '2x AAA Alkaline Batteries',
      'Weight': '54g (including batteries)'
    },
    reviews: [
      { id: 1, user: 'Emily Watson', rating: 5, comment: 'Bought this for monitoring my asthmatic child. Very fast and accurate readings.', date: '2026-07-02' }
    ]
  },
  {
    id: 'prod-3',
    name: 'OmniKare Digital Blood Pressure Monitor',
    description: 'Automatic upper-arm blood pressure monitor equipped with irregular heartbeat indicator, double-user tracking memory (2x90 readings), and wide-range cuff.',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1518152006812-edab29b069ca?auto=format&fit=crop&w=600&q=80',
    category: 'Monitoring Devices',
    stockQuantity: 8, // Low stock to demonstrate warning
    rating: 4.7,
    reviewsCount: 215,
    features: [
      'One-touch operation for fast, easy, and clinically accurate readings',
      'Dual-user mode lets two users store and track up to 90 measurements each',
      'Cuff wrap guide alerts you if the cuff is too loose or wrapped incorrectly',
      'Large backlit LCD display with color-coded blood pressure level status bar'
    ],
    specifications: {
      'Cuff Size': '22 cm to 42 cm (8.7" - 16.5")',
      'Accuracy': 'Pressure: ±3 mmHg / Pulse: ±5% of reading',
      'Memory capacity': '180 readings total (90 per user)',
      'Dimensions': '130 x 110 x 80 mm',
      'Power Supply': '4x AA batteries or USB-C DC 5V Adapter'
    },
    reviews: [
      { id: 1, user: 'Albert Gomez', rating: 5, comment: 'The large digits are very easy to read. Backlight helps a lot in dim rooms.', date: '2026-05-19' },
      { id: 2, user: 'Dr. Evelyn Thomas', rating: 4, comment: 'Readings are highly consistent with my manual mercurial sphygmomanometer.', date: '2026-06-11' }
    ]
  },
  {
    id: 'prod-4',
    name: 'ThermoScan Infrared Temporal Thermometer',
    description: 'Non-contact forehead digital thermometer using state-of-the-art infrared detection for instantaneous, hygienic temperature checks with fever color alarms.',
    price: 34.99,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    category: 'Diagnostic Tools',
    stockQuantity: 0, // Out of stock to demonstrate disabled status
    rating: 4.4,
    reviewsCount: 304,
    features: [
      'Non-contact measurement prevents cross-contamination (1-5 cm distance)',
      'Ultra-fast reading in less than 1 second with precision thermal sensors',
      'Smart color-coded fever warning: Green (Normal), Orange (Low Fever), Red (High Fever)',
      'Memory storage holds up to 32 historical temperature records'
    ],
    specifications: {
      'Measurement Time': '< 1 second',
      'Measuring Distance': '1 - 5 cm',
      'Body Temp Range': '32.0°C - 42.9°C (89.6°F - 109.2°F)',
      'Accuracy': '±0.2°C / ±0.4°F',
      'Memory': '32 sets of data'
    },
    reviews: [
      { id: 1, user: 'Chloe Bennett', rating: 4, comment: 'Super fast for taking temperature of my sleeping toddler. Highly recommend.', date: '2026-06-25' }
    ]
  },
  {
    id: 'prod-5',
    name: 'MediKit Trauma & First Aid Pack',
    description: 'Comprehensive 250-piece emergency medical responder kit packed in a heavy-duty, water-resistant tactical nylon bag for family safety or professional field use.',
    price: 119.99,
    imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d304b3b86?auto=format&fit=crop&w=600&q=80',
    category: 'Emergency Supplies',
    stockQuantity: 65,
    rating: 4.9,
    reviewsCount: 76,
    features: [
      'Fully stocked emergency kit including tourniquet, splint, bandages, and CPR mask',
      'Highly organized compartments for easy, stress-free access in high-pressure scenarios',
      'Durable, waterproof, Rip-Stop outer bag with tactical MOLLE attachments',
      'Comes with a pocket-sized emergency first-aid instruction guide'
    ],
    specifications: {
      'Piece Count': '250 essential medical items',
      'Bag Material': '1000D Ballistic Tactical Nylon',
      'Dimensions': '32 x 20 x 18 cm',
      'Weight': '1.8 kg',
      'Expiration dates': 'Sterile supplies guaranteed for 3 years'
    },
    reviews: [
      { id: 1, user: 'Marcus Vance', rating: 5, comment: 'As an EMT, I approve of this bag. It contains all high-quality bandages, shears, and splints.', date: '2026-06-10' }
    ]
  },
  {
    id: 'prod-6',
    name: 'NuForm Orthopedic Lumbar Support Cushion',
    description: 'Premium pure memory foam back cushion designed for office chairs and car seats to correct spine alignment and alleviate lower back pressure.',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    category: 'Wellness & Comfort',
    stockQuantity: 150,
    rating: 4.5,
    reviewsCount: 420,
    features: [
      'Ergonomically contoured memory foam aligns spine and supports lower back',
      'Breathable, removable, and machine-washable 3D mesh zipper cover',
      'Adjustable dual straps securely fit any chair back, preventing slippage',
      'Heat-responsive foam adapts perfectly to your individual back contour'
    ],
    specifications: {
      'Material': '100% Premium Memory Foam',
      'Cover Material': '3D Breathable Mesh Fabric',
      'Dimensions': '34 x 32 x 12 cm',
      'Color': 'Charcoal Black',
      'Strap Extension': 'Fits up to 55 cm width'
    },
    reviews: [
      { id: 1, user: 'David Kim', rating: 5, comment: 'Relieved my sciatica pain during 10-hour workdays. Highly recommended!', date: '2026-07-01' }
    ]
  }
];

let mockUser = null;
let mockCart = { items: [], totalPrice: 0 };
let mockOrders = [
  {
    id: 'ORD-9831',
    orderDate: '2026-06-14T10:45:00Z',
    orderStatus: 'DELIVERED',
    totalPrice: 129.98,
    shippingAddress: '123 Health Ave, Medical District, NY 10001',
    paymentMethod: 'Credit Card',
    items: [
      {
        productId: 'prod-2',
        productName: 'AeroPulse Smart Pulse Oximeter',
        price: 49.99,
        quantity: 1
      },
      {
        productId: 'prod-3',
        productName: 'OmniKare Digital Blood Pressure Monitor',
        price: 79.99,
        quantity: 1
      }
    ]
  }
];

// Helper to simulate network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to calculate cart totals
const recalculateMockCart = () => {
  let total = 0;
  mockCart.items.forEach(item => {
    total += item.product.price * item.quantity;
  });
  mockCart.totalPrice = parseFloat(total.toFixed(2));
};

// ==========================================
// CENTRAL REQUEST UTILITY (For Real Backend)
// ==========================================
async function request(url, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
      throw new Error('Session expired. Please log in again.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong with the API request.');
    }

    return data;
  } catch (error) {
    console.error('API Client Error:', error);
    throw error;
  }
}

// ==========================================
// EXPORTED API SERVICE INTERFACE
// ==========================================
export const api = {
  // --- AUTH SERVICES ---
  login: async (email, password) => {
    if (USE_MOCK_API) {
      await delay(MOCK_DELAY);
      // Mock validation
      if (!email || !password) throw new Error('Email and password are required');

      // Let any user login, mock a return profile
      mockUser = {
        id: 'usr-12',
        name: email.split('@')[0].replace(/^\w/, c => c.toUpperCase()) || 'John Doe',
        email: email,
        role: 'CUSTOMER'
      };

      const token = 'mock-jwt-token-xyz-12345';
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
      return { token, user: mockUser };
    } else {
      return request(ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    }
  },

  signup: async (name, email, password) => {
    if (USE_MOCK_API) {
      await delay(MOCK_DELAY);
      if (!name || !email || !password) throw new Error('All fields are required');

      mockUser = {
        id: 'usr-' + Math.floor(Math.random() * 1000),
        name,
        email,
        role: 'CUSTOMER'
      };

      const token = 'mock-jwt-token-xyz-register';
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
      return { token, user: mockUser };
    } else {
      return request(ENDPOINTS.SIGNUP, {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
    }
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    mockUser = null;
    mockCart = { items: [], totalPrice: 0 };
    return { success: true };
  },

  // --- PRODUCT SERVICES ---
  getProducts: async (search = '', category = 'All', sort = 'DEFAULT', page = 0, size = 6) => {
    if (USE_MOCK_API) {
      await delay(MOCK_DELAY);
      let result = [...MOCK_PRODUCTS];
      if (search.trim() !== '') {
        const query = search.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
      }
      if (category !== 'All') {
        result = result.filter(p => p.category === category);
      }
      if (sort === 'PRICE_LOW_HIGH') result.sort((a, b) => a.price - b.price);
      else if (sort === 'PRICE_HIGH_LOW') result.sort((a, b) => b.price - a.price);
      
      const start = page * size;
      const end = start + size;
      const content = result.slice(start, end);
      return {
        content,
        totalPages: Math.ceil(result.length / size),
        totalElements: result.length
      };
    } else {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      params.append('page', page);
      params.append('size', size);
      const data = await request(`${ENDPOINTS.PRODUCTS}?${params.toString()}`);
      return {
        ...data,
        content: (data?.content || []).map(mapProductResponse)
      };
    }
  },

  getProductById: async (id) => {
    if (USE_MOCK_API) {
      await delay(MOCK_DELAY);
      const product = MOCK_PRODUCTS.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      return product;
    } else {
      return request(ENDPOINTS.PRODUCT_DETAIL(id));
    }
  },

  // --- CART SERVICES ---
  getCart: async () => {
    if (USE_MOCK_API) {
      await delay(MOCK_DELAY - 200);
      return mockCart;
    } else {
      return request(ENDPOINTS.CART);
    }
  },

  addToCart: async (productId, quantity) => {
    if (USE_MOCK_API) {
      await delay(MOCK_DELAY - 200);
      const product = MOCK_PRODUCTS.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');

      const existingIndex = mockCart.items.findIndex(item => item.product.id === productId);
      if (existingIndex > -1) {
        mockCart.items[existingIndex].quantity += quantity;
      } else {
        mockCart.items.push({
          id: 'ci-' + Math.random().toString(36).substr(2, 9),
          product,
          quantity
        });
      }
      recalculateMockCart();
      return mockCart;
    } else {
      return request(ENDPOINTS.CART_ADD, {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      });
    }
  },

  updateCartItem: async (productId, quantity) => {
    if (USE_MOCK_API) {
      await delay(MOCK_DELAY - 300);
      const existingIndex = mockCart.items.findIndex(item => item.product.id === productId);
      if (existingIndex > -1) {
        if (quantity <= 0) {
          mockCart.items.splice(existingIndex, 1);
        } else {
          mockCart.items[existingIndex].quantity = quantity;
        }
      }
      recalculateMockCart();
      return mockCart;
    } else {
      return request(ENDPOINTS.CART_UPDATE, {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity }),
      });
    }
  },

  removeFromCart: async (productId) => {
    if (USE_MOCK_API) {
      await delay(MOCK_DELAY - 300);
      mockCart.items = mockCart.items.filter(item => item.product.id !== productId);
      recalculateMockCart();
      return mockCart;
    } else {
      return request(ENDPOINTS.CART_REMOVE(productId), {
        method: 'DELETE',
      });
    }
  },

  clearCart: async () => {
    if (USE_MOCK_API) {
      await delay(100);
      mockCart = { items: [], totalPrice: 0 };
      return mockCart;
    } else {
      return request(ENDPOINTS.CART_CLEAR, {
        method: 'POST',
      });
    }
  },

  // --- ORDER SERVICES ---
  placeOrder: async (shippingAddress, paymentMethod) => {
    if (USE_MOCK_API) {
      await delay(MOCK_DELAY + 400);

      if (mockCart.items.length === 0) {
        throw new Error('Cannot place order with an empty cart');
      }

      const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
      const newOrder = {
        id: orderId,
        orderDate: new Date().toISOString(),
        orderStatus: 'PENDING',
        totalPrice: mockCart.totalPrice,
        shippingAddress,
        paymentMethod,
        items: mockCart.items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        }))
      };

      mockOrders.unshift(newOrder);
      mockCart = { items: [], totalPrice: 0 }; // clear cart upon ordering

      return newOrder;
    } else {
      return request(ENDPOINTS.PLACE_ORDER, {
        method: 'POST',
        body: JSON.stringify({ shippingAddress, paymentMethod }),
      });
    }
  },

  getOrders: async () => {
    if (USE_MOCK_API) {
      await delay(MOCK_DELAY);
      return mockOrders;
    } else {
      return request(ENDPOINTS.ORDERS);
    }
  }
};

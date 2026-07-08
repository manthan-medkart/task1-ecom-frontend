/**
 * API Endpoints Configuration
 * 
 * This file maps the frontend service endpoints to their corresponding URL paths.
 * When integrating with your Spring Boot backend, ensure your @RestController classes
 * map to these exact endpoints or update the paths below to match your API layout.
 */

// Retrieve the backend API base URL from environment variables, defaulting to localhost for Spring Boot.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const ENDPOINTS = {
  // Authentication Controllers
  // POST /api/auth/login (Payload: { email, password }) -> Returns: { token, user: { id, name, email, role } }
  LOGIN: `/api/auth/login`,
  
  // POST /api/auth/signup (Payload: { name, email, password }) -> Returns: { token, user: { id, name, email, role } }
  SIGNUP: `/api/auth/signup`,

  // Product Controllers
  // GET /api/products -> Returns: Array of Product { id, name, description, price, imageUrl, category, stockQuantity }
  PRODUCTS: `/api/products`,
  
  // GET /api/products/{id} -> Returns: Product
  PRODUCT_DETAIL: (id) => `/api/products/${id}`,

  // Cart Controllers (Requires Bearer Token)
  // GET /api/cart -> Returns: Cart { items: [ { id, product, quantity } ], totalPrice }
  CART: `/api/cart`,
  
  // POST /api/cart/add -> Payload: { productId, quantity } -> Returns: Updated Cart
  CART_ADD: `/api/cart/add`,
  
  // PUT /api/cart/update -> Payload: { productId, quantity } -> Returns: Updated Cart
  CART_UPDATE: `/api/cart/update`,
  
  // DELETE /api/cart/remove/{productId} -> Returns: Updated Cart
  CART_REMOVE: (productId) => `/api/cart/remove/${productId}`,
  
  // POST /api/cart/clear -> Returns: Empty Cart
  CART_CLEAR: `/api/cart/clear`,

  // Order Controllers (Requires Bearer Token)
  // POST /api/orders -> Payload: { shippingAddress, paymentMethod } -> Returns: Order
  // (Note: Backend pulls items from the active user's DB cart)
  PLACE_ORDER: `/api/orders`,
  
  // GET /api/orders -> Returns: Array of Order { id, orderDate, orderStatus, totalPrice, shippingAddress, items: [...] }
  ORDERS: `/api/orders`,
};

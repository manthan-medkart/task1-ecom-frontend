const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Parses the backend's string-serialized ProductEntity representation.
 * Format: "ProductEntity(id=1, name=..., composition=...)"
 */
export function parseProductString(productStr) {
  if (!productStr || typeof productStr !== 'string') return null;
  const match = productStr.match(/ProductEntity\((.*)\)/);
  if (!match) return null;
  const fieldsStr = match[1];
  
  const fields = {};
  const regex = /(\w+)=([\s\S]*?)(?:, (?=\w+=)|$)/g;
  let m;
  while ((m = regex.exec(fieldsStr)) !== null) {
    fields[m[1]] = m[2];
  }
  
  return {
    id: fields.id ? parseInt(fields.id, 10) : null,
    name: fields.name || '',
    composition: fields.composition || '',
    mrp: fields.mrp ? parseInt(fields.mrp, 10) : 0,
    salesRate: fields.salesRate ? parseInt(fields.salesRate, 10) : 0,
    totalStrip: fields.totalStrip ? parseInt(fields.totalStrip, 10) : 0,
    medicinePerStrip: fields.medicinePerStrip ? parseInt(fields.medicinePerStrip, 10) : 0,
    imageUrl: fields.imageUrl || '',
  };
}

/**
 * Processes cart response to parse stringified product items.
 */
function processCartData(cartData) {
  if (cartData && cartData.items) {
    cartData.items = cartData.items.map(item => ({
      ...item,
      product: parseProductString(item.product)
    }));
  }
  return cartData;
}

/**
 * Helper to build common headers including optional JWT Authorization.
 */
function getHeaders(token = null) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Handle API responses and parse JSON or throw errors.
 */
async function handleResponse(response) {
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }
  }

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

export const api = {
  // PRODUCTS
  async getProducts(search = '', sort = 'DEFAULT', page = 0, size = 6) {
    const url = new URL(`${API_BASE_URL}/products`);
    if (search) url.searchParams.append('search', search);
    if (sort) url.searchParams.append('sort', sort);
    url.searchParams.append('page', page);
    url.searchParams.append('size', size);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: getHeaders(),
    });
    const res = await handleResponse(response);
    return res.data; // content: ProductDto[]
  },

  async getProductById(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const res = await handleResponse(response);
    return res.data; // ProductDto
  },

  // AUTH
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return await handleResponse(response); // { accessToken, userDto }
  },

  async signup(name, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    return await handleResponse(response); // { email, status }
  },

  // CART
  async getCart(token) {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    const res = await handleResponse(response);
    return processCartData(res.data);
  },

  async addToCart(productId, quantity, token) {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ productId, quantity }),
    });
    const res = await handleResponse(response);
    return processCartData(res.data);
  },

  async updateCart(productId, quantity, token) {
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ productId, quantity }),
    });
    const res = await handleResponse(response);
    return processCartData(res.data);
  },

  async removeFromCart(productId, token) {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    const res = await handleResponse(response);
    return processCartData(res.data);
  },

  async clearCart(token) {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    const res = await handleResponse(response);
    return processCartData(res.data);
  },

  // ORDERS
  async placeOrder(shippingAddress, paymentMethod, token) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ shippingAddress, paymentMethod }),
    });
    const res = await handleResponse(response);
    return res.data; // OrderResponseDto
  },

  async getOrders(token) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    const res = await handleResponse(response);
    return res.data; // List<OrderResponseDto>
  },

  async getOrderDetails(orderId, token) {
    const response = await fetch(`${API_BASE_URL}/orders/details/${orderId}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    const res = await handleResponse(response);
    return res.data; // List<OrderItemResponseDto>
  },
};

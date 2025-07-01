const API_BASE_URL = 'https://e-com-5-y30p.onrender.com/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
  
  // Product endpoints
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/products/${id}`,
  PRODUCT_REVIEWS: (id) => `${API_BASE_URL}/products/${id}/reviews`,
  
  // Cart endpoints
  CART: `${API_BASE_URL}/cart`,
  CART_ITEM: (id) => `${API_BASE_URL}/cart/${id}`,
  
  // Order endpoints
  ORDERS: `${API_BASE_URL}/orders`,
  ORDER_BY_ID: (id) => `${API_BASE_URL}/orders/${id}`,
};

export default API_BASE_URL; 
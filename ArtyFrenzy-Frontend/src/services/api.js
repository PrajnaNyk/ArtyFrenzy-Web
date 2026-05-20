import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("af_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("af_token");
      localStorage.removeItem("af_user");
      localStorage.removeItem("af_expiry");
    }
    return Promise.reject(error);
  }
);

// ── Auth ──
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (name, email, password) => api.post("/auth/register", { name, email, password }),
};

// ── Artworks ──
export const artworkAPI = {
  // Public (User Site)
  getAll: () => api.get("/artworks"), // Fetches available artworks for users
  getById: (id) => api.get(`/artworks/${id}`),
  getByCategory: (category) => api.get(`/artworks/category/${category}`),

  // ── ADDED: Admin Specific Endpoints ──
  getAllAdmin: () => api.get("/artworks/admin/all"), // Fetches ALL artworks (including sold) for admin
  create: (data) => api.post("/artworks", data),     // POST request to add new artwork
  update: (id, data) => api.put(`/artworks/${id}`, data), // PUT request to edit artwork
  delete: (id) => api.delete(`/artworks/${id}`),     // DELETE request to remove artwork
};

// ── Artists ──
export const artistAPI = {
  getAll: () => api.get("/artists"),
  getById: (id) => api.get(`/artists/${id}`),
  getByName: (name) => api.get(`/artists/name/${encodeURIComponent(name)}`),
  create: (data) => api.post("/artists", data),
  update: (id, data) => api.put(`/artists/${id}`, data),
  delete: (id) => api.delete(`/artists/${id}`),
};

// ── Wishlist ──
export const wishlistAPI = {
  getWishlist: (userId) => api.get(`/wishlist/${userId}`),
  add: (userId, artworkId) => api.post("/wishlist", { userId, artworkId }),
  remove: (userId, artworkId) => api.delete("/wishlist", { data: { userId, artworkId } }),
  check: (userId, artworkId) => api.get(`/wishlist/check?userId=${userId}&artworkId=${artworkId}`),
};

// ── Reviews ──
export const reviewAPI = {
  getByArtwork: (artworkId) => api.get(`/reviews/artwork/${artworkId}`),
  add: (userId, artworkId, rating, comment) => api.post("/reviews", { userId, artworkId, rating, comment }),
  delete: (reviewId, userId) => api.delete(`/reviews/${reviewId}?userId=${userId}`),
};

// ── Payments ──
export const paymentAPI = {
  createOrder: (data) => api.post("/payments/create-order", data),
  verifyPayment: (data) => api.post("/payments/verify", data),
  getUserOrders: (userId) => api.get(`/payments/orders/${userId}`),
  getAdminStats: () => api.get("/payments/admin/stats"),
};

export default api;
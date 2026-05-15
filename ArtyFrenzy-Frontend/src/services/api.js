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
      // CHANGED: Also remove af_expiry so the auth state stays clean
      localStorage.removeItem("af_token");
      localStorage.removeItem("af_user");
      localStorage.removeItem("af_expiry");
      
      // CHANGED: Instead of hard reloading, just reject the promise.
      // Your AuthContext will naturally see the tokens are gone and log the user out.
      // window.location.reload(); 
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
  getAll: () => api.get("/artworks"),
  getById: (id) => api.get(`/artworks/${id}`),
  getByCategory: (category) => api.get(`/artworks/category/${category}`),
};

// ── Artists ──
export const artistAPI = {
  getAll: () => api.get("/artists"),
  getByName: (name) => api.get(`/artists/name/${encodeURIComponent(name)}`),
  getById: (id) => api.get(`/artists/${id}`),
};

// ── Wishlist ──
export const wishlistAPI = {
  getWishlist: (userId) => api.get(`/wishlist/${userId}`),
  add: (userId, artworkId) => api.post("/wishlist", { userId, artworkId }),
  remove: (userId, artworkId) => api.delete("/wishlist", { data: { userId, artworkId } }),
  check: (userId, artworkId) => api.get(`/wishlist/check?userId=${userId}&artworkId=${artworkId}`),
};

// ── Reviews ── (No changes needed here!)
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
};

export default api;
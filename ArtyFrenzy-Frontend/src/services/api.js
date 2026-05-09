import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

// ── Axios instance with JWT token auto-attached ──
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("af_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 (token expired) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("af_token");
      localStorage.removeItem("af_user");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// ── Auth APIs ──
export const authAPI = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }),

  register: (name, email, password) =>
    api.post("/auth/register", { name, email, password }),
};

// ── Artwork APIs ──
export const artworkAPI = {
  getAll: () => api.get("/artworks"),
  getById: (id) => api.get(`/artworks/${id}`),
  getByCategory: (category) => api.get(`/artworks/category/${category}`),
};

// ── Artist APIs ──
export const artistAPI = {
  getAll: () => api.get("/artists"),
  getByName: (name) => api.get(`/artists/name/${name}`),
  getById: (id) => api.get(`/artists/${id}`),
};

// ── Wishlist APIs ──
export const wishlistAPI = {
  getWishlist: (userId) => api.get(`/wishlist/${userId}`),
  add: (userId, artworkId) => api.post("/wishlist", { userId, artworkId }),
  remove: (userId, artworkId) => api.delete("/wishlist", { data: { userId, artworkId } }),
  check: (userId, artworkId) => api.get(`/wishlist/check?userId=${userId}&artworkId=${artworkId}`),
};

// ── Review APIs ──
export const reviewAPI = {
  getByArtwork: (artworkId) => api.get(`/reviews/artwork/${artworkId}`),
  add: (userId, artworkId, rating, comment) =>
    api.post("/reviews", { userId, artworkId, rating, comment }),
  delete: (reviewId, userId) =>
    api.delete(`/reviews/${reviewId}?userId=${userId}`),
};

export default api;
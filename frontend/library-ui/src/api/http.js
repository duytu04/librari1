import axios from "axios";

// Ưu tiên VITE_API_BASE, fallback sang VITE_API_BASE_URL, cuối cùng mới "/api"
const raw = import.meta.env.VITE_API_BASE ?? import.meta.env.VITE_API_BASE_URL ?? "/api";

// Chuẩn hoá: bỏ "/" cuối, đảm bảo có "/api" ở cuối nếu bạn đặt base là root backend
function normalizeApiBase(u) {
  if (!u) return "/api";
  const trimmed = u.replace(/\/+$/, "");
  // Nếu bạn đã set sẵn .../api trong env thì giữ nguyên
  if (trimmed.toLowerCase().endsWith("/api")) return trimmed;
  return trimmed + "/api"; // chỉ cần nếu bạn đặt env là root (ví dụ https://...azurewebsites.net)
}

const baseURL = normalizeApiBase(raw);

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { Accept: "application/json" }
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  res => res,
  err => {
    const status = err?.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (status === 403) {
      console.warn("403 Forbidden – kiểm tra CORS hoặc quyền.");
    } else if (!err.response) {
      console.error("Network error – kiểm tra domain API/CORS:", baseURL);
    }
    return Promise.reject(err);
  }
);

export default api;

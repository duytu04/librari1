import api from "./http.js";

export async function login(dto) {
  const { data } = await api.post("/auth/login", dto);
  return data; // { token }
}
export async function register(dto) {
  const { data } = await api.post("/auth/register", dto);
  return data;
}

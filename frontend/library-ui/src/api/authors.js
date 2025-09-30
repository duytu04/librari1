import api from "./http.js";

export async function createAuthor(dto) {
  const { data } = await api.post("/authors", dto);
  return data;
}
export async function listAuthors() {
  const { data } = await api.get("/authors");
  return data;
}

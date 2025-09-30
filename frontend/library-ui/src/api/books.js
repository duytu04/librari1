import api from "./http.js";

export async function createBook(dto) {
  const { data } = await api.post("/books", dto);
  return data;
}
export async function listBooks() {
  const { data } = await api.get("/books");
  return data;
}
export async function assignAuthor(dto) {
  await api.post("/books/assign-author", dto);
}
export async function assignPublisher(dto) {
  await api.post("/books/assign-publisher", dto);
}

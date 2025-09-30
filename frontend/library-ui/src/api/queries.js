import api from "./http.js";

export async function booksByAuthor(authorId) {
  const { data } = await api.get(`/queries/books-by-author/${authorId}`);
  return data;
}
export async function authorsOver2Books() {
  const { data } = await api.get("/queries/authors-over-2-books");
  return data;
}
export async function booksAfter(year = 2015) {
  const { data } = await api.get(`/queries/books-after/${year}`);
  return data;
}
export async function publishersMinBooks(min = 3) {
  const { data } = await api.get(`/queries/publishers-min-books/${min}`);
  return data;
}
export async function authorBookPublisher() {
  const { data } = await api.get("/queries/author-book-publisher");
  return data;
}

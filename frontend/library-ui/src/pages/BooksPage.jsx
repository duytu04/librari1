import { useEffect, useState } from "react";
import { listBooks } from "../api/books.js";
import BookForm from "../components/BookForm.jsx";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  async function reload() { setBooks(await listBooks()); }
  useEffect(() => { reload(); }, []);
  return (
    <div>
      <h2>Books</h2>
      <BookForm onCreated={reload} />
      <table>
        <thead><tr><th>ID</th><th>Title</th><th>Year</th><th>Publisher</th><th>Authors</th></tr></thead>
        <tbody>
          {books.map(b => (
            <tr key={b.bookId}>
              <td>{b.bookId}</td><td>{b.title}</td><td>{b.publishedYear ?? "-"}</td>
              <td>{b.publisherName ?? "-"}</td>
              <td>{(b.authors || []).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

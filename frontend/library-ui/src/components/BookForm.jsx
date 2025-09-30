import { useEffect, useState } from "react";
import { createBook, assignAuthor, assignPublisher } from "../api/books.js";
import { listAuthors } from "../api/authors.js";
import { listPublishers } from "../api/publishers.js";

export default function BookForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [publisherId, setPublisherId] = useState("");

  useEffect(() => {
    (async () => {
      setAuthors(await listAuthors());
      setPublishers(await listPublishers());
    })();
  }, []);

  async function submit(e) {
    e.preventDefault();
    const book = await createBook({ title, publishedYear: year === "" ? null : Number(year) });

    for (const aid of selectedAuthors) {
      await assignAuthor({ bookId: book.bookId, authorId: aid });
    }
    if (publisherId !== "") {
      await assignPublisher({ bookId: book.bookId, publisherId: Number(publisherId) });
    }
    setTitle(""); setYear(""); setSelectedAuthors([]); setPublisherId("");
    onCreated && onCreated();
  }

  function toggleAuthor(aid) {
    setSelectedAuthors(prev => prev.includes(aid) ? prev.filter(x => x !== aid) : [...prev, aid]);
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 10, marginBottom: 12, maxWidth: 560 }}>
      <input placeholder="Book title" value={title} onChange={e => setTitle(e.target.value)} required />
      <input placeholder="Published year" type="number" value={year} onChange={e => setYear(e.target.value)} />

      <div>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Authors</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {authors.map(a => (
            <label key={a.authorId} style={{ border: "1px solid #ddd", padding: "4px 8px", borderRadius: 6 }}>
              <input
                type="checkbox"
                checked={selectedAuthors.includes(a.authorId)}
                onChange={() => toggleAuthor(a.authorId)}
              />{" "}
              {a.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Publisher</div>
        <select value={publisherId} onChange={e => setPublisherId(e.target.value)}>
          <option value="">-- none --</option>
          {publishers.map(p => (
            <option key={p.publisherId} value={p.publisherId}>{p.name}</option>
          ))}
        </select>
      </div>

      <button type="submit">Add Book</button>
    </form>
  );
}

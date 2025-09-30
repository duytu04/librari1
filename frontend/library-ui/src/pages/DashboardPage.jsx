import { useEffect, useState } from "react";
import { listAuthors } from "../api/authors.js";
import { listPublishers } from "../api/publishers.js";
import { listBooks } from "../api/books.js";

export default function DashboardPage() {
  const [counts, setCounts] = useState({ authors: 0, books: 0, publishers: 0 });

  useEffect(() => {
    (async () => {
      const [a, b, p] = await Promise.all([listAuthors(), listBooks(), listPublishers()]);
      setCounts({ authors: a.length, books: b.length, publishers: p.length });
    })();
  }, []);

  return (
    <div>
      <h2>Tổng quan</h2>
      <div style={{ display: "flex", gap: 16 }}>
        <Card label="Authors" value={counts.authors} />
        <Card label="Books" value={counts.books} />
        <Card label="Publishers" value={counts.publishers} />
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, minWidth: 160 }}>
      <div style={{ color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

import { useState } from "react";
import { createAuthor } from "../api/authors.js";

export default function AuthorForm({ onCreated }) {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");

  async function submit(e) {
    e.preventDefault();
    await createAuthor({ name, birthYear: birthYear === "" ? null : Number(birthYear) });
    setName(""); setBirthYear("");
    onCreated && onCreated();
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      <input placeholder="Author name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Birth year" type="number" value={birthYear} onChange={e => setBirthYear(e.target.value)} />
      <button type="submit">Add Author</button>
    </form>
  );
}

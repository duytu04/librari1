import { useState } from "react";
import { createPublisher } from "../api/publishers.js";

export default function PublisherForm({ onCreated }) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");

  async function submit(e) {
    e.preventDefault();
    await createPublisher({ name, country: country || null });
    setName(""); setCountry("");
    onCreated && onCreated();
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      <input placeholder="Publisher name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} />
      <button type="submit">Add Publisher</button>
    </form>
  );
}

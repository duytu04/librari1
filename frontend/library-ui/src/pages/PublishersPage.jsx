import { useEffect, useState } from "react";
import { listPublishers } from "../api/publishers.js";
import PublisherForm from "../components/PublisherForm.jsx";

export default function PublishersPage() {
  const [publishers, setPublishers] = useState([]);
  async function reload() { setPublishers(await listPublishers()); }
  useEffect(() => { reload(); }, []);
  return (
    <div>
      <h2>Publishers</h2>
      <PublisherForm onCreated={reload} />
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Country</th></tr></thead>
        <tbody>
          {publishers.map(p => (
            <tr key={p.publisherId}><td>{p.publisherId}</td><td>{p.name}</td><td>{p.country ?? "-"}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

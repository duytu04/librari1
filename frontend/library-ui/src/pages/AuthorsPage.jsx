import { useEffect, useState } from "react";
import { listAuthors } from "../api/authors.js";
import AuthorForm from "../components/AuthorForm.jsx";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);

  async function reload() {
    setAuthors(await listAuthors());
  }

  useEffect(() => {
    reload();
  }, []);

  return (
    <div>
      <h2>Authors</h2>
      <AuthorForm onCreated={reload} />
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>BirthYear</th></tr>
        </thead>
        <tbody>
          {authors.map(a => (
            <tr key={a.authorId}>
              <td>{a.authorId}</td>
              <td>{a.name}</td>
              <td>{a.birthYear ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

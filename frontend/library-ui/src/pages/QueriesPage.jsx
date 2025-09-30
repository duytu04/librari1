import { useEffect, useMemo, useState } from "react";
import { authorBookPublisher, authorsOver2Books, booksAfter, booksByAuthor, publishersMinBooks } from "../api/queries.js";
import { listAuthors } from "../api/authors.js";
import { downloadCsv, copyJson } from "../utils/exporters.js";

export default function QueriesPage() {
  // Inputs
  const [authorId, setAuthorId] = useState("");
  const [year, setYear] = useState(2015);
  const [minBooks, setMinBooks] = useState(3);
  const [authors, setAuthors] = useState([]);

  // Outputs
  const [res1, setRes1] = useState([]); // books by author
  const [res2, setRes2] = useState([]); // authors over 2
  const [res3, setRes3] = useState([]); // books after
  const [res4, setRes4] = useState([]); // publishers min books
  const [res5, setRes5] = useState([]); // join

  // Loading/error states per query
  const [loading, setLoading] = useState({ _authors:false, q1:false, q2:false, q3:false, q4:false, q5:false });
  const [error, setError] = useState({ q1:null, q2:null, q3:null, q4:null, q5:null });

  // Bootstrap initial data
  useEffect(() => {
    (async () => {
      try {
        setLoading(s => ({...s, _authors:true, q2:true, q3:true, q4:true, q5:true}));
        const [authorsList, q2r, q3r, q4r, q5r] = await Promise.all([
          listAuthors(),
          authorsOver2Books(),
          booksAfter(2015),
          publishersMinBooks(3),
          authorBookPublisher()
        ]);
        setAuthors(authorsList);
        setRes2(q2r); setRes3(q3r); setRes4(q4r); setRes5(q5r);
      } catch (e) {
        console.error(e);
        // Đặt 1 lỗi tổng nếu cần
      } finally {
        setLoading(s => ({...s, _authors:false, q2:false, q3:false, q4:false, q5:false}));
      }
    })();
  }, []);

  // Actions
  async function run1(){
    if (authorId === "") return;
    try {
      setError(e => ({...e, q1:null}));
      setLoading(s => ({...s, q1:true}));
      const r = await booksByAuthor(Number(authorId));
      setRes1(r);
    } catch (e) {
      setError(er => ({...er, q1: toMsg(e)}));
    } finally {
      setLoading(s => ({...s, q1:false}));
    }
  }
  async function run3(){
    try {
      setError(e => ({...e, q3:null}));
      setLoading(s => ({...s, q3:true}));
      const r = await booksAfter(year);
      setRes3(r);
    } catch (e) { setError(er => ({...er, q3: toMsg(e)})); }
    finally { setLoading(s => ({...s, q3:false})); }
  }
  async function run4(){
    try {
      setError(e => ({...e, q4:null}));
      setLoading(s => ({...s, q4:true}));
      const r = await publishersMinBooks(minBooks);
      setRes4(r);
    } catch (e) { setError(er => ({...er, q4: toMsg(e)})); }
    finally { setLoading(s => ({...s, q4:false})); }
  }
  async function run5(){
    try {
      setError(e => ({...e, q5:null}));
      setLoading(s => ({...s, q5:true}));
      const r = await authorBookPublisher();
      setRes5(r);
    } catch (e) { setError(er => ({...er, q5: toMsg(e)})); }
    finally { setLoading(s => ({...s, q5:false})); }
  }

  const kpis = useMemo(() => ([
    { label: "Books by Author", value: res1.length },
    { label: "Authors ≥ 3 Books", value: res2.length },
    { label: `Books > ${year}`, value: res3.length },
    { label: `Publishers ≥ ${minBooks}`, value: res4.length },
    { label: "Join Rows", value: res5.length },
  ]), [res1, res2, res3, res4, res5, year, minBooks]);

  return (
    <div className="container">
      <h2>LINQ Queries</h2>

      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <div key={i} className="kpi">
            <div className="label">{k.label}</div>
            <div className="value">{k.value}</div>
          </div>
        ))}
      </div>

      {/* 1) Books of an Author */}
      <div className="card">
        <h3>1) Books of a chosen Author</h3>
        <div className="toolbar">
          <select className="select" value={authorId} onChange={e => setAuthorId(e.target.value)}>
            <option value="">-- pick author --</option>
            {authors.map(a => <option key={a.authorId} value={a.authorId}>{a.name}</option>)}
          </select>
          <button className="btn primary" onClick={run1} disabled={!authorId || loading.q1}>
            {loading.q1 ? <span className="spinner" /> : "Run"}
          </button>

          <div className="row-actions">
            <button className="btn ghost" onClick={() => downloadCsv(res1, "books-of-author.csv")} disabled={!res1.length}>Export CSV</button>
            <button className="btn ghost" onClick={() => copyJson(res1)} disabled={!res1.length}>Copy JSON</button>
          </div>
        </div>

        {error.q1 && <div className="error">{error.q1}</div>}
        {!res1.length && !loading.q1 ? <div className="empty">No data. Choose an author and Run.</div> :
          <AutoTable rows={res1} />
        }
      </div>

      {/* 2) Authors with > 2 books */}
      <div className="card">
        <h3>2) Authors with at least 3 books</h3>
        <div className="toolbar">
          <button className="btn primary" onClick={async () => {
            try{ setError(e=>({...e,q2:null})); setLoading(s=>({...s,q2:true})); setRes2(await authorsOver2Books()); }
            catch(e){ setError(er=>({...er,q2:toMsg(e)})); }
            finally{ setLoading(s=>({...s,q2:false})); }
          }}>
            {loading.q2 ? <span className="spinner" /> : "Refresh"}
          </button>
          <div className="row-actions">
            <button className="btn ghost" onClick={() => downloadCsv(res2, "authors-over-2-books.csv")} disabled={!res2.length}>Export CSV</button>
            <button className="btn ghost" onClick={() => copyJson(res2)} disabled={!res2.length}>Copy JSON</button>
          </div>
        </div>
        {error.q2 && <div className="error">{error.q2}</div>}
        {!res2.length && !loading.q2 ? <div className="empty">No authors matched.</div> :
          <AutoTable rows={res2} columns={["authorId","name","bookCount"]} />
        }
      </div>

      {/* 3) Books after year */}
      <div className="card">
        <h3>3) Books published after year</h3>
        <div className="toolbar">
          <input className="number" type="number" value={year} onChange={e => setYear(Number(e.target.value))} />
          <button className="btn primary" onClick={run3}>
            {loading.q3 ? <span className="spinner" /> : "Run"}
          </button>
          <div className="row-actions">
            <button className="btn ghost" onClick={() => downloadCsv(res3, `books-after-${year}.csv`)} disabled={!res3.length}>Export CSV</button>
            <button className="btn ghost" onClick={() => copyJson(res3)} disabled={!res3.length}>Copy JSON</button>
          </div>
        </div>
        {error.q3 && <div className="error">{error.q3}</div>}
        {!res3.length && !loading.q3 ? <div className="empty">No books after {year}.</div> :
          <AutoTable rows={res3} />
        }
      </div>

      {/* 4) Publishers with at least N books */}
      <div className="card">
        <h3>4) Publishers with at least N books</h3>
        <div className="toolbar">
          <input className="number" type="number" value={minBooks} onChange={e => setMinBooks(Number(e.target.value))} />
          <button className="btn primary" onClick={run4}>
            {loading.q4 ? <span className="spinner" /> : "Run"}
          </button>
          <div className="row-actions">
            <button className="btn ghost" onClick={() => downloadCsv(res4, `publishers-min-${minBooks}.csv`)} disabled={!res4.length}>Export CSV</button>
            <button className="btn ghost" onClick={() => copyJson(res4)} disabled={!res4.length}>Copy JSON</button>
          </div>
        </div>
        {error.q4 && <div className="error">{error.q4}</div>}
        {!res4.length && !loading.q4 ? <div className="empty">No publishers reached {minBooks} books.</div> :
          <AutoTable rows={res4} columns={["publisherId","publisherName","bookCount"]} />
        }
      </div>

      {/* 5) Join Author - Book - Publisher */}
      <div className="card">
        <h3>5) Author – Book – Publisher (join)</h3>
        <div className="toolbar">
          <button className="btn primary" onClick={run5}>
            {loading.q5 ? <span className="spinner" /> : "Refresh"}
          </button>
          <div className="row-actions">
            <button className="btn ghost" onClick={() => downloadCsv(res5, "author-book-publisher.csv")} disabled={!res5.length}>Export CSV</button>
            <button className="btn ghost" onClick={() => copyJson(res5)} disabled={!res5.length}>Copy JSON</button>
          </div>
        </div>
        {error.q5 && <div className="error">{error.q5}</div>}
        {!res5.length && !loading.q5 ? <div className="empty">No joined rows.</div> :
          <AutoTable rows={res5} />
        }
      </div>
    </div>
  );
}

/** Helper: render bảng tự động từ mảng object */
function AutoTable({ rows, columns }){
  if (!rows?.length) return null;
  const cols = columns && columns.length ? columns : Array.from(new Set(rows.flatMap(r => Object.keys(r))));
  return (
    <div style={{ overflowX:"auto", marginTop: 8 }}>
      <table className="table">
        <thead>
          <tr>{cols.map(c => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              {cols.map(c => <td key={c}>{formatCell(r[c])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="muted" style={{ marginTop: 8 }}>{rows.length} row(s)</div>
    </div>
  );
}

function formatCell(v){
  if (Array.isArray(v)) return v.join(", ");
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function toMsg(e){
  const m = e?.response?.data || e?.message || String(e);
  return typeof m === "string" ? m : JSON.stringify(m);
}

import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

function NavLink({ to, label }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} style={{
      padding: "8px 12px",
      borderRadius: 8,
      background: active ? "#0ea5e9" : "transparent",
      color: active ? "white" : "#0ea5e9",
      border: "1px solid #0ea5e9",
      textDecoration: "none",
      fontWeight: 600,
      marginRight: 8
    }}>{label}</Link>
  );
}

export default function Layout() {
  const { logout } = useAuth();
  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>📚 Library UI</h1>
        <div>
          <NavLink to="/dashboard" label="Dashboard" />
          <NavLink to="/authors" label="Authors" />
          <NavLink to="/books" label="Books" />
          <NavLink to="/publishers" label="Publishers" />
          <NavLink to="/queries" label="Queries" />
          <button onClick={logout} style={{ marginLeft: 12, padding: "8px 12px", borderRadius: 8, border: "1px solid #ef4444", color: "#ef4444", background: "white", fontWeight: 600 }}>
            Logout
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

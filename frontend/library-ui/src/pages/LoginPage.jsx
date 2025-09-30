import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login, register } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const from = loc.state?.from?.pathname || "/dashboard";

  async function submit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      if (mode === "register") {
        await register({ username, password, role: "Admin" });
      }
      await login({ username, password });
      nav(from, { replace: true });
    } catch (err) {
      alert(err?.response?.data ?? "Auth error");
    } finally { setLoading(false); }
  }

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", fontFamily: "system-ui" }}>
      <form onSubmit={submit} style={{ width: 360, display: "grid", gap: 10, border: "1px solid #e5e7eb", padding: 16, borderRadius: 12 }}>
        <h2 style={{ margin: 0 }}>{mode === "login" ? "Đăng nhập" : "Đăng ký"}</h2>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "..." : (mode === "login" ? "Login" : "Register")}</button>
        <small>
          {mode === "login" ? (
            <>Chưa có tài khoản? <Link to="#" onClick={() => setMode("register")}>Đăng ký</Link></>
          ) : (
            <>Đã có tài khoản? <Link to="#" onClick={() => setMode("login")}>Đăng nhập</Link></>
          )}
        </small>
      </form>
    </div>
  );
}

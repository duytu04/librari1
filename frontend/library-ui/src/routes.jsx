import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AuthorsPage from "./pages/AuthorsPage.jsx";
import BooksPage from "./pages/BooksPage.jsx";
import PublishersPage from "./pages/PublishersPage.jsx";
import QueriesPage from "./pages/QueriesPage.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <Navigate to="/dashboard" replace /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/authors", element: <AuthorsPage /> },
      { path: "/books", element: <BooksPage /> },
      { path: "/publishers", element: <PublishersPage /> },
      { path: "/queries", element: <QueriesPage /> }
    ]
  },
  { path: "*", element: <Navigate to="/" replace /> }
]);

export default router;

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, role } = useAuth();

  // 🔄 loading guard
  if (currentUser === undefined) {
    return <div>Loading...</div>;
  }

  // ❌ not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 ADMIN BLOCK USER PAGES
  if (role === "admin" && !adminOnly) {
    return <Navigate to="/admin" replace />;
  }

  // 🔥 USER BLOCK ADMIN PAGE
  if (adminOnly && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
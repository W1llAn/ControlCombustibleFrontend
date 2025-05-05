import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("jwtToken");

  return token ? (
    <Outlet /> // Muestra las rutas protegidas
  ) : (
    <Navigate to="/login" replace state={{ from: window.location.pathname }} />
  );
}

export default ProtectedRoute;

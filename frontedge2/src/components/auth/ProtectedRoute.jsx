// src/components/auth/ProtectedRoute.jsx
"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContextProvider.jsx"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="loading-spinner">Laden...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./components/auth/AuthContextProvider.jsx"
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx"
import Register from "./components/auth/Register"
import Login from "./components/auth/Login"
import Logout from "./components/auth/Logout"
import ForgotPassword from "./components/auth/ForgotPassword.jsx"
import ResetPassword from "./components/auth/ResetPassword.jsx"
import Home from "./components/Home"
import Profile from "./components/profile/Profile"
import Settings from "./components/profile/Settings"
import Notifications from "./components/common/Notifications"
import Chat from "./components/chat/Chat"

function App() {
  return (
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </Router>
  )
}

export default App
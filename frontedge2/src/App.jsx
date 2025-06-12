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
import Chat from "./components/chat/Chat"
import SearchResults from './components/search/SearchResultsComponent.jsx'
import SkillDetail from "./components/skill/SkillDetail"
import StrangerProfile from './components/profile/StrangerProfile'
import FollowersFollowing from './components/profile/FollowersFollowing.jsx'


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
            <Route path="/search" element={<SearchResults />} />
            <Route path="/messages" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/skill/:skillId" element={<SkillDetail />} />
            <Route path="/profile/:userId" element={<StrangerProfile />} />
            <Route path="/profile/:userId/followers" element={<FollowersFollowing />} />
            <Route path="/profile/:userId/following" element={<FollowersFollowing />} />
            <Route path="/chat/:userId" element={<Chat />} />

          </Routes>
        </AuthProvider>
      </Router>
  )
}

export default App
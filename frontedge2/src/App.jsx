import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Register from "./components/auth/Register"
import Login from "./components/auth/Login"
import Logout from "./components/auth/Logout"
import Home from "./components/Home"
import Profile from "./components/profile/Profile"
import Settings from "./components/profile/Settings"
import Notifications from "./components/common/Notifications"
import Chat from "./components/chat/Chat"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Chat />} />
      </Routes>
    </Router>
  )
}

export default App

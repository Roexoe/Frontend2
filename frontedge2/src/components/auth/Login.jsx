"use client"

import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase"
import { Link, useNavigate } from "react-router-dom"
import GoogleSignIn from "./GoogleSignIn"
import Header from "../common/Header"
import Footer from "../common/Footer"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential"
          ? "Ongeldige inloggegevens. Controleer je e-mail en wachtwoord."
          : err.message,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <Header />
      <main>
        <div className="container">
          <div className="auth-container">
            <h2>Inloggen</h2>

            <div className="auth-providers">
              <GoogleSignIn />
            </div>

            <div className="auth-divider">
              <span>of</span>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Voer je e-mail in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Wachtwoord</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Voer je wachtwoord in"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ textAlign: "right", marginBottom: "var(--space-md)" }}>
                <Link to="/forgot-password" className="btn-link">
                  Wachtwoord vergeten?
                </Link>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Bezig met inloggen..." : "Inloggen"}
              </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <p className="auth-redirect">
              Nog geen account? <Link to="/register">Registreer hier</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Login

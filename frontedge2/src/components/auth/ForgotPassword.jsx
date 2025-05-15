// src/components/auth/ForgotPassword.jsx
"use client"

import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../../firebase"
import { Link } from "react-router-dom"
import Header from "../common/Header"
import Footer from "../common/Footer"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      setMessage("Controleer je e-mail voor instructies om je wachtwoord te resetten.")
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Er is geen account gekoppeld aan dit e-mailadres.")
      } else {
        setError("Er is een fout opgetreden. Probeer het later opnieuw.")
      }
      console.error(err)
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
            <h2>Wachtwoord vergeten</h2>
            <p>Voer je e-mailadres in om een wachtwoord reset link te ontvangen.</p>

            <form onSubmit={handleSubmit}>
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

              <button type="submit" disabled={loading}>
                {loading ? "Bezig..." : "Reset wachtwoord"}
              </button>
            </form>

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            <p className="auth-redirect">
              <Link to="/login">Terug naar inloggen</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ForgotPassword
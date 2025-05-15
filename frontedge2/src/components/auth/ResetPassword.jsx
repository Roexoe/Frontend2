// src/components/auth/ResetPassword.jsx
"use client"

import { useState, useEffect } from "react"
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth"
import { auth } from "../../firebase"
import { Link, useNavigate, useLocation } from "react-router-dom"
import Header from "../common/Header"
import Footer from "../common/Footer"

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [validCode, setValidCode] = useState(false)
  const [oobCode, setOobCode] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Haal de oobCode uit de URL parameters
    const queryParams = new URLSearchParams(location.search)
    const code = queryParams.get("oobCode")
    
    if (!code) {
      setError("Ongeldige of verlopen reset link.")
      return
    }
    
    setOobCode(code)
    
    // Verifieer dat de code geldig is
    const verifyCode = async () => {
      try {
        await verifyPasswordResetCode(auth, code)
        setValidCode(true)
      } catch (err) {
        setError("De reset link is ongeldig of verlopen. Vraag een nieuwe link aan.")
        console.error(err)
      }
    }
    
    verifyCode()
  }, [location])

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    
    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen.")
      return
    }
    
    if (password.length < 6) {
      setError("Wachtwoord moet minimaal 6 tekens bevatten.")
      return
    }
    
    setLoading(true)
    
    try {
      await confirmPasswordReset(auth, oobCode, password)
      setMessage("Je wachtwoord is succesvol gewijzigd. Je kunt nu inloggen met je nieuwe wachtwoord.")
      
      // Redirect naar login pagina na 3 seconden
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err) {
      if (err.code === "auth/expired-action-code") {
        setError("De reset link is verlopen. Vraag een nieuwe link aan.")
      } else {
        setError("Er is een fout opgetreden bij het wijzigen van je wachtwoord. Probeer het later opnieuw.")
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
            <h2>Wachtwoord resetten</h2>
            
            {!validCode && !error && <p>Verificatie link controleren...</p>}
            
            {validCode && (
              <>
                <p>Voer je nieuwe wachtwoord in.</p>
                <form onSubmit={handleResetPassword}>
                  <div className="form-group">
                    <label htmlFor="password">Nieuw wachtwoord</label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Voer je nieuwe wachtwoord in"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Bevestig wachtwoord</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Bevestig je nieuwe wachtwoord"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <button type="submit" disabled={loading}>
                    {loading ? "Bezig..." : "Wachtwoord wijzigen"}
                  </button>
                </form>
              </>
            )}
            
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

export default ResetPassword
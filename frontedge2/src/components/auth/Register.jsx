"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase"
import { Link } from "react-router-dom"

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      alert("Registratie succesvol!")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-container">
      <h2>Registreren</h2>
      <form onSubmit={handleRegister}>
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

        <button type="submit">Registreren</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <p className="auth-redirect">
        Heb je al een account? <Link to="/login">Log hier in</Link>
      </p>
    </div>
  )
}

export default Register

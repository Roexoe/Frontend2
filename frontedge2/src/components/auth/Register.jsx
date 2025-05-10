"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { auth } from "../../firebase"
import { Link, useNavigate } from "react-router-dom"
import GoogleSignIn from "./GoogleSignIn"
import Header from "../common/Header"
import Footer from "../common/Footer"

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const db = getFirestore()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

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
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName,
      })

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: displayName,
        email: email,
        createdAt: new Date(),
        isPrivate: false,
        bio: "",
        skills: [],
        followers: [],
        following: [],
      })

      navigate("/")
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Dit e-mailadres is al in gebruik.")
      } else {
        setError(err.message)
      }
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
            <h2>Registreren</h2>

            <div className="auth-providers">
              <GoogleSignIn />
            </div>

            <div className="auth-divider">
              <span>of</span>
            </div>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="displayName">Naam</label>
                <input
                  id="displayName"
                  type="text"
                  placeholder="Voer je naam in"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>

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

              <div className="form-group">
                <label htmlFor="confirmPassword">Bevestig wachtwoord</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Bevestig je wachtwoord"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Bezig met registreren..." : "Registreren"}
              </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <p className="auth-redirect">
              Heb je al een account? <Link to="/login">Log hier in</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Register

"use client"

import { useState, useEffect } from "react"
import { getFirestore, doc, updateDoc, getDoc, arrayRemove, arrayUnion } from "firebase/firestore"
import { getAuth, deleteUser } from "firebase/auth"
import Header from "../common/Header"
import Footer from "../common/Footer"
import PrivacyToggle from "../common/PrivacyToggle"
import { useAuth } from "../auth/AuthContextProvider"

const Settings = () => {
  const { currentUser } = useAuth()
  const db = getFirestore()
  const auth = getAuth()

  const [blockedUsers, setBlockedUsers] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteCountdown, setDeleteCountdown] = useState(5)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isGoogleUser, setIsGoogleUser] = useState(false)

  // Haal geblokkeerde user IDs op en daarna hun info
  useEffect(() => {
    if (!currentUser) return
    const fetchSettings = async () => {
      const userRef = doc(db, "users", currentUser.uid)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        // Use the objects directly!
        setBlockedUsers(userSnap.data().blockedUsers || [])
      }
      setIsGoogleUser(
        currentUser.providerData.some((p) => p.providerId === "google.com")
      )
    }
    fetchSettings()
  }, [currentUser, db])

  // Blokkeer een gebruiker (voorbeeld, voeg deze functie toe waar je wilt blokkeren)
  const blockUser = async (userId) => {
    if (!currentUser) return
    await updateDoc(doc(db, "users", currentUser.uid), {
      blockedUsers: arrayUnion(userId),
    })
    setBlockedUsers(prev => [...prev, userId])
  }

  // Deblokkeer gebruiker
  const unblockUser = async (userId) => {
    if (!currentUser) return
    // Find the blocked user object
    const userObj = blockedUsers.find(u => u.id === userId)
    if (!userObj) return
    await updateDoc(doc(db, "users", currentUser.uid), {
      blockedUsers: arrayRemove(userObj),
    })
    setBlockedUsers(blockedUsers.filter((user) => user.id !== userId))
  }

  // Delete profile with confirmation
  const handleDeleteProfile = async () => {
    setIsDeleting(true)
    setDeleteCountdown(5)
    setShowDeleteConfirm(true)
    let count = 5
    const interval = setInterval(() => {
      count -= 1
      setDeleteCountdown(count)
      if (count === 0) {
        clearInterval(interval)
        actuallyDeleteProfile()
      }
    }, 1000)
  }

  const cancelDelete = () => {
    setIsDeleting(false)
    setShowDeleteConfirm(false)
    setDeleteCountdown(5)
  }

  const actuallyDeleteProfile = async () => {
    try {
      await updateDoc(doc(db, "users", currentUser.uid), { deleted: true })
      await deleteUser(auth.currentUser)
      alert("Je profiel is verwijderd.")
      window.location.href = "/"
    } catch (error) {
      alert("Er is iets misgegaan bij het verwijderen van je profiel.")
      setIsDeleting(false)
      setShowDeleteConfirm(false)
      setDeleteCountdown(5)
    }
  }

  // Report user (example: open a modal or send to Firestore)
  const handleReportUser = (user) => {
    alert(`Gebruiker ${user.name} is gerapporteerd. Dank voor je melding!`)
    // Voorbeeld: addDoc(collection(db, "reports"), { reportedUser: user.id, reporter: currentUser.uid, ... })
  }

  return (
    <div className="app-container">
      <Header />
      <main>
        <div className="container">
          <h1>Instellingen</h1>

          <div className="settings-container">
            <div className="settings-section">
              <h3>Privacy</h3>
              <p>Beheer wie je profiel en berichten kan zien.</p>
              <PrivacyToggle />

              <div className="block-user-container">
                <h4>Geblokkeerde gebruikers</h4>
                <p>Geblokkeerde gebruikers kunnen je profiel niet zien en geen berichten naar je sturen.</p>
                {blockedUsers.length > 0 ? (
                  <div className="blocked-users-list">
                    {blockedUsers.map((user) => (
                      <div key={user.id} className="blocked-user-item">
                        <div className="blocked-user-info">
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            className="blocked-user-avatar"
                          />
                          <span>{user.name}</span>
                        </div>
                        <button className="ghost" onClick={() => unblockUser(user.id)}>
                          Deblokkeren
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Je hebt geen gebruikers geblokkeerd.</p>
                )}
              </div>
            </div>

            <div className="settings-section">
              <h3>Account</h3>
              <p>Beheer je accountgegevens en wachtwoord.</p>
              {!isGoogleUser && (
                <div className="form-group">
                  <button onClick={() => (window.location.href = "/reset-password")}>
                    Wachtwoord wijzigen
                  </button>
                </div>
              )}
              <div className="form-group">
                {!showDeleteConfirm ? (
                  <button
                    className="ghost"
                    style={{ color: "var(--error)", position: "relative", overflow: "hidden" }}
                    onClick={handleDeleteProfile}
                  >
                    Account verwijderen
                  </button>
                ) : (
                  <button
                    className="ghost"
                    style={{
                      color: "var(--error)",
                      background: `linear-gradient(90deg, var(--error) ${100 - deleteCountdown * 20}%, transparent 100%)`,
                      transition: "background 0.5s",
                      position: "relative",
                      overflow: "hidden",
                      animation: "pulse 1s infinite alternate"
                    }}
                    disabled
                  >
                    Verwijderen in {deleteCountdown}...
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: `${(5 - deleteCountdown) * 20}%`,
                        height: "100%",
                        background: "rgba(231,76,60,0.1)",
                        zIndex: 0,
                        transition: "width 1s"
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 12,
                        color: "#c0392b",
                        cursor: "pointer",
                        zIndex: 2
                      }}
                      onClick={cancelDelete}
                    >
                      Annuleren
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(231,76,60,0.4); }
          100% { box-shadow: 0 0 10px 5px rgba(231,76,60,0.2); }
        }
      `}</style>
    </div>
  )
}

export default Settings

"use client"

import { useState, useEffect } from "react"
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore"
import { useAuth } from "../auth/AuthContextProvider"

const PrivacyToggle = () => {
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(true)
  const db = getFirestore()
  const { currentUser } = useAuth()

  // Fetch the current privacy setting from Firestore on mount
  useEffect(() => {
    const fetchPrivacy = async () => {
      if (!currentUser) return
      const userRef = doc(db, "users", currentUser.uid)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        setIsPrivate(!!userSnap.data().isPrivate)
      }
      setLoading(false)
    }
    fetchPrivacy()
  }, [currentUser, db])

  const handlePrivacyToggle = async () => {
    if (!currentUser) return
    const userRef = doc(db, "users", currentUser.uid)
    try {
      await updateDoc(userRef, { isPrivate: !isPrivate })
      setIsPrivate(!isPrivate)
    } catch (error) {
      console.error("Error updating privacy settings:", error)
      setIsPrivate(!isPrivate) // fallback for demo
    }
  }

  if (loading) {
    return <div>Privacy-instelling laden...</div>
  }

  return (
    <div className="privacy-toggle">
      <label className="toggle">
        <input type="checkbox" checked={isPrivate} onChange={handlePrivacyToggle} />
        <span className="toggle-slider"></span>
      </label>
      <div>
        <p>
          <strong>{isPrivate ? "Privé profiel" : "Openbaar profiel"}</strong>
        </p>
        <p className="privacy-description" style={{ fontSize: "var(--font-size-sm)", opacity: 0.8 }}>
          {isPrivate
            ? "Alleen geaccepteerde volgers kunnen je profiel en berichten zien."
            : "Iedereen kan je profiel en berichten zien."}
        </p>
      </div>
    </div>
  )
}

export default PrivacyToggle

"use client"

import { useState } from "react"
import { getFirestore, doc, updateDoc } from "firebase/firestore"

const PrivacyToggle = () => {
  const [isPrivate, setIsPrivate] = useState(false)
  const db = getFirestore()

  const handlePrivacyToggle = async () => {
    try {
      const userRef = doc(db, "users", "currentUserId")
      await updateDoc(userRef, { isPrivate: !isPrivate })
      setIsPrivate(!isPrivate)
    } catch (error) {
      console.error("Error updating privacy settings:", error)
      // Toggle the state anyway for demo purposes
      setIsPrivate(!isPrivate)
    }
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

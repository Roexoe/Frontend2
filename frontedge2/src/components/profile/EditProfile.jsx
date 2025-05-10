"use client"

import { useState } from "react"
import { getAuth, updateProfile } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const EditProfile = ({ profile, onSave, onCancel }) => {
  const [name, setName] = useState(profile.name || "")
  const [bio, setBio] = useState(profile.bio || "")
  const [avatar, setAvatar] = useState(profile.avatar || "")
  const [newAvatar, setNewAvatar] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const auth = getAuth()
  const db = getFirestore()

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewAvatar(file)
      setAvatar(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would upload the new avatar to storage
      // and get the download URL

      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          // photoURL would be set to the uploaded image URL
        })
      }

      // Update Firestore document
      // const userRef = doc(db, "users", auth.currentUser.uid)
      // await updateDoc(userRef, {
      //   name,
      //   bio,
      //   // avatar: downloadURL from storage
      // })

      // For demo purposes, just update the local state
      onSave({
        name,
        bio,
        avatar,
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Er is een fout opgetreden bij het bijwerken van je profiel.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card">
      <h2>Profiel bewerken</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Profielfoto</label>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-md)" }}>
            <img
              src={avatar || "/placeholder.svg"}
              alt="Profile Avatar"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid var(--primary)",
              }}
            />
            <div className="media-upload-button">
              <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} />
              <label htmlFor="avatar-upload">
                <span>Foto wijzigen</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name">Naam</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Je naam"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Vertel iets over jezelf..."
            rows={4}
          />
        </div>

        <div className="form-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-md)" }}>
          <button type="button" className="ghost" onClick={onCancel} disabled={isSubmitting}>
            Annuleren
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Opslaan..." : "Wijzigingen opslaan"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProfile

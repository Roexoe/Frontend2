"use client"

import { useState } from "react"
import { getAuth } from "firebase/auth"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebase"
import cld from "../../cloudinary" // Update deze import

const PostSkill = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [media, setMedia] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const auth = getAuth()

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files)

    const newMedia = files.map((file) => ({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "other",
    }))

    setMedia([...media, ...newMedia])
  }

  const removeMedia = (id) => {
    const updatedMedia = media.filter((item) => item.id !== id)
    setMedia(updatedMedia)
  }

  // Upload naar Cloudinary in plaats van Firebase Storage
  const uploadToCloudinary = async (file) => {
    // Maak een nieuwe FormData object
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'frontedge_uploads') // Maak dit aan in je Cloudinary dashboard
    
    try {
      // Upload naar Cloudinary via de upload API
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dz59lvb9i/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message)
      }
      
      return {
        url: data.secure_url,
        type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "other",
        publicId: data.public_id // Cloudinary public ID voor eventuele latere bewerkingen
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error)
      throw error
    }
  }

  const handlePost = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    
    const user = auth.currentUser
    if (!user) {
      alert("Je moet ingelogd zijn om een vaardigheid te delen")
      return
    }

    setIsSubmitting(true)

    try {
      // Upload media files to Cloudinary
      const mediaUrls = []
      
      if (media.length > 0) {
        for (const item of media) {
          const mediaData = await uploadToCloudinary(item.file)
          mediaUrls.push(mediaData)
        }
      }
      
      // Save post data to Firestore
      const skillData = {
        title,
        description,
        media: mediaUrls,
        user: {
          id: user.uid,
          name: user.displayName || "Anonymous User",
          avatar: user.photoURL || null
        },
        likes: [],
        comments: 0,
        timestamp: serverTimestamp()
      }
      
      await addDoc(collection(db, "skills"), skillData)

      // Reset form
      setTitle("")
      setDescription("")
      setMedia([])

      alert(`Vaardigheid geplaatst: ${title}`)
    } catch (error) {
      console.error("Error posting skill:", error)
      alert("Er is een fout opgetreden bij het plaatsen van je vaardigheid: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card post-skill-card">
      <h3>Deel een nieuwe vaardigheid</h3>
      <form onSubmit={handlePost}>
        <div className="form-group">
          <label htmlFor="skill-title">Titel</label>
          <input
            id="skill-title"
            type="text"
            placeholder="Wat is je vaardigheid?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="skill-description">Beschrijving</label>
          <textarea
            id="skill-description"
            placeholder="Beschrijf je vaardigheid..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Media toevoegen</label>
          <div className="media-upload-button">
            <input type="file" id="media-upload" accept="image/*,video/*" multiple onChange={handleMediaChange} />
            <label htmlFor="media-upload">
              <span>Foto's of video's toevoegen</span>
            </label>
          </div>

          {media.length > 0 && (
            <div className="media-preview">
              {media.map((item) => (
                <div key={item.id} className="media-preview-item">
                  {item.type === "image" ? (
                    <img src={item.preview || "/placeholder.svg"} alt="Preview" />
                  ) : item.type === "video" ? (
                    <video src={item.preview} />
                  ) : null}
                  <button type="button" className="remove-media" onClick={() => removeMedia(item.id)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions" style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" disabled={isSubmitting || !title.trim()}>
            {isSubmitting ? "Bezig met delen..." : "Delen"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostSkill

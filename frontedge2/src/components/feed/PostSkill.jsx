"use client"

import { useState } from "react"

const PostSkill = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [media, setMedia] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handlePost = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)

    try {
      // Here you would normally upload the media files to storage
      // and save the post data to Firestore

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Reset form
      setTitle("")
      setDescription("")
      setMedia([])

      alert(`Vaardigheid geplaatst: ${title}`)
    } catch (error) {
      console.error("Error posting skill:", error)
      alert("Er is een fout opgetreden bij het plaatsen van je vaardigheid.")
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

"use client"

import { useState } from "react"

const PostSkill = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handlePost = (e) => {
    e.preventDefault()
    alert(`Skill Posted: ${title}`)
    // Reset form
    setTitle("")
    setDescription("")
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
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="secondary">
            Delen
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostSkill

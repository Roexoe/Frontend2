"use client"

import { useState } from "react"

const SkillCard = ({ skill }) => {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Emma Wilson",
      avatar: "/src/assets/skillr-hand.png",
      content: "Dit is echt nuttig! Bedankt voor het delen.",
      timestamp: "1 uur geleden",
    },
    {
      id: 2,
      user: "David Lee",
      avatar: "/src/assets/skillr-hand.png",
      content: "Ik heb hier veel van geleerd. Kun je meer details delen?",
      timestamp: "2 uur geleden",
    },
  ])
  const [newComment, setNewComment] = useState("")

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: comments.length + 1,
      user: "Current User",
      avatar: "/src/assets/skillr-hand.png",
      content: newComment,
      timestamp: "Zojuist",
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  // Format timestamp to relative time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Zojuist"
    } else if (diffInHours === 1) {
      return "1 uur geleden"
    } else if (diffInHours < 24) {
      return `${diffInHours} uur geleden`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="skill-card">
      <div
        className="skill-card-header"
        style={{ display: "flex", alignItems: "center", marginBottom: "var(--space-md)" }}
      >
        <img
          src={skill.userAvatar || "/placeholder.svg"}
          alt={skill.user}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            marginRight: "var(--space-sm)",
          }}
        />
        <div>
          <strong>{skill.user}</strong>
          <div style={{ fontSize: "var(--font-size-sm)", opacity: 0.7 }}>{formatTimestamp(skill.timestamp)}</div>
        </div>
      </div>

      <h3>{skill.title}</h3>
      <p>{skill.description}</p>

      {skill.media && (
        <div className="skill-media">
          {skill.mediaType === "image" ? (
            <img src={skill.media || "/placeholder.svg"} alt={skill.title} />
          ) : skill.mediaType === "video" ? (
            <video src={skill.media} controls />
          ) : null}
        </div>
      )}

      <div className="skill-card-footer">
        <div className="skill-stats" style={{ display: "flex", gap: "var(--space-md)" }}>
          <span>{skill.likes} likes</span>
          <span>{skill.comments} reacties</span>
        </div>
        <div className="skill-actions">
          <button className="ghost">
            <span>Like</span>
          </button>
          <button className="ghost" onClick={toggleComments}>
            <span>Reacties</span>
          </button>
          <button className="ghost">
            <span>Delen</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleAddComment} className="add-comment">
            <img src="/src/assets/skillr-hand.png" alt="Current User" className="add-comment-avatar" />
            <div className="add-comment-input">
              <input
                type="text"
                placeholder="Voeg een reactie toe..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit" disabled={!newComment.trim()}>
                Plaatsen
              </button>
            </div>
          </form>

          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <img src={comment.avatar || "/placeholder.svg"} alt={comment.user} className="comment-avatar" />
                <span className="comment-author">{comment.user}</span>
                <span className="comment-time">{comment.timestamp}</span>
              </div>
              <div className="comment-content">
                <p>{comment.content}</p>
              </div>
              <div className="comment-actions">
                <button className="ghost">Like</button>
                <button className="ghost">Reageren</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SkillCard

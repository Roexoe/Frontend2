"use client"

import { useState, useRef, useEffect } from "react"
import { AdvancedImage } from '@cloudinary/react'
import { fill } from "@cloudinary/url-gen/actions/resize"
import cld from "../../cloudinary"

const SkillCard = ({ skill }) => {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(skill.commentsList || [])
  const [newComment, setNewComment] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimateIn(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

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
    if (!timestamp) return "Onbekend"
    
    try {
      // Als timestamp een Firestore timestamp is (met seconds en nanoseconds)
      if (timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000)
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
      } else {
        return timestamp
      }
    } catch (error) {
      console.error("Error formatting timestamp:", error)
      return "Onbekend"
    }
  }

  // Render media items (Cloudinary or regular URLs)
  const renderMedia = (mediaItem) => {
    if (!mediaItem) return null
    
    console.log("Rendering media item:", mediaItem)  // Debug log

    if (mediaItem.type === "image") {
      // Als het een Cloudinary afbeelding is (met publicId)
      if (mediaItem.publicId) {
        try {
          const image = cld.image(mediaItem.publicId)
          image.resize(fill().width(600).height(400))
          return <AdvancedImage cldImg={image} alt={skill.title} />
        } catch (error) {
          console.error("Error rendering Cloudinary image:", error)
          // Fallback naar gewone img tag
          return <img src={mediaItem.url} alt={skill.title} />
        }
      }
      // Anders gewoon de URL gebruiken
      return <img src={mediaItem.url} alt={skill.title} />
    } else if (mediaItem.type === "video") {
      return <video src={mediaItem.url} controls />
    }
    return null
  }

  return (
    <div
      ref={cardRef}
      className={`skill-card ${animateIn ? "animate-in" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="skill-card-header">
        <img
          src={skill.user?.avatar || "/src/assets/skillr-hand.png"}
          alt={skill.user?.name}
          className="user-avatar"
        />
        <div>
          <strong>{skill.user?.name}</strong>
          <div className="timestamp">{formatTimestamp(skill.timestamp)}</div>
        </div>
      </div>

      <h3>{skill.title}</h3>
      <p>{skill.description}</p>

      {skill.media && skill.media.length > 0 && (
        <div className="skill-media">
          {renderMedia(skill.media[0])}
        </div>
      )}

      <div className="skill-card-footer">
        <div className="skill-stats">
          <span>{skill.likes?.length || 0} likes</span>
          <span>{skill.comments || 0} reacties</span>
        </div>
        <div className="skill-actions">
          <button className={`ghost ${skill.isLiked ? "active" : ""}`}>
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
            <img 
              src="/src/assets/skillr-hand.png" 
              alt="Current User" 
              className="add-comment-avatar" 
            />
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

          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <img src={comment.avatar} alt={comment.user} className="comment-avatar" />
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
            ))
          ) : (
            <p>Nog geen reacties. Wees de eerste!</p>
          )}
        </div>
      )}
    </div>
  )
}

export default SkillCard

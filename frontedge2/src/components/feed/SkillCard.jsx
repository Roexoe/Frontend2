"use client"

import { useState, useRef, useEffect } from "react"
import { AdvancedImage } from '@cloudinary/react'
import { fill } from "@cloudinary/url-gen/actions/resize"
import cld from "../../cloudinary"
// Firebase imports toevoegen
import { doc, getDoc, getFirestore } from "firebase/firestore"
// Importeer de afbeelding
import skillrHandImg from "../../assets/skillr-hand.png"
import { useNavigate } from "react-router-dom";
import EditSkill from "../profile/EditSkill"; // Zorg ervoor dat het pad naar EditSkill correct is

const SkillCard = ({ skill, isOwnProfile, onEdit, onDelete }) => {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(skill.commentsList || [])
  const [newComment, setNewComment] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  const [animateIn, setAnimateIn] = useState(false)
  // Nieuwe state voor avatar
  const [userAvatar, setUserAvatar] = useState(skill.user?.avatar || skillrHandImg)
  const [editingSkill, setEditingSkill] = useState(null); // State voor het bewerken van vaardigheden
  const [media, setMedia] = useState([]); // Nieuwe state voor media
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        if (skill.user?.id) {
          const db = getFirestore()
          const userDoc = await getDoc(doc(db, "users", skill.user.id))
          if (userDoc.exists() && userDoc.data().photoURL) {
            setUserAvatar(userDoc.data().photoURL)
          }
        }
      } catch (error) {
        console.error("Error fetching user avatar:", error)
      }
    }
    
    fetchUserAvatar()
  }, [skill.user?.id])

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: comments.length + 1,
      user: "Current User",
      avatar: skillrHandImg,
      content: newComment,
      timestamp: "Zojuist",
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleSaveSkill = (updatedSkill) => {
    // Logica om de vaardigheid op te slaan (bijv. naar een API of state management)
    console.log("Skill saved:", updatedSkill)
    setEditingSkill(null)
  }

  const handleMediaChange = (newMedia) => {
    setMedia(newMedia);
  };

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

  // Voeg deze functie toe na formatTimestamp
  const getProfileImage = (imageUrl) => {
    if (!imageUrl) return skillrHandImg;
    
    // Controleer of het een cloudinary URL is
    if (typeof imageUrl === 'string' && imageUrl.includes('cloudinary')) {
      try {
        // Creëer een Cloudinary image object
        const cloudinaryImage = cld.image(imageUrl.split('/').pop());
        cloudinaryImage.resize(fill().width(40).height(40));
        return <AdvancedImage cldImg={cloudinaryImage} alt="Profielfoto" />;
      } catch (error) {
        console.error("Error loading Cloudinary image:", error);
        return skillrHandImg;
      }
    }
    
    // Fallback naar normale img voor niet-cloudinary URLs
    return imageUrl;
  };

  // Verbeterde renderMedia functie
  const renderMedia = (mediaItem) => {
    if (!mediaItem) return null;
    
    console.log("Rendering media item:", mediaItem); // Behoud deze log
    
    if (mediaItem.type === "image") {
      // ALTIJD de URL gebruiken als fallback
      return <img src={mediaItem.url} alt={skill.title} className="skill-image" />;
    } else if (mediaItem.type === "video") {
      return <video src={mediaItem.url} controls className="skill-video" />;
    }
    return null;
  };

  // Voeg deze functie toe voor navigatie
  const handleCardClick = (e) => {
    // Controleer of de klik op een knop of een link was
    if (
      e.target.tagName === "BUTTON" || 
      e.target.closest("button") || 
      e.target.tagName === "A" || 
      e.target.closest("a") ||
      e.target.closest(".comments-section")
    ) {
      // Laat de originele handler de klik afhandelen
      return;
    }
    
    // Navigeer naar de detailpagina
    navigate(`/skill/${skill.id}`);
  };

  return (
    <div
      ref={cardRef}
      className={`skill-card ${animateIn ? "animate-in" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick} // Voeg de onClick handler toe
      style={{ cursor: 'pointer' }} // Geef de gebruiker een visuele indicatie dat het klikbaar is
    >
      <div className="skill-card-header">
        {typeof userAvatar === 'string' ? (
          <img
            src={userAvatar}
            alt={skill.user?.name}
            className="user-avatar"
            onError={(e) => { e.target.src = skillrHandImg; }}
          />
        ) : (
          <img
            src={skillrHandImg}
            alt={skill.user?.name}
            className="user-avatar"
          />
        )}
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
        {/* Actieknoppen verwijderd - deze functionaliteit is nu alleen beschikbaar in de detailweergave */}
      </div>

      {isOwnProfile && (
        <div className="skill-actions">
          <button className="ghost edit-button" onClick={onEdit}>
            Bewerken
          </button>
          <button className="ghost delete-button" onClick={onDelete}>
            Verwijderen
          </button>
        </div>
      )}

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleAddComment} className="add-comment">
            <img 
              src={skillrHandImg} 
              alt="Current User" 
              className="add-comment-avatar"
              onError={(e) => { e.target.src = skillrHandImg; }}
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
                  <img 
                    src={comment.avatar || skillrHandImg} 
                    alt={comment.user} 
                    className="comment-avatar"
                    onError={(e) => { e.target.src = skillrHandImg; }}
                  />
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

      {editingSkill && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EditSkill
              skill={editingSkill}
              onSave={handleSaveSkill}
              onCancel={() => setEditingSkill(null)}
              onMediaChange={handleMediaChange}
              media={media}
              setMedia={setMedia}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default SkillCard

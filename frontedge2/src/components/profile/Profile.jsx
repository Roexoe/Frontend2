"use client"

import { useState } from "react"
import Header from "../common/Header"
import Footer from "../common/Footer"
import PrivacyToggle from "../common/PrivacyToggle"
import EditProfile from "./EditProfile"

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Pim Melchers",
    bio: "Passionate about volleyball and jumping higher than the net. Always looking to improve my skills and help others do the same.",
    avatar: "/src/assets/skillr-hand.png",
    stats: {
      skills: 9,
      followers: 1280,
      following: 56,
    },
  })

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleProfileUpdate = (updatedProfile) => {
    setProfile({ ...profile, ...updatedProfile })
    setIsEditing(false)
  }

  return (
    <div className="app-container">
      <Header />
      <main>
        <div className="container">
          {isEditing ? (
            <EditProfile profile={profile} onSave={handleProfileUpdate} onCancel={toggleEdit} />
          ) : (
            <div className="profile">
              <img src={profile.avatar || "/placeholder.svg"} alt="Profile Avatar" className="profile-avatar" />

              <div className="profile-info">
                <h2>{profile.name}</h2>
                <p className="profile-bio">{profile.bio}</p>

                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-value">{profile.stats.skills}</span>
                    <span className="stat-label">Vaardigheden</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{profile.stats.followers}</span>
                    <span className="stat-label">Volgers</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{profile.stats.following}</span>
                    <span className="stat-label">Volgend</span>
                  </div>
                  
                </div>
                <div className="stat-item">
                    <PrivacyToggle />
                  </div>
                
              </div>

              <div className="profile-actions">
                <button onClick={toggleEdit}>Profiel bewerken</button>
                <button className="ghost" onClick={() => (window.location.href = "/settings")}>
                  Instellingen
                </button>
              </div>
            </div>
          )}

          <div className="profile-content">
            <h3>Mijn vaardigheden</h3>
            <div className="feed">
              {/* Profile skills would go here */}
              <div className="skill-card">
                <h3>Web Development</h3>
                <p>HTML, CSS, JavaScript, React, and more. Building responsive and accessible websites.</p>
                <div className="skill-card-footer">
                  <div className="skill-user">
                    <strong>Gedeeld door:</strong> {profile.name}
                  </div>
                  <div className="skill-actions">
                    <button className="ghost">Like</button>
                    <button className="ghost">Reactie</button>
                    <button className="ghost">Delen</button>
                  </div>
                </div>
              </div>

              <div className="skill-card">
                <h3>UI/UX Design</h3>
                <p>Creating user-centered designs with Figma and Adobe XD. Focus on accessibility and usability.</p>
                <div className="skill-card-footer">
                  <div className="skill-user">
                    <strong>Gedeeld door:</strong> {profile.name}
                  </div>
                  <div className="skill-actions">
                    <button className="ghost">Like</button>
                    <button className="ghost">Reactie</button>
                    <button className="ghost">Delen</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Profile

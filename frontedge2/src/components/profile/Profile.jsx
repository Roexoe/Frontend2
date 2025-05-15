"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Header from "../common/Header"
import Footer from "../common/Footer"
import PrivacyToggle from "../common/PrivacyToggle"
import EditProfile from "./EditProfile"
import { useAuth } from "../auth/AuthContextProvider"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { collection, query, where, getDocs } from "firebase/firestore"

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    avatar: "/src/assets/skillr-hand.png",
    stats: {
      skills: 0,
      followers: 0,
      following: 0,
    },
  })
  const [loading, setLoading] = useState(true)
  const [userSkills, setUserSkills] = useState([])

  const { currentUser } = useAuth()
  const { userId } = useParams()
  const db = getFirestore()

  const profileId = userId || (currentUser ? currentUser.uid : null)
  const isOwnProfile = currentUser && (!userId || userId === currentUser.uid)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!profileId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Haal gebruikersgegevens op uit Firestore
        const userRef = doc(db, "users", profileId)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
          const userData = userDoc.data()

          // Haal gebruikersvaardigheden op
          const skillsQuery = query(
              collection(db, "skills"),
              where("userId", "==", profileId)
          )
          const skillsSnapshot = await getDocs(skillsQuery)
          const skills = []
          skillsSnapshot.forEach(doc => {
            skills.push({ id: doc.id, ...doc.data() })
          })

          // Haal followers en following aantallen op (dit is een voorbeeld)
          // In een echte app zou je hiervoor aparte collecties gebruiken

          setProfile({
            name: userData.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || "Gebruiker",
            bio: userData.bio || "Geen biografie beschikbaar",
            avatar: userData.photoURL || currentUser?.photoURL || "/src/assets/skillr-hand.png",
            stats: {
              skills: skills.length,
              followers: userData.followersCount || 0,
              following: userData.followingCount || 0,
            }
          })

          setUserSkills(skills)
        } else if (currentUser) {
          // Als er geen gebruikersdocument is, maar wel een ingelogde gebruiker, gebruik Auth-info
          setProfile({
            name: currentUser.displayName || currentUser.email.split('@')[0],
            bio: "Geen biografie beschikbaar",
            avatar: currentUser.photoURL || "/src/assets/skillr-hand.png",
            stats: {
              skills: 0,
              followers: 0,
              following: 0,
            }
          })
        }
      } catch (error) {
        console.error("Error fetching profile data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [profileId, currentUser, db])

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleProfileUpdate = async (updatedProfile) => {
    setProfile({ ...profile, ...updatedProfile })
    setIsEditing(false)

    // De EditProfile component zal de Firebase updates afhandelen
  }

  if (loading) {
    return (
        <div className="app-container">
          <Header />
          <main>
            <div className="container">
              <div className="loading-spinner">Laden...</div>
            </div>
          </main>
          <Footer />
        </div>
    )
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

                    {isOwnProfile && (
                        <div className="stat-item">
                          <PrivacyToggle />
                        </div>
                    )}
                  </div>

                  {isOwnProfile ? (
                      <div className="profile-actions">
                        <button onClick={toggleEdit}>Profiel bewerken</button>
                        <button className="ghost" onClick={() => (window.location.href = "/settings")}>
                          Instellingen
                        </button>
                      </div>
                  ) : (
                      <div className="profile-actions">
                        <button>Volgen</button>
                        <button className="ghost">Bericht sturen</button>
                      </div>
                  )}
                </div>
            )}

            <div className="profile-content">
              <h3>Vaardigheden</h3>
              <div className="feed">
                {userSkills && userSkills.length > 0 ? (
                    userSkills.map(skill => (
                        <div className="skill-card" key={skill.id}>
                          <h3>{skill.title}</h3>
                          <p>{skill.description}</p>
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
                    ))
                ) : (
                    <div className="empty-state">
                      <p>Geen vaardigheden gedeeld</p>
                      {isOwnProfile && (
                          <button onClick={() => (window.location.href = "/")}>
                            Deel je eerste vaardigheid
                          </button>
                      )}
                    </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  )
}

export default Profile
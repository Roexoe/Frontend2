"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Header from "../common/Header"
import Footer from "../common/Footer"
import { useAuth } from "../auth/AuthContextProvider"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { collection, query, where, getDocs } from "firebase/firestore"

const StrangerProfile = () => {
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
    const [userExists, setUserExists] = useState(false)

    const { currentUser } = useAuth()
    const { userId } = useParams()
    const navigate = useNavigate()
    const db = getFirestore()

    // Redirect to own profile if trying to view your own profile via this route
    useEffect(() => {
        if (currentUser && userId === currentUser.uid) {
            navigate('/profile')
            return
        }
    }, [currentUser, userId, navigate])

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)

                // Fetch user data from Firestore
                const userRef = doc(db, "users", userId)
                const userDoc = await getDoc(userRef)

                if (userDoc.exists()) {
                    const userData = userDoc.data()
                    setUserExists(true)

                    // Fetch user skills
                    const skillsQuery = query(
                        collection(db, "skills"),
                        where("user.id", "==", userId)
                    )
                    const skillsSnapshot = await getDocs(skillsQuery)
                    const skills = []
                    skillsSnapshot.forEach(doc => {
                        skills.push({ id: doc.id, ...doc.data() })
                    })
                    setUserSkills(skills)

                    setProfile({
                        name: userData.displayName || userData.name || userData.email?.split('@')[0] || "Gebruiker",
                        bio: userData.bio || "Geen biografie beschikbaar",
                        avatar: userData.photoURL || userData.avatar || "/src/assets/skillr-hand.png",
                        email: userData.email,
                        stats: {
                            skills: skills.length,
                            followers: userData.followersCount || 0,
                            following: userData.followingCount || 0,
                        }
                    })
                } else {
                    setUserExists(false)
                }
            } catch (error) {
                console.error("Error fetching user profile:", error)
                setUserExists(false)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [userId, db])

    const handleFollowUser = async () => {
        if (!currentUser) {
            alert("Je moet ingelogd zijn om gebruikers te volgen")
            return
        }

        // TODO: Implement follow functionality
        alert("Volg functionaliteit komt binnenkort!")
    }

    const handleSendMessage = async () => {
        if (!currentUser) {
            alert("Je moet ingelogd zijn om berichten te sturen")
            return
        }

        // TODO: Implement messaging functionality
        alert("Bericht functionaliteit komt binnenkort!")
    }

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "Onbekend"

        try {
            if (timestamp.seconds) {
                const date = new Date(timestamp.seconds * 1000)
                return date.toLocaleDateString('nl-NL')
            }
            return timestamp
        } catch (error) {
            return "Onbekend"
        }
    }

    if (loading) {
        return (
            <div className="app-container">
                <Header />
                <main>
                    <div className="container">
                        <div className="loading-spinner">Profiel laden...</div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!userExists) {
        return (
            <div className="app-container">
                <Header />
                <main>
                    <div className="container">
                        <div className="error-state">
                            <h2>Gebruiker niet gevonden</h2>
                            <p>De gebruiker die je zoekt bestaat niet of is niet beschikbaar.</p>
                            <button onClick={() => navigate('/')}>Terug naar hoofdpagina</button>
                        </div>
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
                    <div className="profile">
                        <img
                            src={profile.avatar || "/placeholder.svg"}
                            alt="Profile Avatar"
                            className="profile-avatar"
                        />

                        <div className="profile-info">
                            <h2>{profile.name}</h2>
                            <p className="profile-bio">{profile.bio}</p>
                            {profile.email && (
                                <p className="profile-email">{profile.email}</p>
                            )}

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
                        </div>

                        <div className="profile-actions">
                            <button onClick={handleFollowUser}>Volgen</button>
                            <button className="ghost" onClick={handleSendMessage}>
                                Bericht sturen
                            </button>
                        </div>
                    </div>

                    <div className="profile-content">
                        <h3>Vaardigheden van {profile.name}</h3>
                        <div className="feed">
                            {userSkills && userSkills.length > 0 ? (
                                userSkills.map((skill) => (
                                    <div className="skill-card" key={skill.id}>
                                        <h3>{skill.title}</h3>
                                        <p>{skill.description}</p>
                                        {skill.media && skill.media.length > 0 && (
                                            <div className="skill-media">
                                                {skill.media[0].type === "image" ? (
                                                    <img
                                                        src={skill.media[0].url}
                                                        alt={skill.title}
                                                        className="skill-image"
                                                    />
                                                ) : skill.media[0].type === "video" ? (
                                                    <video
                                                        src={skill.media[0].url}
                                                        controls
                                                        className="skill-video"
                                                    />
                                                ) : null}
                                            </div>
                                        )}
                                        <div className="skill-card-footer">
                                            <div className="skill-user">
                                                <strong>Gedeeld door:</strong> {profile.name}
                                            </div>
                                            <div className="skill-meta">
                                                {skill.timestamp && (
                                                    <span className="skill-date">
                            {formatTimestamp(skill.timestamp)}
                          </span>
                                                )}
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
                                    <p>{profile.name} heeft nog geen vaardigheden gedeeld</p>
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

export default StrangerProfile
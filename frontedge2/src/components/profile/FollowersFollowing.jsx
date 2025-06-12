"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Header from "../common/Header"
import Footer from "../common/Footer"
import { useAuth } from "../auth/AuthContextProvider"
import {
    doc,
    getDoc,
    getFirestore,
    updateDoc,
    arrayUnion,
    arrayRemove,
    increment,
    setDoc
} from "firebase/firestore"

const FollowersFollowing = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [followingStates, setFollowingStates] = useState({})
    const [followLoadingStates, setFollowLoadingStates] = useState({})
    const [profileUser, setProfileUser] = useState(null)

    const { currentUser } = useAuth()
    const { userId, type } = useParams() // type can be 'followers' or 'following'
    const navigate = useNavigate()
    const db = getFirestore()

    const isOwnProfile = !userId || (currentUser && userId === currentUser.uid)
    const targetUserId = userId || currentUser?.uid

    useEffect(() => {
        const fetchUsersData = async () => {
            if (!targetUserId) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)

                // Fetch the profile user's data
                const userRef = doc(db, "users", targetUserId)
                const userDoc = await getDoc(userRef)

                if (!userDoc.exists()) {
                    setLoading(false)
                    return
                }

                const userData = userDoc.data()
                setProfileUser({
                    id: targetUserId,
                    name: userData.displayName || userData.name || userData.email?.split('@')[0] || "Gebruiker",
                    avatar: userData.photoURL || userData.avatar || "/src/assets/skillr-hand.png"
                })

                // Get the list of user IDs based on type
                const userIds = type === 'followers'
                    ? userData.followers || []
                    : userData.following || []

                if (userIds.length === 0) {
                    setUsers([])
                    setLoading(false)
                    return
                }

                // Fetch details for each user
                const usersData = []
                const followingStatesTemp = {}

                for (const uid of userIds) {
                    try {
                        const userDocRef = doc(db, "users", uid)
                        const userDocSnap = await getDoc(userDocRef)

                        if (userDocSnap.exists()) {
                            const data = userDocSnap.data()
                            usersData.push({
                                id: uid,
                                name: data.displayName || data.name || data.email?.split('@')[0] || "Gebruiker",
                                bio: data.bio || "Geen biografie beschikbaar",
                                avatar: data.photoURL || data.avatar || "/src/assets/skillr-hand.png",
                                followersCount: data.followersCount || 0
                            })

                            // Check if current user follows this user
                            if (currentUser && uid !== currentUser.uid) {
                                const followers = data.followers || []
                                followingStatesTemp[uid] = followers.includes(currentUser.uid)
                            }
                        }
                    } catch (error) {
                        console.error(`Error fetching user ${uid}:`, error)
                    }
                }

                setUsers(usersData)
                setFollowingStates(followingStatesTemp)
            } catch (error) {
                console.error("Error fetching users data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsersData()
    }, [targetUserId, type, db, currentUser])

    const handleFollowUser = async (userId) => {
        if (!currentUser) {
            alert("Je moet ingelogd zijn om gebruikers te volgen")
            return
        }

        if (followLoadingStates[userId] || userId === currentUser.uid) return

        setFollowLoadingStates(prev => ({ ...prev, [userId]: true }))

        try {
            const targetUserRef = doc(db, "users", userId)
            const currentUserRef = doc(db, "users", currentUser.uid)

            // Ensure current user document exists
            const currentUserDoc = await getDoc(currentUserRef)
            if (!currentUserDoc.exists()) {
                await setDoc(currentUserRef, {
                    displayName: currentUser.displayName || currentUser.email?.split('@')[0] || "Gebruiker",
                    email: currentUser.email,
                    photoURL: currentUser.photoURL || null,
                    bio: "",
                    followersCount: 0,
                    followingCount: 0,
                    followers: [],
                    following: []
                })
            }

            const isCurrentlyFollowing = followingStates[userId]

            if (isCurrentlyFollowing) {
                // Unfollow
                await updateDoc(targetUserRef, {
                    followers: arrayRemove(currentUser.uid),
                    followersCount: increment(-1)
                })

                await updateDoc(currentUserRef, {
                    following: arrayRemove(userId),
                    followingCount: increment(-1)
                })

                setFollowingStates(prev => ({ ...prev, [userId]: false }))

                // Update followers count in users list
                setUsers(prev => prev.map(user =>
                    user.id === userId
                        ? { ...user, followersCount: user.followersCount - 1 }
                        : user
                ))

                console.log("User unfollowed successfully")
            } else {
                // Follow
                await updateDoc(targetUserRef, {
                    followers: arrayUnion(currentUser.uid),
                    followersCount: increment(1)
                })

                await updateDoc(currentUserRef, {
                    following: arrayUnion(userId),
                    followingCount: increment(1)
                })

                setFollowingStates(prev => ({ ...prev, [userId]: true }))

                // Update followers count in users list
                setUsers(prev => prev.map(user =>
                    user.id === userId
                        ? { ...user, followersCount: user.followersCount + 1 }
                        : user
                ))

                console.log("User followed successfully")
            }
        } catch (error) {
            console.error("Error updating follow status:", error)
            alert("Er is een fout opgetreden bij het bijwerken van de volg-status")
        } finally {
            setFollowLoadingStates(prev => ({ ...prev, [userId]: false }))
        }
    }

    const handleUserClick = (userId) => {
        if (currentUser && userId === currentUser.uid) {
            navigate('/profile')
        } else {
            navigate(`/profile/${userId}`)
        }
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

    if (!profileUser) {
        return (
            <div className="app-container">
                <Header />
                <main>
                    <div className="container">
                        <div className="error-state">
                            <h2>Gebruiker niet gevonden</h2>
                            <p>De gebruiker die je zoekt bestaat niet.</p>
                            <button onClick={() => navigate('/')}>Terug naar hoofdpagina</button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const title = type === 'followers' ? 'Volgers' : 'Volgenden'
    const emptyMessage = type === 'followers'
        ? `${isOwnProfile ? 'Je hebt' : `${profileUser.name} heeft`} nog geen volgers`
        : `${isOwnProfile ? 'Je volgt' : `${profileUser.name} volgt`} nog niemand`

    return (
        <div className="app-container">
            <Header />
            <main>
                <div className="container">
                    <div className="followers-following-header">
                        <button
                            className="back-button ghost"
                            onClick={() => navigate(-1)}
                        >
                            ← Terug
                        </button>
                        <h2>{title} van {profileUser.name}</h2>
                    </div>

                    <div className="users-list">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <div className="user-card" key={user.id}>
                                    <div
                                        className="user-info"
                                        onClick={() => handleUserClick(user.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src={user.avatar || "/placeholder.svg"}
                                            alt={user.name}
                                            className="user-avatar"
                                        />
                                        <div className="user-details">
                                            <h3>{user.name}</h3>
                                            <p className="user-bio">{user.bio}</p>
                                            <span className="followers-count">
                                                {user.followersCount} volgers
                                            </span>
                                        </div>
                                    </div>

                                    {currentUser && user.id !== currentUser.uid && (
                                        <div className="user-actions">
                                            <button
                                                onClick={() => handleFollowUser(user.id)}
                                                disabled={followLoadingStates[user.id]}
                                                className={followingStates[user.id] ? "following" : ""}
                                            >
                                                {followLoadingStates[user.id]
                                                    ? "Laden..."
                                                    : followingStates[user.id]
                                                        ? "Ontvolgen"
                                                        : "Volgen"
                                                }
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>{emptyMessage}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default FollowersFollowing
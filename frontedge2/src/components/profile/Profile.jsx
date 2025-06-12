"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "../common/Header"
import Footer from "../common/Footer"
import PrivacyToggle from "../common/PrivacyToggle"
import EditProfile from "./EditProfile"
import { useAuth } from "../auth/AuthContextProvider"
import {
  doc,
  getDoc,
  getFirestore,
  deleteDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  setDoc
} from "firebase/firestore"
import { collection, query, where, getDocs } from "firebase/firestore"
import SkillCard from "../feed/SkillCard"; // Voeg deze import toe
import EditSkill from "./EditSkill"; // Zorg ervoor dat je het juiste pad naar EditSkill opgeeft

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
  const [editingSkill, setEditingSkill] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [userExists, setUserExists] = useState(true)
  const [isOwnProfile, setIsOwnProfile] = useState(true)

  const { currentUser } = useAuth()
  const { userId } = useParams() // Get userId from URL params if viewing another user's profile
  const navigate = useNavigate()
  const db = getFirestore()

  // Determine which user we're viewing
  const profileUserId = userId || currentUser?.uid

  // Check if viewing own profile
  useEffect(() => {
    setIsOwnProfile(!userId || (currentUser && userId === currentUser.uid))
  }, [userId, currentUser])

  // Redirect to login if not authenticated and trying to view own profile
  useEffect(() => {
    if (!userId && !currentUser) {
      navigate('/login')
      return
    }
  }, [currentUser, navigate, userId])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!profileUserId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Fetch user data from Firestore
        const userRef = doc(db, "users", profileUserId)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUserExists(true)

          // Fetch user skills
          const skillsQuery = query(
              collection(db, "skills"),
              where("user.id", "==", profileUserId)
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

          // Check if current user is following this user (only if not own profile)
          if (currentUser && !isOwnProfile) {
            const followers = userData.followers || []
            setIsFollowing(followers.includes(currentUser.uid))
          }
        } else if (isOwnProfile && currentUser) {
          // If viewing own profile and no Firestore doc exists, use Auth info
          const skillsQuery = query(
              collection(db, "skills"),
              where("user.id", "==", currentUser.uid)
          )
          const skillsSnapshot = await getDocs(skillsQuery)
          const skills = []
          skillsSnapshot.forEach(doc => {
            skills.push({ id: doc.id, ...doc.data() })
          })
          setUserSkills(skills)

          setProfile({
            name: currentUser.displayName || currentUser.email.split('@')[0],
            bio: "Geen biografie beschikbaar",
            avatar: currentUser.photoURL || "/src/assets/skillr-hand.png",
            stats: {
              skills: skills.length,
              followers: 0,
              following: 0,
            }
          })
        } else {
          setUserExists(false)
        }
      } catch (error) {
        console.error("Error fetching profile data:", error)
        if (!isOwnProfile) {
          setUserExists(false)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [profileUserId, db, currentUser, isOwnProfile])

  const handleFollowUser = async () => {
    if (!currentUser) {
      alert("Je moet ingelogd zijn om gebruikers te volgen")
      return
    }

    if (followLoading || isOwnProfile) return

    setFollowLoading(true)

    try {
      const targetUserRef = doc(db, "users", profileUserId)
      const currentUserRef = doc(db, "users", currentUser.uid)

      // Ensure both user documents exist
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

      if (isFollowing) {
        // Unfollow
        await updateDoc(targetUserRef, {
          followers: arrayRemove(currentUser.uid),
          followersCount: increment(-1)
        })

        await updateDoc(currentUserRef, {
          following: arrayRemove(profileUserId),
          followingCount: increment(-1)
        })

        setIsFollowing(false)
        setProfile(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            followers: prev.stats.followers - 1
          }
        }))

        console.log("User unfollowed successfully")
      } else {
        // Follow
        await updateDoc(targetUserRef, {
          followers: arrayUnion(currentUser.uid),
          followersCount: increment(1)
        })

        await updateDoc(currentUserRef, {
          following: arrayUnion(profileUserId),
          followingCount: increment(1)
        })

        setIsFollowing(true)
        setProfile(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            followers: prev.stats.followers + 1
          }
        }))

        console.log("User followed successfully")
      }
    } catch (error) {
      console.error("Error updating follow status:", error)
      alert("Er is een fout opgetreden bij het bijwerken van de volg-status")
    } finally {
      setFollowLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!currentUser) {
      alert("Je moet ingelogd zijn om berichten te sturen")
      return
    }

    // TODO: Implement messaging functionality
    alert("Bericht functionaliteit komt binnenkort!")
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleStatsClick = (type) => {
    const targetUserId = userId || currentUser?.uid
    if (type === 'followers' || type === 'following') {
      navigate(`/profile/${targetUserId}/${type}`)
    }
  }

  const handleProfileUpdate = async (updatedProfile) => {
    setProfile({ ...profile, ...updatedProfile })
    setIsEditing(false)
  }

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Weet je zeker dat je deze vaardigheid wilt verwijderen?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "skills", skillId));
      setUserSkills(userSkills.filter((skill) => skill.id !== skillId));
      alert("Vaardigheid succesvol verwijderd.");
    } catch (error) {
      console.error("Error bij het verwijderen van de vaardigheid:", error);
      alert("Er is een fout opgetreden bij het verwijderen van de vaardigheid.");
    }
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    setMedia(skill.media || []);
  };

  const handleSaveSkill = async (updatedSkill) => {
    try {
      let mediaToSave = updatedSkill.media;

      const hasNewMedia = updatedSkill.media &&
          updatedSkill.media.length > 0 &&
          (updatedSkill.media[0].url.startsWith('blob:') || !updatedSkill.media[0].publicId);

      if (hasNewMedia) {
        console.log("Nieuwe media gedetecteerd, uploaden naar Cloudinary...");

        if (!media || media.length === 0) {
          alert("Geen bestand gevonden om te uploaden.");
          return;
        }

        const file = media[0].file;
        if (!file) {
          alert("Geen geldig bestand gevonden.");
          return;
        }

        const uploadedMedia = await uploadToCloudinary(file);
        mediaToSave = [uploadedMedia];
      }

      const skillRef = doc(db, "skills", updatedSkill.id);
      await updateDoc(skillRef, {
        title: updatedSkill.title,
        description: updatedSkill.description,
        media: mediaToSave,
      });

      setUserSkills((prevSkills) =>
          prevSkills.map((skill) =>
              skill.id === updatedSkill.id ? {...updatedSkill, media: mediaToSave} : skill
          )
      );

      alert("Vaardigheid succesvol bijgewerkt.");
      setEditingSkill(null);
    } catch (error) {
      console.error("Error bij het bijwerken van de vaardigheid:", error);
      alert("Er is een fout opgetreden bij het bijwerken van de vaardigheid.");
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newMedia = [{
      id: Date.now(),
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
      file: file
    }];

    setMedia(newMedia);

    if (editingSkill) {
      setEditingSkill({
        ...editingSkill,
        media: [{
          url: URL.createObjectURL(file),
          type: file.type.startsWith("image/") ? "image" : "video"
        }]
      });
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "frontedge_uploads");

    try {
      const response = await fetch(
          `https://api.cloudinary.com/v1_1/dz59lvb9i/auto/upload`,
          {
            method: "POST",
            body: formData,
          }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return {
        url: data.secure_url,
        type: file.type.startsWith("image/") ? "image" : "video",
        publicId: data.public_id,
      };
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (!currentUser) {
      alert("Je moet ingelogd zijn om een vaardigheid te delen");
      return;
    }

    setIsSubmitting(true);

    try {
      const mediaUrls = [];

      if (media.length > 0) {
        for (const item of media) {
          const mediaData = await uploadToCloudinary(item.file);
          mediaUrls.push(mediaData);
        }
      }

      const skillData = {
        title,
        description,
        media: mediaUrls,
        user: {
          id: currentUser.uid,
          name: currentUser.displayName || "Anonymous User",
          avatar: currentUser.photoURL || null,
        },
        likes: [],
        comments: 0,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "skills"), skillData);

      setTitle("");
      setDescription("");
      setMedia([]);

      alert(`Vaardigheid geplaatst: ${title}`);
    } catch (error) {
      console.error("Error posting skill:", error);
      alert("Er is een fout opgetreden bij het plaatsen van je vaardigheid.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMedia = (mediaId) => {
    setMedia(media.filter(item => item.id !== mediaId));
  };

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
              <div className="loading-spinner">Laden...</div>
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

  if (!isOwnProfile && !currentUser) {
    return (
        <div className="app-container">
          <Header />
          <main>
            <div className="container">
              <div className="error-state">
                <h2>Toegang geweigerd</h2>
                <p>Je moet ingelogd zijn om profielen te bekijken.</p>
                <button onClick={() => navigate('/login')}>Inloggen</button>
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
            {isEditing && isOwnProfile ? (
                <EditProfile profile={profile} onSave={handleProfileUpdate} onCancel={toggleEdit} />
            ) : (
                <div className="profile">
                  <img src={profile.avatar || "/placeholder.svg"} alt="Profile Avatar" className="profile-avatar" />

                  <div className="profile-info">
                    <h2>{profile.name}</h2>
                    <p className="profile-bio">{profile.bio}</p>
                    {profile.email && !isOwnProfile && (
                        <p className="profile-email">{profile.email}</p>
                    )}

                    <div className="profile-stats">
                      <div
                          className="stat-item clickable"
                          onClick={() => handleStatsClick('skills')}
                      >
                        <span className="stat-value">{profile.stats.skills}</span>
                        <span className="stat-label">Vaardigheden</span>
                      </div>
                      <div
                          className="stat-item clickable"
                          onClick={() => handleStatsClick('followers')}
                      >
                        <span className="stat-value">{profile.stats.followers}</span>
                        <span className="stat-label">Volgers</span>
                      </div>
                      <div
                          className="stat-item clickable"
                          onClick={() => handleStatsClick('following')}
                      >
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

                  <div className="profile-actions">
                    {isOwnProfile ? (
                        <>
                          <button onClick={toggleEdit}>Profiel bewerken</button>
                          <button className="ghost" onClick={() => navigate("/settings")}>
                            Instellingen
                          </button>
                        </>
                    ) : (
                        <>
                          {currentUser && (
                              <button
                                  onClick={handleFollowUser}
                                  disabled={followLoading}
                                  className={isFollowing ? "following" : ""}
                              >
                                {followLoading
                                    ? "Laden..."
                                    : isFollowing
                                        ? "Ontvolgen"
                                        : "Volgen"
                                }
                              </button>
                          )}
                          <button className="ghost" onClick={handleSendMessage}>
                            Bericht sturen
                          </button>
                        </>
                    )}
                  </div>
                </div>
            )}

              {editingSkill && isOwnProfile ? (
                  <EditSkill
                      skill={editingSkill}
                      onSave={handleSaveSkill}
                      onCancel={() => setEditingSkill(null)}
                      onMediaChange={handleMediaChange}
                      media={media}
                      setMedia={setMedia}
                  />
              ) : (
                  <div className="profile-content">
                      <h3>{isOwnProfile ? "Mijn Vaardigheden" : `Vaardigheden van ${profile.name}`}</h3>
                      <div className="feed">
                          {userSkills && userSkills.length > 0 ? (
                              userSkills.map((skill) => (
                                  <SkillCard
                                      key={skill.id}
                                      skill={skill}
                                      isOwnProfile={isOwnProfile}
                                      profileName={profile.name}
                                      onEdit={() => handleEditSkill(skill)}
                                      onDelete={() => handleDeleteSkill(skill.id)}
                                  />
                              ))
                          ) : (
                              <div className="empty-state">
                                  <p>
                                      {isOwnProfile
                                          ? "Geen vaardigheden gedeeld"
                                          : `${profile.name} heeft nog geen vaardigheden gedeeld`}
                                  </p>
                                  {isOwnProfile && (
                                      <button onClick={() => navigate("/")}>
                                          Deel je eerste vaardigheid
                                      </button>
                                  )}
                              </div>
                          )}
                      </div>
                  </div>
              )}
          </div>
        </main>
        <Footer />
      </div>
  )
}

export default Profile

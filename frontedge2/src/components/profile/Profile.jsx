"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../common/Header"
import Footer from "../common/Footer"
import PrivacyToggle from "../common/PrivacyToggle"
import EditProfile from "./EditProfile"
import { useAuth } from "../auth/AuthContextProvider"
import { doc, getDoc, getFirestore, deleteDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore"
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
  const [editingSkill, setEditingSkill] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const db = getFirestore()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }
  }, [currentUser, navigate])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Haal gebruikersgegevens op uit Firestore
        const userRef = doc(db, "users", currentUser.uid)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
          const userData = userDoc.data()

          // Haal gebruikersvaardigheden op
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
            name: userData.displayName || currentUser.displayName || currentUser.email?.split('@')[0] || "Gebruiker",
            bio: userData.bio || "Geen biografie beschikbaar",
            avatar: userData.photoURL || currentUser.photoURL || "/src/assets/skillr-hand.png",
            stats: {
              skills: skills.length,
              followers: userData.followersCount || 0,
              following: userData.followingCount || 0,
            }
          })
        } else {
          // Als er geen gebruikersdocument is, gebruik Auth-info
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
        }
      } catch (error) {
        console.error("Error fetching profile data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [currentUser, db])

  const toggleEdit = () => {
    setIsEditing(!isEditing)
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

  if (!currentUser) {
    return (
        <div className="app-container">
          <Header />
          <main>
            <div className="container">
              <div className="error-state">
                <h2>Toegang geweigerd</h2>
                <p>Je moet ingelogd zijn om je profiel te bekijken.</p>
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
                    <button className="ghost" onClick={() => navigate("/settings")}>
                      Instellingen
                    </button>
                  </div>
                </div>
            )}

            <div className="profile-content">
              <h3>Mijn Vaardigheden</h3>
              <div className="feed">
                {userSkills && userSkills.length > 0 ? (
                    userSkills.map((skill) => (
                        <div className="skill-card" key={skill.id}>
                          <h3>{skill.title}</h3>
                          <p>{skill.description}</p>
                          {skill.media && skill.media.length > 0 && (
                              <div className="skill-media">
                                {skill.media[0].type === "image" ? (
                                    <img src={skill.media[0].url} alt={skill.title} className="skill-image" />
                                ) : skill.media[0].type === "video" ? (
                                    <video src={skill.media[0].url} controls className="skill-video" />
                                ) : null}
                              </div>
                          )}
                          <div className="skill-card-footer">
                            <div className="skill-user">
                              <strong>Gedeeld door:</strong> {profile.name}
                            </div>
                            <div className="skill-actions">
                              <button className="ghost">Like</button>
                              <button className="ghost">Reactie</button>
                              <button className="ghost">Delen</button>
                              <button
                                  className="ghost edit-button"
                                  onClick={() => handleEditSkill(skill)}
                              >
                                Bewerken
                              </button>
                              <button
                                  className="ghost delete-button"
                                  onClick={() => handleDeleteSkill(skill.id)}
                              >
                                Verwijderen
                              </button>
                            </div>
                          </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                      <p>Geen vaardigheden gedeeld</p>
                      <button onClick={() => navigate("/")}>
                        Deel je eerste vaardigheid
                      </button>
                    </div>
                )}
              </div>
            </div>

            {editingSkill && (
                <div className="edit-skill-form">
                  <h3>Vaardigheid bewerken</h3>
                  <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveSkill(editingSkill);
                      }}
                  >
                    <div className="form-group">
                      <label htmlFor="edit-title">Titel</label>
                      <input
                          id="edit-title"
                          type="text"
                          value={editingSkill.title}
                          onChange={(e) =>
                              setEditingSkill({ ...editingSkill, title: e.target.value })
                          }
                          required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="edit-description">Beschrijving</label>
                      <input
                          id="edit-description"
                          value={editingSkill.description}
                          onChange={(e) =>
                              setEditingSkill({ ...editingSkill, description: e.target.value })
                          }
                          rows={4}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="media-upload" className="media-upload-button">
                        Kies een bestand
                        <input
                            type="file"
                            id="media-upload"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleMediaChange}
                        />
                      </label>
                      {media.length > 0 && (
                          <div className="media-preview">
                            {media.map((item) => (
                                <div key={item.id} className="media-preview-item">
                                  {item.type === "image" ? (
                                      <img src={item.preview || "/placeholder.svg"} alt="Preview" />
                                  ) : item.type === "video" ? (
                                      <video src={item.preview} controls />
                                  ) : null}
                                  <button
                                      type="button"
                                      className="remove-media"
                                      onClick={() => removeMedia(item.id)}
                                  >
                                    ×
                                  </button>
                                </div>
                            ))}
                          </div>
                      )}
                    </div>

                    <div className="form-actions">
                      <button type="button" className="ghost" onClick={() => setEditingSkill(null)}>
                        Annuleren
                      </button>
                      <button type="submit">Opslaan</button>
                    </div>
                  </form>
                </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
  )
}

export default Profile
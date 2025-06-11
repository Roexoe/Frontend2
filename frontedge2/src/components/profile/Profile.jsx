"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Header from "../common/Header"
import Footer from "../common/Footer"
import PrivacyToggle from "../common/PrivacyToggle"
import EditProfile from "./EditProfile"
import { useAuth } from "../auth/AuthContextProvider"
import { doc, getDoc, getFirestore, deleteDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore"
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
            where("user.id", "==", profileId) // Zorg ervoor dat dit overeenkomt met hoe je de gebruiker opslaat in Firestore
          )
          const skillsSnapshot = await getDocs(skillsQuery)
          const skills = []
          skillsSnapshot.forEach(doc => {
            skills.push({ id: doc.id, ...doc.data() })
          })
          setUserSkills(skills)

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

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Weet je zeker dat je deze vaardigheid wilt verwijderen?")) {
      return;
    }
  
    try {
      // Verwijder de vaardigheid uit Firestore
      await deleteDoc(doc(db, "skills", skillId));
  
      // Verwijder de vaardigheid uit de lokale staat
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
      
      // Controleer of er nieuwe afbeeldingen zijn (die beginnen met "blob:")
      const hasNewMedia = updatedSkill.media && 
        updatedSkill.media.length > 0 && 
        (updatedSkill.media[0].url.startsWith('blob:') || !updatedSkill.media[0].publicId);
      
      // Als er nieuwe media is, upload deze eerst naar Cloudinary
      if (hasNewMedia) {
        console.log("Nieuwe media gedetecteerd, uploaden naar Cloudinary...");
        
        // Haal het file-object op uit je state
        if (!media || media.length === 0) {
          alert("Geen bestand gevonden om te uploaden.");
          return;
        }
        
        const file = media[0].file; // Neem aan dat media[0].file bestaat
        if (!file) {
          alert("Geen geldig bestand gevonden.");
          return;
        }
        
        // Upload naar Cloudinary
        const uploadedMedia = await uploadToCloudinary(file);
        mediaToSave = [uploadedMedia];
      }
  
      // Update Firestore met de nieuwe media
      const skillRef = doc(db, "skills", updatedSkill.id);
      await updateDoc(skillRef, {
        title: updatedSkill.title,
        description: updatedSkill.description,
        media: mediaToSave,
      });
  
      // Update de lokale staat
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
  
    // Maak een nieuw media-item met preview en het originele file-object
    const newMedia = [{
      id: Date.now(),
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
      file: file // Bewaar het file-object voor latere upload
    }];
  
    // Update de media state
    setMedia(newMedia);
    
    // Update ook editingSkill als dat bestaat
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
    formData.append("upload_preset", "frontedge_uploads"); // Zorg dat dit overeenkomt met je Cloudinary dashboard
  
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
  
    const user = auth.currentUser;
    if (!user) {
      alert("Je moet ingelogd zijn om een vaardigheid te delen");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      // Upload media files to Cloudinary
      const mediaUrls = [];
  
      if (media.length > 0) {
        for (const item of media) {
          const mediaData = await uploadToCloudinary(item.file);
          mediaUrls.push(mediaData);
        }
      }
  
      // Save post data to Firestore
      const skillData = {
        title,
        description,
        media: mediaUrls,
        user: {
          id: user.uid,
          name: user.displayName || "Anonymous User",
          avatar: user.photoURL || null,
        },
        likes: [],
        comments: 0,
        timestamp: serverTimestamp(),
      };
  
      await addDoc(collection(db, "skills"), skillData);
  
      // Reset form
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

            {editingSkill ? (
              <EditSkill
                skill={editingSkill}
                onSave={handleSaveSkill}
                onCancel={() => setEditingSkill(null)}
                onMediaChange={handleMediaChange}
                media={media}
                setMedia={setMedia}
              />
            ) : (
              <>
                <div className="profile-content">
                  <h3>Vaardigheden</h3>
                  <div className="feed">
                    {userSkills && userSkills.length > 0 ? (
                      userSkills.map((skill) => (
                        <SkillCard
                          key={skill.id}
                          skill={skill}
                          isOwnProfile={isOwnProfile}
                          onEdit={() => handleEditSkill(skill)}
                          onDelete={() => handleDeleteSkill(skill.id)}
                        />
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
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
  )
}

export default Profile

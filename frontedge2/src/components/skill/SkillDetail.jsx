import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from "firebase/firestore";
import { auth } from "../../firebase"; // Zorg ervoor dat je auth importeert van je firebase configuratie
import Header from "../common/Header";
import Footer from "../common/Footer";
import skillrHandImg from "../../assets/skillr-hand.png";

const SkillDetail = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const db = getFirestore();
        const skillRef = doc(db, "skills", skillId);
        const skillDoc = await getDoc(skillRef);

        if (skillDoc.exists()) {
          const skillData = { id: skillDoc.id, ...skillDoc.data() };

          // Check of de huidige gebruiker deze skill heeft geliked
          if (auth.currentUser) {
            skillData.isLiked = skillData.likes && skillData.likes.includes(auth.currentUser.uid);
          }

          setSkill(skillData);
          setComments(skillData.commentsList || []);

          // Haal avatar op van de maker
          if (skillData.user?.id) {
            const userDoc = await getDoc(doc(db, "users", skillData.user.id));
            if (userDoc.exists() && userDoc.data().photoURL) {
              setUserAvatar(userDoc.data().photoURL);
            } else {
              setUserAvatar(skillData.user?.avatar || skillrHandImg);
            }
          }
        } else {
          setError("Vaardigheid niet gevonden");
        }
      } catch (err) {
        setError("Fout bij het ophalen van de vaardigheid: " + err.message);
        console.error("Error fetching skill:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [skillId]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Onbekend";

    try {
      if (timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
          return "Zojuist";
        } else if (diffInHours === 1) {
          return "1 uur geleden";
        } else if (diffInHours < 24) {
          return `${diffInHours} uur geleden`;
        } else {
          return date.toLocaleDateString();
        }
      } else {
        return timestamp;
      }
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Onbekend";
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Je moet ingelogd zijn om te reageren");
      return;
    }

    try {
      const db = getFirestore();
      const skillRef = doc(db, "skills", skillId);

      // Maak het timestamp handmatig aan (huidige tijd) in plaats van serverTimestamp()
      const now = new Date();

      // Maak het commentaarobject aan
      const commentData = {
        id: Date.now().toString(),
        userId: currentUser.uid,
        user: currentUser.displayName || "Anonieme gebruiker",
        avatar: currentUser.photoURL || skillrHandImg,
        content: newComment,
        timestamp: {
          seconds: Math.floor(now.getTime() / 1000),
          nanoseconds: 0
        }
      };

      // Lokale weergave met huidige tijdstip voor directe UI feedback
      const localComment = {
        ...commentData,
        timestamp: "Zojuist",
      };

      // Update Firestore - haal eerst de huidige gegevens op
      const skillDoc = await getDoc(skillRef);
      if (skillDoc.exists()) {
        const currentData = skillDoc.data();
        const updatedCommentsList = [commentData, ...(currentData.commentsList || [])];

        await updateDoc(skillRef, {
          commentsList: updatedCommentsList,
          comments: updatedCommentsList.length,
          lastUpdateTimestamp: serverTimestamp() // Dit is prima, want het is niet in een array
        });

        // Update lokale states
        setComments([localComment, ...comments]);
        setSkill({
          ...skill,
          commentsList: [localComment, ...(skill.commentsList || [])],
          comments: (skill.comments || 0) + 1
        });
      }

      setNewComment("");
    } catch (error) {
      console.error("Error bij het toevoegen van commentaar:", error);
      alert("Er is een fout opgetreden bij het plaatsen van je reactie.");
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Navigeer terug naar het vorige scherm
  };

  // Functie om naar profiel te navigeren
  const handleProfileClick = (userId) => {
    if (!userId) return;

    // Check of het de huidige gebruiker is
    if (auth.currentUser && userId === auth.currentUser.uid) {
      navigate('/profile');
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  const renderMedia = (mediaItem) => {
    if (!mediaItem) return null;

    if (mediaItem.type === "image") {
      return <img src={mediaItem.url} alt={skill.title} className="skill-detail-image" />;
    } else if (mediaItem.type === "video") {
      return <video src={mediaItem.url} controls className="skill-detail-video" />;
    }
    return null;
  };

  const handleLike = async () => {
    try {
      const db = getFirestore();
      const skillRef = doc(db, "skills", skillId);
      const currentUserId = auth.currentUser?.uid;

      if (!currentUserId) {
        // Gebruiker is niet ingelogd, toon melding of redirect naar login
        alert("Je moet ingelogd zijn om een vaardigheid leuk te vinden");
        return;
      }

      // Check of de gebruiker de skill al heeft geliked
      const isLiked = skill.likes && skill.likes.includes(currentUserId);

      if (isLiked) {
        // Unlike: verwijder de gebruiker uit de likes array
        await updateDoc(skillRef, {
          likes: arrayRemove(currentUserId)
        });
        // Update lokale state
        setSkill({
          ...skill,
          likes: skill.likes.filter(id => id !== currentUserId),
          isLiked: false
        });
      } else {
        // Like: voeg de gebruiker toe aan de likes array
        await updateDoc(skillRef, {
          likes: arrayUnion(currentUserId)
        });
        // Update lokale state
        setSkill({
          ...skill,
          likes: [...(skill.likes || []), currentUserId],
          isLiked: true
        });
      }
    } catch (error) {
      console.error("Error bij het liken van vaardigheid:", error);
    }
  };

  if (loading) {
    return (
        <div className="app-container">
          <Header />
          <main>
            <div className="container">
              <p>Vaardigheid wordt geladen...</p>
            </div>
          </main>
          <Footer />
        </div>
    );
  }

  if (error) {
    return (
        <div className="app-container">
          <Header />
          <main>
            <div className="container">
              <p className="error-message">{error}</p>
              <button onClick={handleBackClick} className="back-button">Terug naar overzicht</button>
            </div>
          </main>
          <Footer />
        </div>
    );
  }

  return (
      <div className="app-container">
        <Header />
        <main>
          <div className="container">
            <button className="back-button" onClick={handleBackClick}>
              &larr; Terug
            </button>

            <div className="skill-detail-card">
              <div className="skill-card-header">
                {skill.user && (
                    <>
                      <img
                          src={userAvatar || skill.user.avatar || skillrHandImg}
                          alt={skill.user.name}
                          className="user-avatar clickable"
                          onClick={() => handleProfileClick(skill.user.id)}
                          onError={(e) => { e.target.src = skillrHandImg; }}
                          style={{ cursor: 'pointer' }}
                      />
                      <div>
                        <strong
                            className="clickable-username"
                            onClick={() => handleProfileClick(skill.user.id)}
                            style={{ cursor: 'pointer' }}
                        >
                          {skill.user.name}
                        </strong>
                        <div className="timestamp">{formatTimestamp(skill.timestamp)}</div>
                      </div>
                    </>
                )}
              </div>

              <h1>{skill.title}</h1>
              <p className="skill-description">{skill.description}</p>

              {skill.media && skill.media.length > 0 && (
                  <div className="skill-detail-media">
                    {renderMedia(skill.media[0])}
                  </div>
              )}

              <div className="skill-card-footer">
                <div className="skill-stats">
                  <span>{skill.likes?.length || 0} likes</span>
                  <span>{skill.comments || 0} reacties</span>
                </div>
                <div className="skill-actions">
                  <button
                      className={`ghost ${skill.isLiked ? "active" : ""}`}
                      onClick={handleLike}
                  >
                    <span>Like</span>
                  </button>
                  <button className="ghost">
                    <span>Delen</span>
                  </button>
                </div>
              </div>

              <div className="comments-section">
                <h3>Reacties</h3>
                <form onSubmit={handleAddComment} className="add-comment">
                  <img
                      src={auth.currentUser?.photoURL || skillrHandImg}
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
                                className="comment-avatar clickable"
                                onClick={() => handleProfileClick(comment.userId)}
                                onError={(e) => { e.target.src = skillrHandImg; }}
                                style={{ cursor: 'pointer' }}
                            />
                            <span
                                className="comment-author clickable-username"
                                onClick={() => handleProfileClick(comment.userId)}
                                style={{ cursor: 'pointer' }}
                            >
                        {comment.user}
                      </span>
                            <span className="comment-time">{typeof comment.timestamp === 'string' ? comment.timestamp : formatTimestamp(comment.timestamp)}</span>
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
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
};

export default SkillDetail;
"use client"

import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom"
import Header from "./common/Header"
import Footer from "./common/Footer"
import Feed from "./feed/Feed"
import PostSkill from "./feed/PostSkill"
import { useAuth } from "./auth/AuthContextProvider"

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    // Add a slight delay for animation purposes
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchRecommendedUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      let users = usersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.id !== currentUser?.uid); // Filter jezelf eruit

      // Shuffle en pak de eerste 3
      users = users.sort(() => 0.5 - Math.random()).slice(0, 3);
      setRecommendedUsers(users);
    };
    fetchRecommendedUsers();
  }, [currentUser]);

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, "users", currentUser?.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    if (currentUser?.uid) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  if (loading) {
    return <div>Loading...</div>; // Of je eigen loader
  }

  // Nu weet je zeker dat profile geladen is
  if (profile?.isPrivate && !currentUser) {
    return <div>Dit profiel is privé.</div>;
  }

  return (
      <div className="app-container">
        <Header />
        <main>
          {!currentUser && (
              <section className="hero">
                <h1
                    style={{
                      opacity: isLoaded ? 1 : 0,
                      transform: isLoaded ? "translateY(0)" : "translateY(20px)",
                      transition: "opacity 0.6s ease, transform 0.6s ease",
                    }}
                >
                  Welkom op Skillr!
                </h1>
                <p
                    className="lead"
                    style={{
                      opacity: isLoaded ? 1 : 0,
                      transform: isLoaded ? "translateY(0)" : "translateY(20px)",
                      transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
                    }}
                >
                  De plek om vaardigheden te delen en te leren van anderen.
                </p>
                <div
                    className="cta-container"
                    style={{
                      opacity: isLoaded ? 1 : 0,
                      transform: isLoaded ? "translateY(0)" : "translateY(20px)",
                      transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
                    }}
                >
                  <Link to="/login">
                    <button>Inloggen</button>
                  </Link>
                  <Link to="/register">
                    <button className="secondary">Registreren</button>
                  </Link>
                </div>
              </section>
          )}

          <section className="content">
            <div className="two-column-layout">
              <div className="main-column">
                <PostSkill />
                <h2 className="animate-fadeInUp">Recent gedeelde vaardigheden</h2>
                <Feed />
              </div>

              <div className="sidebar">
                <div className="sidebar-section">
                  <h3>Aanbevolen gebruikers</h3>
                  <div className="recommended-users">
                    {recommendedUsers.map(user => (
                        <div className="user-item" key={user.id}>
                          <img
                            src={user.photoURL || user.avatar || "/src/assets/skillr-hand.png"}
                            alt="User"
                          />
                          <div>
                            <div
                              className="user-name clickable"
                              style={{ cursor: "pointer" }}
                              onClick={() => navigate(`/profile/${user.id}`)}
                            >
                              <strong>{user.name || user.displayName || user.email?.split("@")[0]}</strong>
                            </div>
                            {/* Voeg hier eventueel extra info toe, zoals bio */}
                          </div>
                          {/* Volg-knop verwijderd */}
                        </div>
                    ))}
                  </div>
                </div>

                {/* Rest van de sidebar-inhoud */}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
  )
}

export default Home
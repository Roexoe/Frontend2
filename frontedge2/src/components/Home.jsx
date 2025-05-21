"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "./common/Header"
import Footer from "./common/Footer"
import Feed from "./feed/Feed"
import PostSkill from "./feed/PostSkill"
import { useAuth } from "./auth/AuthContextProvider"

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { currentUser } = useAuth()

  useEffect(() => {
    // Add a slight delay for animation purposes
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

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
                    <div className="user-item">
                      <img src="/src/assets/skillr-hand.png" alt="User" />
                      <div>
                        <div>
                          <strong>Emma Wilson</strong>
                        </div>
                        <div style={{ fontSize: "var(--font-size-sm)", opacity: 0.7 }}>UX Designer</div>
                      </div>
                      <button className="ghost" style={{ marginLeft: "auto" }}>
                        Volgen
                      </button>
                    </div>

                    <div className="user-item">
                      <img src="/src/assets/skillr-hand.png" alt="User" />
                      <div>
                        <div>
                          <strong>David Lee</strong>
                        </div>
                        <div style={{ fontSize: "var(--font-size-sm)", opacity: 0.7 }}>Frontend Developer</div>
                      </div>
                      <button className="ghost" style={{ marginLeft: "auto" }}>
                        Volgen
                      </button>
                    </div>

                    <div className="user-item">
                      <img src="/src/assets/skillr-hand.png" alt="User" />
                      <div>
                        <div>
                          <strong>Sarah Johnson</strong>
                        </div>
                        <div style={{ fontSize: "var(--font-size-sm)", opacity: 0.7 }}>Product Manager</div>
                      </div>
                      <button className="ghost" style={{ marginLeft: "auto" }}>
                        Volgen
                      </button>
                    </div>
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
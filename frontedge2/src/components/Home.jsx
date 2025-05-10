import { Link } from "react-router-dom"
import Header from "./common/Header"
import Footer from "./common/Footer"
import Feed from "./feed/Feed"
import PostSkill from "./feed/PostSkill"

const Home = () => {
  return (
    <div className="app-container">
      <Header />
      <main>
        <div className="container">
          <section className="hero">
            <h1>Welkom op Skillr!</h1>
            <p className="lead">De plek om vaardigheden te delen en te leren van anderen.</p>
            <div className="cta-container">
              <Link to="/login">
                <button>Inloggen</button>
              </Link>
              <Link to="/register">
                <button className="secondary">Registreren</button>
              </Link>
            </div>
          </section>

          <section className="content">
            <div className="two-column-layout">
              <div className="main-column">
                <PostSkill />
                <h2>Recent gedeelde vaardigheden</h2>
                <Feed />
              </div>

              <div className="sidebar">
                <div className="sidebar-section">
                  <h3>Aanbevolen gebruikers</h3>
                  <div className="recommended-users">
                    <div
                      className="user-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-sm)",
                        marginBottom: "var(--space-md)",
                      }}
                    >
                      <img
                        src="/src/assets/skillr-hand.png"
                        alt="User"
                        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                      />
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

                    <div
                      className="user-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-sm)",
                        marginBottom: "var(--space-md)",
                      }}
                    >
                      <img
                        src="/src/assets/skillr-hand.png"
                        alt="User"
                        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                      />
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

                    <div
                      className="user-item"
                      style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}
                    >
                      <img
                        src="/src/assets/skillr-hand.png"
                        alt="User"
                        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                      />
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

                <div className="sidebar-section">
                  <h3>Trending vaardigheden</h3>
                  <div className="trending-skills">
                    <div className="trending-skill-item" style={{ marginBottom: "var(--space-sm)" }}>
                      <div>
                        <strong>#ReactJS</strong>
                      </div>
                      <div style={{ fontSize: "var(--font-size-sm)", opacity: 0.7 }}>1.2k berichten</div>
                    </div>

                    <div className="trending-skill-item" style={{ marginBottom: "var(--space-sm)" }}>
                      <div>
                        <strong>#UXDesign</strong>
                      </div>
                      <div style={{ fontSize: "var(--font-size-sm)", opacity: 0.7 }}>856 berichten</div>
                    </div>

                    <div className="trending-skill-item">
                      <div>
                        <strong>#WebDevelopment</strong>
                      </div>
                      <div style={{ fontSize: "var(--font-size-sm)", opacity: 0.7 }}>743 berichten</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home

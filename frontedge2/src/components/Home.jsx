import { Link } from "react-router-dom"
import Header from "./common/Header.jsx"
import Footer from "./common/Footer.jsx"
import Feed from "./feed/Feed.jsx"
import PostSkill from "./feed/PostSkill.jsx"

const Home = () => {
  return (
    <div className="app-container">
      <Header />
      <main>
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
          <div className="feed-container">
            <PostSkill />
            <h2>Recent gedeelde vaardigheden</h2>
            <Feed />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home

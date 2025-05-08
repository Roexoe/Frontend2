import React from "react";
import { Link } from "react-router-dom";
import Header from "./common/Header.jsx";
import Footer from "./common/Footer.jsx";
import SearchBar from "./common/SearchBar.jsx";

const Home = () => {
  return (
    <div>
      <Header />
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Welkom op Skillr!</h1>
        <p>De plek om vaardigheden te delen en te leren van anderen.</p>
        <SearchBar />
        <div style={{ marginTop: "20px" }}>
          <Link to="/login">
            <button style={{ marginRight: "10px" }}>Inloggen</button>
          </Link>
          <Link to="/register">
            <button style={{ marginRight: "10px" }}>Registreren</button>
          </Link>
          <Link to="/logout">
            <button>Uitloggen</button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
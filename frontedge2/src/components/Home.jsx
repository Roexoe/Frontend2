import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welkom op de Homepagina!</h1>
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
    </div>
  );
};

export default Home;
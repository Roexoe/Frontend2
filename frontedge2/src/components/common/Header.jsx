import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import Logo from "./Logo";

const Header = () => {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "#f9f9f9" }}>
      <Logo />
      <SearchBar />
      <nav>
        <Link to="/profile" style={{ margin: "0 10px" }}>Profile</Link>
        <Link to="/notifications" style={{ margin: "0 10px" }}>Notifications</Link>
        <Link to="/logout" style={{ margin: "0 10px" }}>Logout</Link>
      </nav>
    </header>
  );
};

export default Header;
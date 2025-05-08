import React from "react";

const Footer = () => {
  return (
    <footer style={{ textAlign: "center", padding: "1rem", backgroundColor: "#1a1a1a", color: "#fff" }}>
      <img src="/src/assets/skillr-logo-zonder.png" alt="Skillr Logo" style={{ height: "50px", marginBottom: "10px" }} />
      <p>&copy; 2025 Skillr. All rights reserved.</p>
      <p>
        <a href="/terms" style={{ color: "#646cff" }}>Terms of Service</a> | <a href="/privacy" style={{ color: "#646cff" }}>Privacy Policy</a>
      </p>
    </footer>
  );
};

export default Footer;
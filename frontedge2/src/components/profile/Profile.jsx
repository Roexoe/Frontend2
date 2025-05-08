import React from "react";

const Profile = () => {
  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <img src="/src/assets/skillr-hand.png" alt="Profile Avatar" style={{ height: "100px", borderRadius: "50%" }} />
      <h2>John Doe</h2>
      <p>Bio: Passionate about sharing skills and learning from others.</p>
    </div>
  );
};

export default Profile;
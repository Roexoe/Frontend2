import React from "react";

const SkillCard = ({ skill }) => {
  return (
    <div style={{ border: "1px solid #ddd", padding: "1rem", margin: "1rem 0", borderRadius: "8px" }}>
      <h3>{skill.title}</h3>
      <p>{skill.description}</p>
      <p><strong>Shared by:</strong> {skill.user}</p>
      <img src="/src/assets/skillr-walvis.png" alt="Skill Icon" style={{ height: "30px", marginTop: "10px" }} />
    </div>
  );
};

export default SkillCard;
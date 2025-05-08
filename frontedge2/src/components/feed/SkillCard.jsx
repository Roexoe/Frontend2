const SkillCard = ({ skill }) => {
  return (
    <div className="skill-card">
      <h3>{skill.title}</h3>
      <p>{skill.description}</p>

      <div className="skill-card-footer">
        <div className="skill-user">
          <strong>Shared by:</strong> {skill.user}
        </div>
        <div className="skill-actions">
          <button className="ghost">Like</button>
          <button className="ghost">Comment</button>
          <button className="ghost">Share</button>
        </div>
      </div>

      <img src="/src/assets/skillr-walvis.png" alt="Skill Icon" style={{ height: "30px", marginTop: "10px" }} />
    </div>
  )
}

export default SkillCard

import React from "react";
import SkillCard from "./SkillCard";

const Feed = () => {
  const skills = [
    { id: 1, title: "React Basics", description: "Learn the basics of React.js", user: "John Doe" },
    { id: 2, title: "CSS Grid", description: "Master CSS Grid layout", user: "Jane Smith" },
  ];

  return (
    <div>
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  );
};

export default Feed;
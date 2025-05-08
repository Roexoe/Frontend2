import SkillCard from "./SkillCard"

const Feed = () => {
  const skills = [
    {
      id: 1,
      title: "React Basics",
      description:
        "Learn the basics of React.js including components, props, and state management. Perfect for beginners who want to start their journey in modern web development.",
      user: "John Doe",
    },
    {
      id: 2,
      title: "CSS Grid Layout",
      description:
        "Master CSS Grid layout to create complex and responsive web layouts with ease. This skill will help you design modern websites without relying on frameworks.",
      user: "Jane Smith",
    },
    {
      id: 3,
      title: "JavaScript ES6+",
      description:
        "Explore the modern features of JavaScript including arrow functions, destructuring, spread operators, and more to write cleaner and more efficient code.",
      user: "Alex Johnson",
    },
  ]

  return (
    <div className="feed">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  )
}

export default Feed

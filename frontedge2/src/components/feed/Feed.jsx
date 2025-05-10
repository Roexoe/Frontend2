"use client"

import { useState, useEffect } from "react"
import SkillCard from "./SkillCard"

const Feed = () => {
  const [skills, setSkills] = useState([
    {
      id: 1,
      title: "React Basics",
      description:
        "Learn the basics of React.js including components, props, and state management. Perfect for beginners who want to start their journey in modern web development.",
      user: "John Doe",
      userAvatar: "/src/assets/skillr-hand.png",
      media: "/src/assets/skillr-walvis.png",
      mediaType: "image",
      likes: 24,
      comments: 8,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 2,
      title: "CSS Grid Layout",
      description:
        "Master CSS Grid layout to create complex and responsive web layouts with ease. This skill will help you design modern websites without relying on frameworks.",
      user: "Jane Smith",
      userAvatar: "/src/assets/skillr-hand.png",
      media: null,
      likes: 18,
      comments: 5,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 3,
      title: "JavaScript ES6+",
      description:
        "Explore the modern features of JavaScript including arrow functions, destructuring, spread operators, and more to write cleaner and more efficient code.",
      user: "Alex Johnson",
      userAvatar: "/src/assets/skillr-hand.png",
      media: "/src/assets/skillr-walvis.png",
      mediaType: "image",
      likes: 32,
      comments: 12,
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: 4,
      title: "UI/UX Design Principles",
      description:
        "Learn the fundamental principles of UI/UX design to create intuitive and engaging user experiences. This skill covers color theory, typography, layout, and user research.",
      user: "Sarah Williams",
      userAvatar: "/src/assets/skillr-hand.png",
      media: "/src/assets/skillr-walvis.png",
      mediaType: "image",
      likes: 45,
      comments: 15,
      timestamp: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: 5,
      title: "Mobile App Development",
      description:
        "Discover the essentials of mobile app development for iOS and Android platforms. Learn about responsive design, native features, and cross-platform frameworks.",
      user: "Michael Brown",
      userAvatar: "/src/assets/skillr-hand.png",
      media: null,
      likes: 29,
      comments: 7,
      timestamp: new Date(Date.now() - 18000000).toISOString(),
    },
  ])

  // Sort skills by timestamp (newest first)
  useEffect(() => {
    const sortedSkills = [...skills].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    setSkills(sortedSkills)
  }, [])

  return (
    <div className="feed">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  )
}

export default Feed

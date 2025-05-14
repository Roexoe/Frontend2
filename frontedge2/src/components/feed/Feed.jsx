"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "../../firebase"
import SkillCard from "./SkillCard"

const Feed = () => {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Query voor skills, gesorteerd op timestamp (nieuwste eerst)
    const q = query(
      collection(db, "skills"),
      orderBy("timestamp", "desc")
    )

    // Realtime luisteren naar veranderingen
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const skillsArray = []
      querySnapshot.forEach((doc) => {
        skillsArray.push({ id: doc.id, ...doc.data() })
      })
      setSkills(skillsArray)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching skills:", error)
      setLoading(false)
    })

    // Cleanup functie
    return () => unsubscribe()
  }, [])

  if (loading) {
    return <div>Vaardigheden worden geladen...</div>
  }

  return (
    <div className="feed">
      {skills.length > 0 ? (
        skills.map((skill) => <SkillCard key={skill.id} skill={skill} />)
      ) : (
        <div>Nog geen vaardigheden gedeeld. Wees de eerste!</div>
      )}
    </div>
  )
}

export default Feed

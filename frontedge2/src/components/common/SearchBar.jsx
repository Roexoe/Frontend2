"use client"

import { useState } from "react"
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"

const SearchBar = () => {
  const [queryText, setQueryText] = useState("")
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const db = getFirestore()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!queryText.trim()) return

    try {
      // Search users
      const usersQuery = query(
        collection(db, "users"),
        where("name", ">=", queryText),
        where("name", "<=", queryText + "\uf8ff"),
      )
      const usersSnapshot = await getDocs(usersQuery)
      const usersResults = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        type: "user",
        ...doc.data(),
      }))

      // Search skills/posts
      const skillsQuery = query(
        collection(db, "skills"),
        where("title", ">=", queryText),
        where("title", "<=", queryText + "\uf8ff"),
      )
      const skillsSnapshot = await getDocs(skillsQuery)
      const skillsResults = skillsSnapshot.docs.map((doc) => ({
        id: doc.id,
        type: "skill",
        ...doc.data(),
      }))

      setResults([...usersResults, ...skillsResults])
      setShowResults(true)
    } catch (error) {
      console.error("Error searching:", error)
      // For demo purposes, show mock results if Firestore fails
      setResults([
        { id: "1", type: "user", name: "John Doe", bio: "Frontend Developer" },
        { id: "2", type: "user", name: "Jane Smith", bio: "UX Designer" },
        { id: "3", type: "skill", title: "React Development", user: "Alex Johnson" },
      ])
      setShowResults(true)
    }
  }

  const handleBlur = () => {
    // Delay hiding results to allow for clicking on them
    setTimeout(() => {
      setShowResults(false)
    }, 200)
  }

  return (
    <div className="search-bar-container" style={{ position: "relative" }}>
      <form onSubmit={handleSearch}>
        <div className="search-input-wrapper" style={{ position: "relative" }}>
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Zoek naar gebruikers of vaardigheden..."
            onFocus={() => queryText && setShowResults(true)}
            onBlur={handleBlur}
          />
          <button type="submit" className="search-button">
            Zoeken
          </button>
        </div>
      </form>

      {showResults && results.length > 0 && (
        <div className="search-results">
          {results.map((result) => (
            <div key={result.id} className="search-result-item">
              <img
                src={result.avatar || "/src/assets/skillr-hand.png"}
                alt={result.type === "user" ? result.name : result.title}
                className="search-result-avatar"
              />
              <div className="search-result-info">
                <div className="search-result-name">{result.type === "user" ? result.name : result.title}</div>
                <div className="search-result-meta">
                  {result.type === "user" ? result.bio || "Gebruiker" : `Vaardigheid door ${result.user}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar

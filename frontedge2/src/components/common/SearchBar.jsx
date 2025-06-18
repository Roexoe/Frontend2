"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getFirestore, collection, query, where, getDocs, limit } from "firebase/firestore"

const SearchBar = () => {
  const [queryText, setQueryText] = useState("")
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()
  const db = getFirestore()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!queryText.trim()) return

    // Navigeer naar de zoekresultaten pagina
    navigate(`/search?q=${encodeURIComponent(queryText.trim())}`)
    setShowResults(false)
    setQueryText("")
  }

  const handleInputChange = async (e) => {
    const value = e.target.value
    setQueryText(value)

    if (value.trim().length > 2) {
      setIsSearching(true)
      await performQuickSearch(value.trim())
      setIsSearching(false)
    } else {
      setResults([])
      setShowResults(false)
    }
  }

  const performQuickSearch = async (searchTerm) => {
    try {
      // Converteer zoekterm naar lowercase voor case-insensitive zoeken
      const lowerSearchTerm = searchTerm.toLowerCase()

      // Quick search voor dropdown (beperkt tot 5 resultaten per type)
      // Zoek op zowel originele velden als lowercase velden
      const usersQuery = query(
          collection(db, "users"),
          where("nameLower", ">=", lowerSearchTerm),
          where("nameLower", "<=", lowerSearchTerm + "\uf8ff"),
          limit(5)
      )
      const usersSnapshot = await getDocs(usersQuery)
      const usersResults = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        type: "user",
        ...doc.data(),
      }))

      const skillsQuery = query(
          collection(db, "skills"),
          where("titleLower", ">=", lowerSearchTerm),
          where("titleLower", "<=", lowerSearchTerm + "\uf8ff"),
          limit(5)
      )
      const skillsSnapshot = await getDocs(skillsQuery)
      const skillsResults = skillsSnapshot.docs.map((doc) => ({
        id: doc.id,
        type: "skill",
        ...doc.data(),
      }))

      let fallbackResults = []
      if (usersResults.length === 0 && skillsResults.length === 0) {
        const originalUsersQuery = query(collection(db, "users"), limit(20))
        const originalUsersSnapshot = await getDocs(originalUsersQuery)
        const filteredUsers = originalUsersSnapshot.docs
            .map((doc) => ({ id: doc.id, type: "user", ...doc.data() }))
            .filter((user) =>
                (user.name && user.name.toLowerCase().includes(lowerSearchTerm)) ||
                (user.displayName && user.displayName.toLowerCase().includes(lowerSearchTerm))
            )
            .slice(0, 5)

        const originalSkillsQuery = query(collection(db, "skills"), limit(20))
        const originalSkillsSnapshot = await getDocs(originalSkillsQuery)
        const filteredSkills = originalSkillsSnapshot.docs
            .map((doc) => ({ id: doc.id, type: "skill", ...doc.data() }))
            .filter((skill) =>
                skill.title && skill.title.toLowerCase().includes(lowerSearchTerm)
            )
            .slice(0, 5)

        fallbackResults = [...filteredUsers, ...filteredSkills]
      }

      const combinedResults = [...usersResults, ...skillsResults, ...fallbackResults]
      setResults(combinedResults)
      setShowResults(combinedResults.length > 0)

    } catch (error) {
      console.error("Error performing quick search:", error)
      // Fallback voor demo
      setResults([
        { id: "1", type: "user", name: "John Doe", bio: "Frontend Developer" },
        { id: "2", type: "skill", title: "React Development", user: { name: "Alex Johnson" } },
      ])
      setShowResults(true)
    }
  }

  const handleResultClick = (result) => {
    if (result.type === "user") {
      navigate(`/profile/${result.id}`)
    } else {
      // Voor nu navigeren we naar de zoekresultaten pagina
      navigate(`/search?q=${encodeURIComponent(result.title)}`)
    }
    setShowResults(false)
    setQueryText("")
  }

  const handleBlur = () => {
    // Delay hiding results to allow for clicking on them
    setTimeout(() => {
      setShowResults(false)
    }, 200)
  }

  const handleFocus = () => {
    if (queryText.trim().length > 2 && results.length > 0) {
      setShowResults(true)
    }
  }

  return (
      <div className="search-bar-container" style={{ position: "relative" }}>
        <form onSubmit={handleSearch}>
          <div className="search-input-wrapper" style={{ position: "relative" }}>
            <input
                type="text"
                value={queryText}
                onChange={handleInputChange}
                placeholder="Zoek naar gebruikers of vaardigheden..."
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            <button type="submit" className="search-button" disabled={isSearching}>
              {isSearching ? "..." : "Zoeken"}
            </button>
          </div>
        </form>

        {showResults && results.length > 0 && (
            <div className="search-results">
              {results.map((result) => (
                  <div
                      key={result.id}
                      className="search-result-item"
                      onClick={() => handleResultClick(result)}
                      style={{ cursor: "pointer" }}
                  >
                    <img
                        src={
                          result.type === "user"
                              ? (result.photoURL || result.avatar || "/src/assets/skillr-hand.png")
                              : (result.user?.avatar || "/src/assets/skillr-hand.png")
                        }
                        alt={result.type === "user" ? result.name : result.title}
                        className="search-result-avatar"
                    />
                    <div className="search-result-info">
                      <div className="search-result-name">
                        {result.type === "user" ? (result.name || result.displayName) : result.title}
                      </div>
                      <div className="search-result-meta">
                        {result.type === "user"
                            ? (result.bio || "Gebruiker")
                            : `Vaardigheid door ${result.user?.name || "Onbekend"}`
                        }
                      </div>
                    </div>
                  </div>
              ))}

              {queryText.trim() && (
                  <div
                      className="search-result-item search-all-results"
                      onClick={() => navigate(`/search?q=${encodeURIComponent(queryText.trim())}`)}
                      style={{ cursor: "pointer", borderTop: "1px solid #eee", marginTop: "8px", paddingTop: "8px" }}
                  >
                    <div className="search-result-info">
                      <div className="search-result-name">
                        Alle resultaten bekijken voor "{queryText}"
                      </div>
                      <div className="search-result-meta">
                        Klik om naar de volledige zoekresultaten te gaan
                      </div>
                    </div>
                  </div>
              )}
            </div>
        )}
      </div>
  )
}

export default SearchBar
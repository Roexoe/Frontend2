"use client"

import { useState } from "react"

const SearchBar = () => {
  const [query, setQuery] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    alert(`Searching for: ${query}`)
  }

  return (
    <form onSubmit={handleSearch} className="search-container">
      <input type="text" placeholder="Search skills..." value={query} onChange={(e) => setQuery(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  )
}

export default SearchBar

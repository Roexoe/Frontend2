import React, { useState } from "react";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${query}`);
  };

  return (
    <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center" }}>
      <input
        type="text"
        placeholder="Search skills..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "0.5rem", flex: 1 }}
      />
      <button type="submit" style={{ padding: "0.5rem" }}>Search</button>
    </form>
  );
};

export default SearchBar;
"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import SearchBar from "./SearchBar"
import Logo from "./Logo"

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header>
      <div className="container">
        <div className="logo">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="search-container">
          <SearchBar />
        </div>

        <nav className="desktop-nav">
          <Link to="/">Home</Link>
          <Link to="/profile">Profiel</Link>
          <Link to="/notifications">Meldingen</Link>
          <Link to="/messages">Berichten</Link>
          <Link to="/logout">Uitloggen</Link>
        </nav>

        <button className="mobile-menu-button ghost" onClick={toggleMobileMenu}>
          <span>Menu</span>
        </button>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <Logo />
              <button className="ghost" onClick={toggleMobileMenu}>
                Sluiten
              </button>
            </div>

            <div className="mobile-search">
              <SearchBar />
            </div>

            <nav>
              <Link to="/" onClick={toggleMobileMenu}>
                Home
              </Link>
              <Link to="/profile" onClick={toggleMobileMenu}>
                Profiel
              </Link>
              <Link to="/notifications" onClick={toggleMobileMenu}>
                Meldingen
              </Link>
              <Link to="/messages" onClick={toggleMobileMenu}>
                Berichten
              </Link>
              <Link to="/logout" onClick={toggleMobileMenu}>
                Uitloggen
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

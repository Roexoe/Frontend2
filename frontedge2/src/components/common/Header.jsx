"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import SearchBar from "./SearchBar"
import Logo from "./Logo"

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    // Prevent body scrolling when menu is open
    document.body.style.overflow = !mobileMenuOpen ? "hidden" : "auto"
  }

  return (
    <header
      style={{
        boxShadow: scrolled ? "var(--shadow-lg)" : "none",
        transform: scrolled ? "translateY(-5px)" : "translateY(0)",
      }}
    >
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
          <Link to="/" className="nav-link">
            <span>Home</span>
          </Link>
          <Link to="/profile" className="nav-link">
            <span>Profiel</span>
          </Link>
          <Link to="/notifications" className="nav-link">
            <span>Meldingen</span>
          </Link>
          <Link to="/messages" className="nav-link">
            <span>Berichten</span>
          </Link>
          <Link to="/logout" className="nav-link">
            <span>Uitloggen</span>
          </Link>
        </nav>

        <button
          className="mobile-menu-button ghost"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Sluit menu" : "Open menu"}
        >
          <span>{mobileMenuOpen ? "×" : "Menu"}</span>
        </button>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <Logo />
              <button className="ghost" onClick={toggleMobileMenu} aria-label="Sluit menu">
                <span>×</span>
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

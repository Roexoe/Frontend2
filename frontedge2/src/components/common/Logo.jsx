"use client"

import { useState, useEffect } from "react"

const Logo = () => {
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    // Trigger animation once on component mount
    setIsAnimated(true)
    const timer = setTimeout(() => setIsAnimated(false), 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleHover = () => {
    setIsAnimated(true)
    setTimeout(() => setIsAnimated(false), 1000)
  }

  return (
    <div
      onMouseEnter={handleHover}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        transition: "all 0.3s ease",
      }}
    >
      <img
        src="/src/assets/skillr-logo-goede.png"
        alt="Skillr Logo"
        style={{
          height: "50px",
          transform: isAnimated ? "rotate(-5deg) scale(1.1)" : "rotate(0) scale(1)",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      />
    </div>
  )
}

export default Logo

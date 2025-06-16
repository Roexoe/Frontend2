"use client"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../../firebase"

const Logout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const doLogout = async () => {
      try {
        await signOut(auth)
        navigate("/login")
      } catch (err) {
        console.error(err.message)
      }
    }
    doLogout()
  }, [navigate])

  return null
}

export default Logout

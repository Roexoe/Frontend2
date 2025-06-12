"use client"

import { useEffect, useState } from "react"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDocs, where } from "firebase/firestore"
import { db } from "../../firebase"
import { useAuth } from "../auth/AuthContextProvider"
import Header from "../common/Header"
import Footer from "../common/Footer"

const Chat = () => {
  const { currentUser } = useAuth()
  const [contacts, setContacts] = useState([])
  const [activeContact, setActiveContact] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)

  // Haal contacten op (optioneel: alleen gebruikers waarmee je ooit hebt gechat)
  useEffect(() => {
    // Voor demo: haal alle gebruikers behalve jezelf op
    const fetchContacts = async () => {
      const q = query(
        collection(db, "users"),
        where("email", "!=", currentUser.email) // of filter op uid
      )
      const snapshot = await getDocs(q)
      setContacts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    }
    fetchContacts()
  }, [currentUser])

  // Real-time berichten ophalen
  const chatId = activeContact ? [currentUser.uid, activeContact.id].sort().join("_") : null
  useEffect(() => {
    if (!chatId) return
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp", "asc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })
    return () => unsubscribe()
  }, [chatId])

  // Bericht versturen
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeContact) return
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      senderId: currentUser.uid,
      timestamp: serverTimestamp(),
    })
    setNewMessage("")
  }

  // Gebruiker zoeken
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    const q = query(
      collection(db, "users"),
      where("name", ">=", searchTerm),
      where("name", "<=", searchTerm + "\uf8ff")
    )
    const snapshot = await getDocs(q)
    setSearchResults(
      snapshot.docs
        .filter((doc) => doc.id !== currentUser.uid)
        .map((doc) => ({ id: doc.id, ...doc.data() }))
    )
  }

  // Start chat met geselecteerde gebruiker
  const handleStartChat = (user) => {
    setActiveContact(user)
    setShowSearch(false)
    setSearchTerm("")
    setSearchResults([])
    // Voeg eventueel toe aan contactenlijst in Firestore
  }

  return (
    <div className="app-container">
      <Header />
      <main>
        <div className="container">
          <h1>Berichten</h1>
          <button onClick={() => setShowSearch(true)} style={{ marginBottom: 16 }}>
            Start een nieuwe chat
          </button>

          {showSearch && (
            <div className="chat-search-modal">
              <form onSubmit={handleSearch} style={{ marginBottom: 8 }}>
                <input
                  type="text"
                  placeholder="Zoek gebruiker op naam"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">Zoeken</button>
                <button type="button" onClick={() => setShowSearch(false)}>
                  Sluiten
                </button>
              </form>
              <div>
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    style={{ cursor: "pointer", padding: 8 }}
                    onClick={() => handleStartChat(user)}
                  >
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      style={{ width: 32, borderRadius: "50%", marginRight: 8 }}
                    />
                    {user.name}
                  </div>
                ))}
                {searchResults.length === 0 && searchTerm && <div>Geen gebruikers gevonden.</div>}
              </div>
            </div>
          )}

          <div className="chat-container">
            <div className="chat-sidebar">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`chat-contact ${
                    activeContact && activeContact.id === contact.id ? "active" : ""
                  }`}
                  onClick={() => setActiveContact(contact)}
                >
                  <img src={contact.avatar || "/placeholder.svg"} alt={contact.name} className="chat-contact-avatar" />
                  <div className="chat-contact-info">
                    <div className="chat-contact-name">{contact.name}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-conversation">
              {activeContact ? (
                <>
                  <div className="chat-header">
                    <img
                      src={activeContact.avatar || "/placeholder.svg"}
                      alt={activeContact.name}
                      className="chat-contact-avatar"
                    />
                    <div className="chat-contact-info">
                      <div className="chat-contact-name">{activeContact.name}</div>
                    </div>
                  </div>
                  <div className="chat-messages">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message ${message.senderId === currentUser.uid ? "sent" : "received"}`}
                      >
                        <div className="message-content">{message.text}</div>
                      </div>
                    ))}
                  </div>
                  <form className="chat-input" onSubmit={handleSendMessage}>
                    <input
                      type="text"
                      placeholder="Typ een bericht..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" disabled={!newMessage.trim()}>
                      Versturen
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ padding: 32, color: "#888" }}>Selecteer of zoek een gebruiker om te chatten.</div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Chat

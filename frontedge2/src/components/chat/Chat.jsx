"use client"

import { useState } from "react"
import Header from "../common/Header"
import Footer from "../common/Footer"

const Chat = () => {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Max van Rooijen",
      avatar: "/src/assets/skillr-hand.png",
      lastMessage: "Hoi, hoe gaat het met je?",
      lastMessageTime: "10:30",
      unread: 2,
    },
    {
      id: 2,
      name: "Mees",
      avatar: "/src/assets/skillr-hand.png",
      lastMessage: "Bedankt voor je hulp!",
      lastMessageTime: "Gisteren",
      unread: 0,
    },
    {
      id: 3,
      name: "Jochem Bos",
      avatar: "/src/assets/skillr-hand.png",
      lastMessage: "Wanneer kan je?",
      lastMessageTime: "Maandag",
      unread: 1,
    },
  ])

  const [activeContact, setActiveContact] = useState(contacts[0])

  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: 1,
      text: "Hoi, hoe gaat het met je?",
      time: "10:30",
    },
    {
      id: 2,
      senderId: "currentUser",
      text: "Hey! Het gaat goed, bedankt. En met jou?",
      time: "10:32",
    },
    {
      id: 3,
      senderId: 1,
      text: "Ook goed! Ik vroeg me af of je me kunt helpen met een project waar ik aan werk.",
      time: "10:33",
    },
    {
      id: 4,
      senderId: "currentUser",
      text: "Natuurlijk! Waar gaat het over?",
      time: "10:35",
    },
  ])

  const [newMessage, setNewMessage] = useState("")

  const handleContactSelect = (contact) => {
    setActiveContact(contact)
    // Mark messages as read
    setContacts(contacts.map((c) => (c.id === contact.id ? { ...c, unread: 0 } : c)))
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      senderId: "currentUser",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  return (
    <div className="app-container">
      <Header />
      <main>
        <div className="container">
          <h1>Berichten</h1>

          <div className="chat-container">
            <div className="chat-sidebar">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`chat-contact ${activeContact.id === contact.id ? "active" : ""}`}
                  onClick={() => handleContactSelect(contact)}
                >
                  <img src={contact.avatar || "/placeholder.svg"} alt={contact.name} className="chat-contact-avatar" />
                  <div className="chat-contact-info">
                    <div className="chat-contact-name">{contact.name}</div>
                    <div className="chat-contact-last-message">{contact.lastMessage}</div>
                  </div>
                  <div className="chat-contact-meta">
                    <div className="chat-contact-time">{contact.lastMessageTime}</div>
                    {contact.unread > 0 && (
                      <div
                        className="chat-contact-unread"
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "white",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "var(--font-size-xs)",
                          marginTop: "var(--space-xs)",
                        }}
                      >
                        {contact.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-conversation">
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
                    className={`message ${message.senderId === "currentUser" ? "sent" : "received"}`}
                  >
                    <div className="message-content">{message.text}</div>
                    <div className="message-time">{message.time}</div>
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Chat

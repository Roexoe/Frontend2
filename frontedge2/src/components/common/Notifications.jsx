"use client"

import { useState } from "react"
import Header from "./Header"
import Footer from "./Footer"

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "like",
      user: {
        name: "John Doe",
        avatar: "/src/assets/skillr-hand.png",
      },
      content: "heeft je vaardigheid leuk gevonden.",
      time: "2 uur geleden",
      read: false,
    },
    {
      id: 2,
      type: "comment",
      user: {
        name: "Jane Smith",
        avatar: "/src/assets/skillr-hand.png",
      },
      content: 'heeft gereageerd op je bericht: "Geweldig! Ik wil hier meer over leren."',
      time: "5 uur geleden",
      read: true,
    },
    {
      id: 3,
      type: "follow",
      user: {
        name: "Alex Johnson",
        avatar: "/src/assets/skillr-hand.png",
      },
      content: "volgt je nu.",
      time: "1 dag geleden",
      read: true,
    },
    {
      id: 4,
      type: "mention",
      user: {
        name: "Sarah Williams",
        avatar: "/src/assets/skillr-hand.png",
      },
      content: 'heeft je genoemd in een reactie: "@user Wat vind jij hiervan?"',
      time: "2 dagen geleden",
      read: true,
    },
  ])

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  return (
    <div className="app-container">
      <Header />
      <main>
        <div className="container">
          <div
            className="notifications-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--space-lg)",
            }}
          >
            <h1>Meldingen</h1>
            <button className="ghost" onClick={markAllAsRead}>
              Alles als gelezen markeren
            </button>
          </div>

          <div className="notifications-container">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="notification-item"
                  style={{
                    backgroundColor: notification.read ? "transparent" : "rgba(59, 130, 246, 0.1)",
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <img
                    src={notification.user.avatar || "/placeholder.svg"}
                    alt={notification.user.name}
                    className="notification-avatar"
                  />
                  <div className="notification-content">
                    <p>
                      <strong>{notification.user.name}</strong> {notification.content}
                    </p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                  {!notification.read && (
                    <div
                      className="notification-badge"
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "var(--primary)",
                      }}
                    ></div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center" style={{ padding: "var(--space-xl)" }}>
                Je hebt geen meldingen.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Notifications

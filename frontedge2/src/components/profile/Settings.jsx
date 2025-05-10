"use client"

import { useState } from "react"
import Header from "../common/Header"
import Footer from "../common/Footer"
import PrivacyToggle from "../common/PrivacyToggle"

const Settings = () => {
  const [blockedUsers, setBlockedUsers] = useState([
    { id: 1, name: "Jane Smith", avatar: "/src/assets/skillr-hand.png" },
    { id: 2, name: "Robert Johnson", avatar: "/src/assets/skillr-hand.png" },
  ])

  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    messages: true,
    newsletter: false,
  })

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    })
  }

  const unblockUser = (userId) => {
    setBlockedUsers(blockedUsers.filter((user) => user.id !== userId))
  }

  return (
    <div className="app-container">
      <Header />
      <main>
        <div className="container">
          <h1>Instellingen</h1>

          <div className="settings-container">
            <div className="settings-section">
              <h3>Privacy</h3>
              <p>Beheer wie je profiel en berichten kan zien.</p>

              <PrivacyToggle />

              <div className="block-user-container">
                <h4>Geblokkeerde gebruikers</h4>
                <p>Geblokkeerde gebruikers kunnen je profiel niet zien en geen berichten naar je sturen.</p>

                {blockedUsers.length > 0 ? (
                  <div className="blocked-users-list">
                    {blockedUsers.map((user) => (
                      <div key={user.id} className="blocked-user-item">
                        <div className="blocked-user-info">
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            className="blocked-user-avatar"
                          />
                          <span>{user.name}</span>
                        </div>
                        <button className="ghost" onClick={() => unblockUser(user.id)}>
                          Deblokkeren
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Je hebt geen gebruikers geblokkeerd.</p>
                )}
              </div>
            </div>

            <div className="settings-section">
              <h3>Meldingen</h3>
              <p>Beheer welke meldingen je wilt ontvangen.</p>

              <div className="notification-settings">
                <div className="form-group">
                  <div className="privacy-toggle">
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={notifications.likes}
                        onChange={() => handleNotificationChange("likes")}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div>
                      <p>
                        <strong>Likes</strong>
                      </p>
                      <p style={{ fontSize: "var(--font-size-sm)", opacity: 0.8 }}>
                        Ontvang meldingen wanneer iemand je bericht leuk vindt.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="privacy-toggle">
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={notifications.comments}
                        onChange={() => handleNotificationChange("comments")}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div>
                      <p>
                        <strong>Reacties</strong>
                      </p>
                      <p style={{ fontSize: "var(--font-size-sm)", opacity: 0.8 }}>
                        Ontvang meldingen wanneer iemand reageert op je bericht.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="privacy-toggle">
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={notifications.follows}
                        onChange={() => handleNotificationChange("follows")}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div>
                      <p>
                        <strong>Volgers</strong>
                      </p>
                      <p style={{ fontSize: "var(--font-size-sm)", opacity: 0.8 }}>
                        Ontvang meldingen wanneer iemand je volgt.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="privacy-toggle">
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={notifications.messages}
                        onChange={() => handleNotificationChange("messages")}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div>
                      <p>
                        <strong>Berichten</strong>
                      </p>
                      <p style={{ fontSize: "var(--font-size-sm)", opacity: 0.8 }}>
                        Ontvang meldingen wanneer iemand je een bericht stuurt.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="privacy-toggle">
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={notifications.newsletter}
                        onChange={() => handleNotificationChange("newsletter")}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div>
                      <p>
                        <strong>Nieuwsbrief</strong>
                      </p>
                      <p style={{ fontSize: "var(--font-size-sm)", opacity: 0.8 }}>
                        Ontvang onze maandelijkse nieuwsbrief met tips en updates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>Account</h3>
              <p>Beheer je accountgegevens en wachtwoord.</p>

              <div className="form-group">
                <button>Wachtwoord wijzigen</button>
              </div>

              <div className="form-group">
                <button className="ghost" style={{ color: "var(--error)" }}>
                  Account verwijderen
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Settings

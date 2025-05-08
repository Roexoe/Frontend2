const Profile = () => {
  return (
    <div className="profile">
      <img src="/src/assets/skillr-hand.png" alt="Profile Avatar" className="profile-avatar" />

      <div className="profile-info">
        <h2>John Doe</h2>
        <p className="profile-bio">Passionate about sharing skills and learning from others.</p>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">42</span>
            <span className="stat-label">Skills Shared</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">128</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">56</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button>Edit Profile</button>
        <button className="ghost">Settings</button>
      </div>
    </div>
  )
}

export default Profile

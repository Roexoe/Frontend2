const Notifications = () => {
  const notifications = [
    "John Doe liked your skill post.",
    "Jane Smith commented on your post.",
    "You have a new follower: Alex Johnson.",
  ]

  return (
    <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((note, index) => (
          <li key={index} style={{ margin: "5px 0" }}>
            {note}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Notifications

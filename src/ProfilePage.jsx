import React, { useState } from "react"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Arunima",
    village: "Bengaluru Rural",
    language: "English",
    group: "Self Help Group A"
  })

  return (
    <div className="card" style={{ color: "#000" }}>
      <h2 className="card-title">👤 Profile</h2>

      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ padding: 12, background: "#fff", borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
          <strong>Name:</strong> {profile.name}
        </div>
        <div style={{ padding: 12, background: "#fff", borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
          <strong>Village:</strong> {profile.village}
        </div>
        <div style={{ padding: 12, background: "#fff", borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
          <strong>Language:</strong> {profile.language}
        </div>
        <div style={{ padding: 12, background: "#fff", borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
          <strong>Group:</strong> {profile.group}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button style={{ padding: 12, borderRadius: 8, background: "#4caf50", color: "#fff", fontSize: 16 }}>
          ✏️ Edit Profile
        </button>
      </div>
    </div>
  )
}

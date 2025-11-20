import React from "react"

export default function EducationHub() {
  const lessons = [
    { id: 1, title: "Why Save Money?", icon: "🌱", desc: "Learn the importance of saving for future needs." },
    { id: 2, title: "Smart Spending", icon: "🛒", desc: "Tips to manage expenses wisely." },
    { id: 3, title: "Government Schemes", icon: "🏛️", desc: "Know about schemes available for women and families." }
  ]

  return (
    <div className="card" style={{ color: "#000" }}>
      <h2 className="card-title">📚 Education Hub</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {lessons.map(l => (
          <div key={l.id} style={{
            padding: 14,
            borderRadius: 12,
            background: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}>
            <div style={{ fontSize: 22 }}>{l.icon} {l.title}</div>
            <div style={{ fontSize: 16, marginTop: 6 }}>{l.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

import React from "react"

export default function HelpSupport() {
  return (
    <div className="card" style={{ color: "#000" }}>
      <h2 className="card-title">🆘 Help & Support</h2>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 16 }}>Need assistance? Choose an option below:</p>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <button style={{ padding: 12, borderRadius: 8, background: "#4caf50", color: "#fff", fontSize: 16 }}>
          📞 Call Volunteer
        </button>
        <button style={{ padding: 12, borderRadius: 8, background: "#2196f3", color: "#fff", fontSize: 16 }}>
          💬 WhatsApp Support
        </button>
        <button style={{ padding: 12, borderRadius: 8, background: "#ff944d", color: "#fff", fontSize: 16 }}>
          ❓ FAQs
        </button>
      </div>
    </div>
  )
}

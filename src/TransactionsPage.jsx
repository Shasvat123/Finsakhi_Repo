import React, { useState, useEffect, useRef } from "react"
import Chart from "chart.js/auto"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([
    { id: 1, type: "income", label: "Self Help Group Loan", amount: 5000, date: "2025-11-01" },
    { id: 2, type: "expense", label: "Groceries", amount: 1200, date: "2025-11-05" },
    { id: 3, type: "saving", label: "Monthly Savings", amount: 1000, date: "2025-11-10" }
  ])

  const [newTx, setNewTx] = useState({ type: "expense", label: "", amount: "", date: "" })

  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const totalSaving = transactions.filter(t => t.type === "saving").reduce((sum, t) => sum + t.amount, 0)

  useEffect(() => {
    if (chartInstanceRef.current) chartInstanceRef.current.destroy()
    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "pie",
      data: {
        labels: ["Income", "Expenses", "Savings"],
        datasets: [
          {
            data: [totalIncome, totalExpense, totalSaving],
            backgroundColor: ["#4caf50", "#ff944d", "#2196f3"]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } }
      }
    })
  }, [transactions])

  function addTransaction(e) {
    e.preventDefault()
    if (!newTx.label || !newTx.amount || !newTx.date) return alert("Please fill all fields")
    const tx = {
      id: Date.now(),
      type: newTx.type,
      label: newTx.label,
      amount: Number(newTx.amount),
      date: newTx.date
    }
    setTransactions([...transactions, tx])
    setNewTx({ type: "expense", label: "", amount: "", date: "" })
  }

  return (
    <div className="card" style={{ color: "#000" }}>
      <h2 className="card-title">Transactions</h2>

      {/* Summary row */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 8, fontSize: 18, fontWeight: 600 }}>
        <div>💰 ₹{totalIncome}</div>
        <div>🛒 ₹{totalExpense}</div>
        <div>🌱 ₹{totalSaving}</div>
      </div>

      {/* Compact chart */}
      <div style={{ height: 150, marginBottom: 12 }}>
        <canvas ref={chartRef}></canvas>
      </div>

      {/* Transaction feed */}
      <div style={{ display: "grid", gap: 12 }}>
        {transactions.map(t => (
          <div key={t.id} style={{
            padding: 14,
            borderRadius: 12,
            background: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#000"
          }}>
            {/* Left side: icon + reason + date */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 28 }}>
                {t.type === "income" ? "💰" : t.type === "expense" ? "🛒" : "🌱"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: "#000" }}>{t.label}</div>
                <div style={{ fontSize: 16, color: "#000" }}>Date: {t.date}</div>
              </div>
            </div>

            {/* Right side: amount */}
            <div style={{
              fontWeight: 800,
              fontSize: 18,
              color: t.type === "income" ? "#4caf50" : t.type === "expense" ? "#ff944d" : "#2196f3"
            }}>
              ₹{t.amount}
            </div>
          </div>
        ))}
      </div>

      {/* Add Transaction Form */}
      <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "#000" }}>
        <h3 style={{ marginBottom: 12 }}>➕ Add Transaction</h3>
        <form onSubmit={addTransaction} style={{ display: "grid", gap: 10 }}>
          <select value={newTx.type} onChange={e => setNewTx({ ...newTx, type: e.target.value })}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="saving">Saving</option>
          </select>
          <input
            type="text"
            placeholder="What was this for?"
            value={newTx.label}
            onChange={e => setNewTx({ ...newTx, label: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount (₹)"
            value={newTx.amount}
            onChange={e => setNewTx({ ...newTx, amount: e.target.value })}
          />
          <input
            type="date"
            value={newTx.date}
            onChange={e => setNewTx({ ...newTx, date: e.target.value })}
          />
          <button
            type="submit"
            style={{ fontSize: 16, padding: "10px 20px", background: "#4caf50", color: "#fff", borderRadius: 8 }}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  )
}

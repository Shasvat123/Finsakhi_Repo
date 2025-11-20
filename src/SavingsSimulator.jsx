import React, { useState, useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

// Define translations for all text strings on the page
const SAVINGS_TEXTS = {
  'en-IN': {
    title: "Savings Simulator",
    monthlyLabel: "Monthly saving:",
    durationLabel: "Duration:",
    monthsUnit: "months",
    goalLabel: "Goal:",
    projectedTitle: "Projected savings:",
    baseInterest: "Base: ₹{total} + Interest: ₹{interest}",
    goalAchieved: "Goal achieved!",
    progress: "Progress: {progress}%",
    withoutInterest: "Without Interest",
    withInterest: "With Interest",
    presetCollege: "College Fund",
    presetEmergency: "Emergency Fund",
    presetBusiness: "Small Business",
    savePlan: "Save Plan",
    share: "Share",
    planSaved: "Plan saved (mock)",
    planShared: "Plan shared (mock)",
  },
  'hi-IN': {
    title: "बचत सिमुलेटर",
    monthlyLabel: "मासिक बचत:",
    durationLabel: "अवधि:",
    monthsUnit: "महीने",
    goalLabel: "लक्ष्य:",
    projectedTitle: "अनुमानित बचत:",
    baseInterest: "मूल राशि: ₹{total} + ब्याज: ₹{interest}",
    goalAchieved: "लक्ष्य प्राप्त हुआ!",
    progress: "प्रगति: {progress}%",
    withoutInterest: "बिना ब्याज के",
    withInterest: "ब्याज सहित",
    presetCollege: "कॉलेज फंड",
    presetEmergency: "आपातकालीन निधि",
    presetBusiness: "छोटा व्यवसाय",
    savePlan: "योजना सहेजें",
    share: "साझा करें",
    planSaved: "योजना सहेजी गई (मॉक)",
    planShared: "योजना साझा की गई (मॉक)",
  },
  // Add other language translations here (kn-IN, ta-IN, mr-IN, bn-IN)
};


export default function SavingsSimulator({ lang }) { // 👈 Accept the 'lang' prop
  const [monthly, setMonthly] = useState(500)
  const [months, setMonths] = useState(12)
  const [goal, setGoal] = useState(12000)
  const [rate, setRate] = useState(5)

  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

  const total = monthly * months
  const interest = Math.round(total * (rate/100) * (months/12))
  const finalAmount = total + interest
  const progress = Math.min(100, Math.round((finalAmount/goal)*100))

  // Function to get the correct text based on the current language
  const getText = (key, replacements = {}) => {
    let text = (SAVINGS_TEXTS[lang] && SAVINGS_TEXTS[lang][key]) || SAVINGS_TEXTS['en-IN'][key];
    // Replace placeholders dynamically
    for (const [placeholder, value] of Object.entries(replacements)) {
        text = text.replace(`{${placeholder}}`, value);
    }
    return text;
  };
  
  // Update presets to use the translation function
  const presets = [
    { name: getText('presetCollege'), monthly:2000, months:36, goal:75000 },
    { name: getText('presetEmergency'), monthly:1000, months:12, goal:15000 },
    { name: getText('presetBusiness'), monthly:5000, months:24, goal:120000 }
  ]

  // Build chart data dynamically
  useEffect(() => {
    const labels = Array.from({ length: months }, (_, i) => `${getText('monthsUnit')} ${i+1}`)
    const savings = labels.map((_, i) => monthly * (i+1))
    const withInterest = labels.map((_, i) => {
      const base = monthly * (i+1)
      const int = Math.round(base * (rate/100) * ((i+1)/12))
      return base + int
    })

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }
    
    // Ensure chart labels are translated
    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: getText('withoutInterest'), data: savings, borderColor: '#ff944d', fill: false },
          { label: getText('withInterest'), data: withInterest, borderColor: '#4caf50', fill: false }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    })
  }, [monthly, months, rate, lang]) // 👈 Re-run effect when lang changes

  // Replace default alert() with mock message box for better UX
  const mockMessageBox = (message) => {
    // In a production app, this would be a custom modal or toast notification.
    console.log(`[MOCK MESSAGE]: ${message}`);
    // You can temporarily use a simple state to display this message if needed
    // setMockMessage(message);
    // For now, we'll rely on the console log as per instructions.
  };


  return (
    <div className="card">
      <h2 className="card-title">{getText('title')}</h2>

      {/* Sliders */}
      <div style={{ display:'grid', gap:12 }}>
        <label>{getText('monthlyLabel')} ₹{monthly}</label>
        <input type="range" min="100" max="10000" step="100"
          value={monthly} onChange={e=>setMonthly(Number(e.target.value))} />

        <label>{getText('durationLabel')} {months} {getText('monthsUnit')}</label>
        <input type="range" min="1" max="120"
          value={months} onChange={e=>setMonths(Number(e.target.value))} />

        <label>{getText('goalLabel')} ₹{goal}</label>
        <input type="range" min="1000" max="200000" step="1000"
          value={goal} onChange={e=>setGoal(Number(e.target.value))} />

        <label>{getText('rateLabel') || 'Interest rate:'} {rate}%</label> {/* Note: Rate label added here */}
        <input type="range" min="0" max="15" step="0.5"
          value={rate} onChange={e=>setRate(Number(e.target.value))} />
      </div>

      {/* Chart */}
      <div style={{ marginTop:20 }}>
        <canvas ref={chartRef}></canvas>
      </div>

      {/* Summary */}
      <div style={{ marginTop:16, padding:12, borderRadius:12, background:'rgba(255,255,255,0.02)' }}>
        <div style={{ fontSize:16, fontWeight:800 }}>{getText('projectedTitle')} ₹{finalAmount}</div>
        <div style={{ color:'var(--muted)', marginTop:6 }}>
          {getText('baseInterest', { total: total, interest: interest })}
        </div>
        <div style={{ marginTop:8, height:10, background:'rgba(255,255,255,0.06)', borderRadius:10 }}>
          <div style={{
            width:`${progress}%`,
            height:'100%',
            background: progress >= 100 ? 'linear-gradient(90deg,#4caf50,#81c784)' : 'linear-gradient(90deg,#ffb400,#ff944d)',
            borderRadius:10
          }} />
        </div>
        <div style={{ marginTop:8, color: progress>=100 ? '#bff0b3' : '#ffd580' }}>
          {progress>=100 ? getText('goalAchieved') : getText('progress', { progress: progress })}
        </div>
      </div>

      {/* Presets */}
      <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
        {presets.map(p => (
          <button
            key={p.name}
            className="icon-btn"
            onClick={() => { setMonthly(p.monthly); setMonths(p.months); setGoal(p.goal); }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:8, marginTop:12 }}>
        <button className="mic-btn" onClick={() => mockMessageBox(getText('planSaved'))}>{getText('savePlan')}</button>
        <button className="icon-btn" onClick={() => mockMessageBox(getText('planShared'))}>{getText('share')}</button>
      </div>
    </div>
  )
}
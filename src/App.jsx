import React, { useState, useEffect, useRef } from 'react'
import TextFallback from './TextFallback'
import TTSControls from './TTSControls'
import SchemesPage from './SchemesPage'
import TransactionsPage from './TransactionsPage'
import SavingsSimulator from './SavingsSimulator'
import KYCPage from './KYCPage'
import EducationHub from './EducationHub'
import HelpSupport from './HelpSupport'
import ProfilePage from './ProfilePage'
import AppShell from './AppShell'

const SAMPLE_COMMANDS = {
  "en-IN": ["balance", "send 200 to Sita", "which schemes are for me"],
  "hi-IN": ["पैसे भेजो", "बैलेंस बताओ", "कौन सा योजना मिल सकती है"],
  "kn-IN": ["ಹಣ ಕಳುಹಿಸಿ", "ಬ್ಯಾಲೆನ್ಸ್ ತಿಳಿಸಿ", "ಯೋಜನೆಗಳಿವ"],
  "ta-IN": ["பணம் அனுப்பு", "பண விவரம்", "யோஜனைகள் என்ன"],
  "mr-IN": ["पैसे पाठवा", "बॅलन्स सांगा", "कोणती योजना मिळेल"],
  "bn-IN": ["টাকা দাও", "ব্যালেন্স জানাও", "কোনো স্কিম আছে"]
}

const LANGUAGES = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'bn-IN', label: 'Bengali' },
];

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function App(){
  const [isListening, setIsListening] = useState(false)
  const [messages, setMessages] = useState([])
  const [lang, setLang] = useState('en-IN')
  const [ttsRate, setTtsRate] = useState(1)
  const [route, setRoute] = useState('home')

  const lastBotRef = useRef('')
  const recognitionRef = useRef(null)

  function addMessage(text, who='bot'){
    setMessages(m => [...m, {who, text}])
    if(who==='bot') lastBotRef.current = text
  }

  function speakText(text){
    if(!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    u.rate = ttsRate || 1
    window.speechSynthesis.speak(u)
  }

  function handleRepeat(){
    if(lastBotRef.current) speakText(lastBotRef.current)
  }

  function toggleListen(){
    setIsListening(l => !l) 
  }

  // EFFECT HOOK TO MANAGE SPEECH RECOGNITION LIFECYCLE
  useEffect(() => {
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang; // Recognition language is set by state
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      addMessage(transcript, 'user');
      processText(transcript);
      setIsListening(false); 
    };

    recognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
         addMessage("Microphone access denied. Please enable it in your browser settings.", 'bot');
      } else {
         addMessage("I couldn't hear you. Please try again.", 'bot');
      }
    };

    recognition.onend = () => {
      if(isListening) {
          setIsListening(false);
      }
    };
    
    recognitionRef.current = recognition; 

    return () => {
      recognition.stop(); 
    };
  }, [lang]); // Re-initialize recognition when language changes

  // EFFECT HOOK TO START/STOP LISTENING BASED ON STATE
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      try {
        recognition.start();
      } catch (e) {
        if (e.message !== 'recognition has already started') {
          console.error("Error starting recognition:", e);
        }
      }
    } else {
      recognition.stop();
    }
  }, [isListening]); 


  async function processText(text){
    const t = text.toLowerCase()
    const balanceKeywords = ['balance','बैलेंस','ಬ್ಯಾಲೆನ್ಸ್','பண','ব্যালেন্স','बॅलन्स']
    const sendKeywords = ['send','transfer','pay','पैसे','ಕಳುಹಿಸಿ','पाठवा','টাকা','ಅನುಪ್ಪು']
    const schemeKeywords = ['scheme','योजना','ಯೋಜನೆ','யோஜனை','স্কিম','कोण']
    const kycKeywords = ['kyc','aadhar','id','verify','सत्यापित','ನವೀಕರಣ','உறுತಿசெய்']

    if(balanceKeywords.some(k=>t.includes(k))){
      const rep = "Your balance is ₹5000"
      addMessage(rep,'bot'); speakText(rep); return
    }
    if(sendKeywords.some(k=>t.includes(k)) && /\d+/.test(t)){
      const amount = t.match(/(\d+)/)[1]
      const beneficiary = 'saved contact'
      const confirm = `Confirm: send ₹${amount} to ${beneficiary}?`
      addMessage(confirm,'bot'); speakText(confirm); return
    }
    if(schemeKeywords.some(k=>t.includes(k))){
      const rep = "You are eligible for 2 schemes: PMJDY and Sukanya Samriddhi"
      addMessage(rep,'bot'); speakText(rep); return
    }
    if(kycKeywords.some(k=>t.includes(k))){
      const rep = "KYC verification required. Please upload Aadhaar."
      addMessage(rep,'bot'); speakText(rep); return
    }

    const def = {
      "en-IN":"I didn't understand fully. Try 'balance' or 'send 200 to Sita'.",
      "hi-IN":"मैं समझा नहीं। कहें: 'बैलेंस' या 'पैसे भेजो'।",
      "kn-IN":"ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಿಲ್ಲ. 'ಬ್ಯಾಲೆನ್ಸ್' ಅಥವಾ 'ಹಣ ಕಳುಹಿಸಿ' ಹೇಳಿ.",
      "ta-IN":"நான் புரிந்துகொள்ளவில்லை. 'பண விவரம்' அல்லது 'பணம் அனுப்பு' என்று சொல்.",
      "mr-IN":"मला समजले नाही। 'बॅलन्स' किंवा 'पैसे पाठवा' म्हणा।",
      "bn-IN":"আমি বুঝতে পারিনি। বলুন: 'ব্যালেন্স' বা 'টাকা দাও'।"
    }
    const reply = def[lang]||def['en-IN']
    addMessage(reply,'bot'); speakText(reply)
  }

  function renderSamples(){
    const list = SAMPLE_COMMANDS[lang] || SAMPLE_COMMANDS['en-IN']
    return list.map((s,i)=> <div key={i} className='sample'>{s}</div>)
  }

  function DiagnosticsPanel({ onTestTranscript }) {
    const [txt, setTxt] = useState('')
    return (
      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-title">Diagnostics</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input
            value={txt}
            onChange={e => setTxt(e.target.value)}
            placeholder="Type test transcript"
            style={{ flex: 1, padding: 8 }}
          />
          <button
            className="icon-btn"
            onClick={() => { if (txt.trim()) { onTestTranscript(txt.trim()); setTxt('') } }}
          >
            Send
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      
      <AppShell route={route} setRoute={setRoute}>
        
        {/* Render selected page */}
        {route === 'home' ? (
          <main>
            <section className="card">
              <div className="actions-header">
                <div className="avatar">👩🏽‍💼</div>
                <div>
                  <div className="instructions">Ask me anything about your money</div>
                  <div className="samples" aria-hidden="true">
                    {renderSamples()}
                  </div>
                  
                  {/* 👇 Language Selector UI */}
                  <div className="card" style={{ marginTop: 12 }}>
                    <div className="card-title">Select Language</div>
                    <select 
                      value={lang} 
                      onChange={(e) => setLang(e.target.value)}
                      style={{ marginTop: 8, padding: 10, width: '100%', color: '#fff', background: 'rgba(255,255,255,0.06)' }}
                    >
                      {LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* 👆 END Language Selector UI */}

                  <DiagnosticsPanel
                    onTestTranscript={(txt) => { addMessage(txt, 'user'); processText(txt); }}
                  />

                  <TextFallback
                    templates={SAMPLE_COMMANDS[lang]}
                    onSubmit={(txt) => { addMessage(txt, 'user'); processText(txt); }}
                  />

                  <TTSControls
                    rate={ttsRate}
                    onChangeRate={(r) => setTtsRate(r)}
                    onRepeat={handleRepeat}
                  />
                </div>
              </div>
            </section>

            <section className="card">
              <h2 className="card-title">Conversation</h2>
              <div className="conversation" aria-live="polite">
                <div className="messages">
                  {messages.map((m, i)=>(
                    <div key={i} className={`msg ${m.who==='user'?'user':'bot'}`}>{m.text}</div>
                  ))}
                </div>
              </div>
            </section>
          </main>
        ) : route === 'transactions' ? (
          <TransactionsPage lang={lang} /> // ✅ lang prop added
        ) : route === 'schemes' ? (
          <SchemesPage lang={lang} />      // ✅ lang prop added
        ) : route === 'savings' ? (
          <SavingsSimulator lang={lang} /> // ✅ lang prop added
        ) : route === 'kyc' ? (
          <KYCPage lang={lang} />          // ✅ lang prop added
        ) : route === 'education' ? (
          <EducationHub lang={lang} />     // ✅ lang prop added
        ) : route === 'help' ? (
          <HelpSupport lang={lang} />      // ✅ lang prop added
        ) : route === 'profile' ? (
          <ProfilePage lang={lang} />      // ✅ lang prop added
        ) : null}

      </AppShell>

      {/* Sticky mic button is kept outside AppShell for fixed positioning */}
      <div className="mic-float">
        <button 
          className={`mic-btn ${isListening ? 'listening' : ''}`} 
          onClick={toggleListen} 
          aria-label="Speak"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path 
              fill="currentColor" 
              d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zM12 17v4"
            />
          </svg>
          <span>{isListening ? 'Listening...' : 'Speak'}</span>
        </button>
      </div>
    </div>
  )
}
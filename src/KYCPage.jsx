import React, { useState } from "react"

// Define translations for all text strings on the page
const KYC_TEXTS = {
    'en-IN': {
        title: "Verify Your ID",
        step1Title: "Step 1: Upload Your Aadhaar / ID",
        step1Desc: "Choose a clear photo of your Aadhaar card or other ID",
        verifying: "⏳ Checking your ID…",
        verified: "✅ ID Verified Successfully",
        step2Title: "Step 2:",
        previewID: "Preview your ID", // 👈 ADDED NEW KEY
        step4Title: "Step 4:",
        confirmKYC: "Confirm your KYC",
        confirmButton: "✅ Confirm",
        successMessage: "🎉 Your KYC is successfully confirmed!",
        uploadButton: "Choose File", 
    },
    'hi-IN': {
        title: "अपनी पहचान सत्यापित करें",
        step1Title: "चरण 1: अपना आधार / आईडी अपलोड करें",
        step1Desc: "अपने आधार कार्ड या अन्य आईडी का एक स्पष्ट फोटो चुनें",
        verifying: "⏳ आपकी आईडी की जाँच हो रही है…",
        verified: "✅ आईडी सफलतापूर्वक सत्यापित हो गई है",
        step2Title: "चरण 2:",
        previewID: "अपनी आईडी का पूर्वावलोकन करें", // 👈 ADDED HINDI TRANSLATION
        step4Title: "चरण 4:",
        confirmKYC: "अपने KYC की पुष्टि करें",
        confirmButton: "✅ पुष्टि करें",
        successMessage: "🎉 आपका KYC सफलतापूर्वक पुष्टि हो गया है!",
        uploadButton: "फ़ाइल चुनें",
    },
    // Add other language translations here (kn-IN, ta-IN, mr-IN, bn-IN)
};

export default function KYCPage({ lang }) { 
    const [fileName, setFileName] = useState(null)
    const [preview, setPreview] = useState(null)
    const [status, setStatus] = useState("idle") // idle | verifying | verified | confirmed

    // Function to get the correct text based on the current language
    const getText = (key) => {
        // Fallback to English if the translation is missing for the current language
        return (KYC_TEXTS[lang] && KYC_TEXTS[lang][key]) || KYC_TEXTS['en-IN'][key];
    };

    function onFile(e) {
        const f = e.target.files?.[0]
        if (!f) return
        setFileName(f.name)
        setPreview(URL.createObjectURL(f))

        // simulate verification delay
        setStatus("verifying")
        setTimeout(() => setStatus("verified"), 1500)
    }

    return (
        <div className="card">
            <h2 className="card-title">{getText('title')}</h2>

            {/* Progress bar */}
            <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 8, background: fileName ? "#4caf50" : "#ccc", borderRadius: 4 }} />
                <div style={{ flex: 1, height: 8, background: preview ? "#4caf50" : "#ccc", borderRadius: 4 }} />
                <div style={{ flex: 1, height: 8, background: status === "verified" || status === "confirmed" ? "#4caf50" : "#ccc", borderRadius: 4 }} />
                <div style={{ flex: 1, height: 8, background: status === "confirmed" ? "#4caf50" : "#ccc", borderRadius: 4 }} />
            </div>

            {/* Step 1: Upload */}
            <div style={{
                marginBottom: 20,
                padding: 16,
                border: "2px dashed #4caf50",
                borderRadius: 12,
                textAlign: "center",
                background: "rgba(255,255,255,0.05)"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                    {getText('step1Title')}
                </div>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📄</div>
                <div style={{ color: "var(--muted)", marginBottom: 12 }}>
                    {getText('step1Desc')}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={onFile}
                    style={{
                        display: "block",
                        margin: "0 auto",
                        padding: "8px 16px",
                        borderRadius: 8,
                        background: "#4caf50",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: 16
                    }}
                />
            </div>

            {/* Step 2: Preview */}
            {preview && (
                <div style={{ marginBottom: 20 }}>
                    <strong>{getText('step2Title')}</strong> {getText('previewID')} {/* 👈 FIX APPLIED HERE */}
                    <div style={{ marginTop: 8 }}>
                        <img
                            src={preview}
                            alt="Uploaded ID"
                            style={{ maxWidth: "100%", borderRadius: 8, border: "2px solid #4caf50" }}
                        />
                    </div>
                </div>
            )}

            {/* Step 3: Verification */}
            {status === "verifying" && (
                <div style={{ marginBottom: 20, color: "#ff944d", fontWeight: 600 }}>
                    {getText('verifying')}
                </div>
            )}
            {status === "verified" && (
                <div style={{ marginBottom: 20, color: "#4caf50", fontWeight: 700 }}>
                    {getText('verified')}
                </div>
            )}

            {/* Step 4: Confirm */}
            {status === "verified" && (
                <div>
                    <strong>{getText('step4Title')}</strong> {getText('confirmKYC')}
                    <div style={{ marginTop: 8 }}>
                        <button
                            className="mic-btn"
                            style={{
                                fontSize: 18,
                                padding: "10px 20px",
                                background: "#4caf50",
                                color: "#fff",
                                borderRadius: 8
                            }}
                            onClick={() => setStatus("confirmed")}
                        >
                            {getText('confirmButton')}
                        </button>
                    </div>
                </div>
            )}

            {/* Success message after confirm */}
            {status === "confirmed" && (
                <div
                    style={{
                        marginTop: 20,
                        padding: 16,
                        borderRadius: 12,
                        background: "rgba(76,175,80,0.1)",
                        color: "#4caf50",
                        fontWeight: 700,
                        textAlign: "center"
                    }}
                >
                    {getText('successMessage')}
                </div>
            )}
        </div>
    )
}
// อ่านออกเสียงภาษาอังกฤษด้วยเสียงสังเคราะห์ของเบราว์เซอร์ (Web Speech API)
export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

let voice = null
function pickVoice() {
  const voices = window.speechSynthesis.getVoices()
  voice =
    voices.find((v) => v.lang === 'en-US' && /natural|google|samantha/i.test(v.name)) ||
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang.startsWith('en')) ||
    null
}
if (canSpeak) {
  pickVoice()
  window.speechSynthesis.addEventListener?.('voiceschanged', pickVoice)
}

// ตัดส่วนที่ไม่ใช่คำพูดออก เช่น (n.) /t/ และ ... ก่อนอ่าน
export const cleanForSpeech = (text) =>
  text.replace(/\(.*?\)|\/.*?\/|\.\.\./g, ' ').replace(/→.*/, '').replace(/\s+/g, ' ').trim()

export function speak(text, rate = 0.9) {
  if (!canSpeak) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(cleanForSpeech(text))
  u.lang = 'en-US'
  u.rate = rate
  if (voice) u.voice = voice
  window.speechSynthesis.speak(u)
}

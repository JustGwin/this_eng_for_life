import { useState } from 'react'
import { canSpeak, speak } from '../speech.js'

// ปุ่มฟังเสียง (ซ่อนถ้าเบราว์เซอร์อ่านออกเสียงไม่ได้)
export function Say({ text, label, slow }) {
  if (!canSpeak) return null
  return (
    <button
      type="button"
      className="say"
      onClick={(e) => { e.stopPropagation(); speak(text, slow ? 0.7 : 0.9) }}
      aria-label={`ฟังเสียง: ${label ?? text}`}
      title={slow ? 'ฟังแบบช้า' : 'ฟังเสียง'}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
        <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {slow && <span className="say-slow">ช้า</span>}
    </button>
  )
}

export function CopyButton({ text, label = 'คัดลอก' }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      setTimeout(() => setDone(false), 1500)
    } catch {
      // clipboard ใช้ไม่ได้ (เช่น ไม่ใช่ https) — ผู้ใช้ยังเลือกข้อความเองได้
    }
  }
  return <button type="button" className="ghost" onClick={copy}>{done ? '✓ คัดลอกแล้ว' : label}</button>
}

export function Check({ checked, onChange, children, className = '' }) {
  return (
    <label className={`topic-check ${checked ? 'is-checked' : ''} ${className}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="box" aria-hidden="true" />
      <span>{children}</span>
    </label>
  )
}

export function Stat({ value, label }) {
  return (
    <div className="kpi">
      <dt>{label}</dt>
      <dd className="num">{value}</dd>
    </div>
  )
}

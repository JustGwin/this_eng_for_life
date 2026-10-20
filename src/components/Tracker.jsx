import { RUBRIC, WEEKLY_CHECKS, WEEKS } from '../data/course.js'
import { todayLessonIndex } from '../data/schedule.js'
import { useStored } from '../useStored.js'
import { Check } from './ui.jsx'

export default function Tracker() {
  const [week, setWeek] = useStored('en-tracker-week', Math.floor(todayLessonIndex() / 7) + 1)
  const [checks, setChecks] = useStored('en-weekly', {})
  const [scores, setScores] = useStored('en-scores', {})

  const w = WEEKS[week - 1]
  const wk = checks[week] || {}
  const sc = scores[week] || {}
  const setScore = (patch) => setScores({ ...scores, [week]: { ...sc, ...patch } })
  const avg = (s) => {
    const vals = RUBRIC.map((r) => s?.[r.id]).filter(Boolean)
    return vals.length === RUBRIC.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
  }

  return (
    <section className="stack">
      <div className="seg-control" role="tablist" aria-label="เลือกสัปดาห์">
        {WEEKS.map((x) => (
          <button key={x.week} role="tab" aria-selected={x.week === week} onClick={() => setWeek(x.week)}>W{x.week}</button>
        ))}
      </div>

      <div className="dash-card">
        <p className="eyebrow">สัปดาห์ {week} · {w.level}</p>
        <h2>Checklist: {w.title}</h2>
        <div className="checks-grid">
          {WEEKLY_CHECKS.map((c, i) => (
            <Check key={c} checked={!!wk[i]} onChange={(v) => setChecks({ ...checks, [week]: { ...wk, [i]: v } })}>{c}</Check>
          ))}
        </div>
      </div>

      <div className="dash-card">
        <h2>🎤 คะแนนสอบพูดสัปดาห์ {week}</h2>
        <p className="muted small">ฟังเสียงที่อัดไว้ตอนสอบ แล้วให้คะแนนแต่ละด้าน 1–5 ตามเกณฑ์ในแท็บ "ฝึกพูด"</p>
        <div className="ratings">
          {RUBRIC.map((r) => (
            <fieldset key={r.id} className="rating">
              <legend>{r.name}</legend>
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n}>
                  <input type="radio" name={`r-${week}-${r.id}`} checked={sc[r.id] === n} onChange={() => setScore({ [r.id]: n })} />
                  <span>{n}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>
        <label className="field">
          <span>จุดที่ต้องแก้สัปดาห์หน้า</span>
          <textarea rows="3" value={sc.note || ''} onChange={(e) => setScore({ note: e.target.value })} placeholder="เช่น เสียง th ยังไม่ชัด, หยุดคิดนานตอนเล่าเรื่องในอดีต" />
        </label>
      </div>

      <div className="dash-card">
        <h2>พัฒนาการคะแนนพูด</h2>
        <p className="muted small">คะแนนเฉลี่ย 5 ด้าน (เต็ม 5) ของแต่ละสัปดาห์ จะแสดงเมื่อให้คะแนนครบทุกด้านแล้ว</p>
        <ul className="score-bars">
          {WEEKS.map((x) => {
            const a = avg(scores[x.week])
            return (
              <li key={x.week}>
                <span className="muted small">W{x.week}</span>
                <span className="score-track"><span className="score-fill" style={{ width: a ? `${(a / 5) * 100}%` : 0 }} /></span>
                <span className="num small">{a ? a.toFixed(1) : '–'}</span>
              </li>
            )
          })}
        </ul>
      </div>
      <p className="muted small">ข้อมูลทั้งหมดเก็บอยู่ในเบราว์เซอร์นี้เท่านั้น ถ้าล้างข้อมูลเว็บ ข้อมูลจะหายไปด้วย</p>
    </section>
  )
}

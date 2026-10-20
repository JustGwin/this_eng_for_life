import { AI_PROMPT, PARTNERS, PRONUNCIATION, RESCUE_PHRASES, RUBRIC, SPEAKING_LOOP, WEEKS } from '../data/course.js'
import { CopyButton, Say } from './ui.jsx'

export default function Speaking() {
  return (
    <section className="stack">
      <div className="dash-card">
        <p className="eyebrow">ระบบฝึกพูด</p>
        <h2>6 ขั้นที่ทำทุกวันให้พูดได้จริง</h2>
        <p className="muted">ทักษะพูดได้มาจากการพูดออกมาเองซ้ำ ๆ การอ่านหรือฟังอย่างเดียวไม่ทำให้พูดได้ ทุกวันในคอร์สจึงบังคับให้พูดอย่างน้อย 45 นาที</p>
        <ol className="loop">
          {SPEAKING_LOOP.map((s, i) => (
            <li key={s.step}>
              <span className="loop-num">{i + 1}</span>
              <div><strong>{s.step}</strong><p className="muted small">{s.desc}</p></div>
            </li>
          ))}
        </ol>
      </div>

      <div className="dash-card">
        <h2>🆘 วลีช่วยชีวิต เมื่อพูดไม่ออก</h2>
        <p className="muted small">จำ 10 ประโยคนี้ให้ได้ตั้งแต่สัปดาห์แรก จะได้ไม่ต้องหยุดเงียบเวลาติด</p>
        <ul className="phrase-list cols">
          {RESCUE_PHRASES.map(([en, th]) => (
            <li key={en}><Say text={en} /><div><p className="phrase-en">{en}</p><p className="muted small">{th}</p></div></li>
          ))}
        </ul>
      </div>

      <div className="dash-card">
        <h2>👄 ออกเสียงให้ชัด: จุดที่คนไทยพลาดบ่อย</h2>
        <div className="pron-grid">
          {PRONUNCIATION.map((p) => (
            <article key={p.issue} className="pron">
              <h3>{p.issue}</h3>
              <p className="muted small">{p.tip}</p>
              <ul className="pairs">
                {p.pairs.map(([a, b]) => (
                  <li key={a}>
                    <PairItem text={a} />
                    <span className="muted">vs</span>
                    <PairItem text={b} />
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="muted small">เสียงอ่านมาจากเสียงสังเคราะห์ของเบราว์เซอร์ ถ้าอยากฟังเสียงคนจริง ให้ใช้ Cambridge Dictionary หรือ YouGlish</p>
      </div>

      <div className="two-col">
        <div className="dash-card">
          <h2>👥 หาคู่ซ้อมพูด</h2>
          <ul className="plain-list">
            {PARTNERS.map((p) => <li key={p.name}><strong>{p.name}</strong><p className="muted small">{p.desc}</p></li>)}
          </ul>
        </div>
        <div className="dash-card">
          <h2>🤖 Prompt สำหรับซ้อมกับ AI</h2>
          <p className="muted small">ในหน้าบทเรียนแต่ละวันจะใส่หัวข้อและคำศัพท์ของวันนั้นให้อัตโนมัติ</p>
          <pre className="prompt">{AI_PROMPT}</pre>
          <CopyButton text={AI_PROMPT} label="คัดลอก prompt" />
        </div>
      </div>

      <div className="dash-card">
        <h2>📏 เกณฑ์ให้คะแนนการพูด (ใช้ทุกวันเบา)</h2>
        <div className="table-scroll">
          <table className="table rubric">
            <thead><tr><th>ด้าน</th><th>1 คะแนน</th><th>3 คะแนน</th><th>5 คะแนน</th></tr></thead>
            <tbody>
              {RUBRIC.map((r) => <tr key={r.id}><th scope="row">{r.name}</th><td>{r.d1}</td><td>{r.d3}</td><td>{r.d5}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dash-card">
        <h2>🎤 โจทย์สอบพูดทั้ง 8 สัปดาห์</h2>
        <ol className="tests">
          {WEEKS.map((w) => {
            const t = w.days.find((d) => d.light)
            return (
              <li key={w.week}>
                <p className="eyebrow">สัปดาห์ {w.week} · {w.level}</p>
                <p className="phrase-en">{t.test} <Say text={t.test} label="โจทย์" /></p>
                <p className="muted small">{t.testTh}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

// คำที่เขียนแยกพยางค์ (เช่น pi-ki-tup) เป็นแค่ตัวช่วยอ่าน ไม่ต้องมีปุ่มเสียง
function PairItem({ text }) {
  const sayable = !/[a-z]-[a-z]/i.test(text)
  return (
    <span className="pair-item">
      {text}
      {sayable && <Say text={text.toLowerCase()} />}
    </span>
  )
}

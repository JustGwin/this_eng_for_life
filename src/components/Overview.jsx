import { ALL_PATTERNS, ALL_PHRASES, ALL_WORDS, DAY_BLOCKS, STAGES, TOTAL_DAYS, WEEKS } from '../data/course.js'
import { Stat } from './ui.jsx'

export default function Overview({ openLesson }) {
  return (
    <section className="stack">
      <div className="dash-card">
        <p className="eyebrow">คอร์สภาษาอังกฤษเพื่อการพูด · 2 เดือน</p>
        <h2 className="month-title">พูดได้ใน 8 สัปดาห์</h2>
        <p className="muted">เริ่มจากชีวิตประจำวัน แล้วไปที่ทำงาน ศัพท์ตามสายอาชีพ การสัมภาษณ์งาน จนถึงการนำเสนอและการต่อรอง วันละ 2 ชั่วโมง โดยใช้เวลาเกิน 70% ไปกับการพูดและลงมือทำ</p>
        <dl className="kpis wide">
          <Stat label="วัน" value={TOTAL_DAYS} />
          <Stat label="คำศัพท์" value={ALL_WORDS.length} />
          <Stat label="วลีพร้อมใช้" value={ALL_PHRASES.length} />
          <Stat label="รูปประโยค" value={ALL_PATTERNS.length} />
          <Stat label="สอบพูด" value={WEEKS.length} />
        </dl>
      </div>

      <div className="stage-grid">
        {STAGES.map((s) => (
          <article key={s.id} className="dash-card stage">
            <p className="eyebrow">ช่วง {s.id} · สัปดาห์ {s.weeks[0]}–{s.weeks[1]}</p>
            <h3>{s.title} <span className="level">{s.level}</span></h3>
            <p>{s.goal}</p>
            <h4>จบช่วงนี้ต้องทำได้</h4>
            <ul className="checks">{s.can.map((c) => <li key={c}>{c}</li>)}</ul>
            {WEEKS.filter((w) => w.week >= s.weeks[0] && w.week <= s.weeks[1]).map((w) => (
              <div key={w.week} className="week-block">
                <p className="week-name">สัปดาห์ {w.week}: {w.title}</p>
                <ol className="theme-list">
                  {w.days.map((d, i) => (
                    <li key={i}>
                      <button className="lesson-link" onClick={() => openLesson((w.week - 1) * 7 + i)}>
                        <span className="lesson-wd">D{i + 1}</span>
                        <span>{d.light ? (d.final ? '🏁 สอบพูดครั้งสุดท้าย' : '🌿 วันเบา + สอบพูด') : d.theme}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </article>
        ))}
      </div>

      <div className="two-col">
        <div className="dash-card">
          <h2>หนึ่งวันเรียน (2 ชม.)</h2>
          <ol className="blocks">
            {DAY_BLOCKS.map((b) => (
              <li key={b.time} className={b.active ? 'hands-on' : ''}>
                <span className="time num">{b.time}</span>
                <span><strong>{b.label}</strong> — {b.desc}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="dash-card">
          <h2>หนึ่งสัปดาห์</h2>
          <ul className="plain-list">
            <li><strong>วันที่ 1–6: วันเรียน</strong><p className="muted small">วันละ 1 หัวข้อ มีคำศัพท์ 12 คำ วลี 4 วลี รูปประโยค 2 แบบ ภารกิจพูด 1 อย่าง และคำถามให้ตอบด้วยเสียง 3 ข้อ</p></li>
            <li><strong>วันที่ 7: วันเบา</strong><p className="muted small">ทบทวนคำศัพท์ทั้งสัปดาห์ สอบพูด 3–5 นาทีพร้อมให้คะแนนตัวเอง และทำกิจกรรมสนุก</p></li>
            <li><strong>ความยากเพิ่มขึ้นเรื่อย ๆ</strong><p className="muted small">ไวยากรณ์ไล่จาก present simple → past → present perfect → conditionals → passive → inversion โดยสอดแทรกไว้ในรูปประโยคของแต่ละวัน</p></li>
          </ul>
          <p className="note">ป้ายระดับ (A1–B2) บอกความยากของเนื้อหาแต่ละช่วง ไม่ได้รับประกันระดับภาษาจริงหลังเรียนจบ ถ้าทำครบทุกวัน คุณจะพูดเรื่องที่ฝึกมาได้คล่องจริง ส่วนการขึ้นถึง B2 เต็มรูปแบบมักต้องฝึกต่อเนื่องนานกว่านี้</p>
        </div>
      </div>
    </section>
  )
}

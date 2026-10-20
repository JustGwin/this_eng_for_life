import { AI_PROMPT, DAY_BLOCKS, LIGHT_BLOCKS, RESOURCES, TOTAL_DAYS, WEEKS, lessonKey } from '../data/course.js'
import { dateOfIndex, formatDate } from '../data/schedule.js'
import { Check, CopyButton, Say } from './ui.jsx'

export default function Lesson({ index, setIndex, lessonDone, setLessonDone, known, setKnown }) {
  const week = Math.floor(index / 7) + 1
  const day = (index % 7) + 1
  const w = WEEKS[week - 1]
  const lesson = w.days[day - 1]
  const key = lessonKey(week, day)

  return (
    <section className="stack">
      {/* ---- ตัวเลือกสัปดาห์/วัน ---- */}
      <div className="picker">
        <div className="seg-control" role="tablist" aria-label="เลือกสัปดาห์">
          {WEEKS.map((x) => (
            <button key={x.week} role="tab" aria-selected={x.week === week} onClick={() => setIndex((x.week - 1) * 7)}>
              W{x.week}
            </button>
          ))}
        </div>
        <div className="day-chips" role="tablist" aria-label="เลือกวัน">
          {w.days.map((d, i) => {
            const k = lessonKey(week, i + 1)
            return (
              <button
                key={k}
                role="tab"
                aria-selected={i + 1 === day}
                className={`day-chip${lessonDone[k] ? ' is-done' : ''}`}
                onClick={() => setIndex((week - 1) * 7 + i)}
              >
                <span className="num">D{i + 1}</span>
                <span className="day-chip-name">{d.light ? (d.final ? '🏁 สอบ' : '🌿 วันเบา') : d.theme}</span>
              </button>
            )
          })}
        </div>
      </div>

      <header className="lesson-head dash-card">
        <p className="eyebrow">
          สัปดาห์ {week}: {w.title} · {w.level} · วันที่ {index + 1}/{TOTAL_DAYS} · {formatDate(dateOfIndex(index))}
        </p>
        <h2 className="lesson-title">{lesson.light ? (lesson.final ? 'สอบพูดครั้งสุดท้าย' : 'วันเบา: ทบทวน + สอบพูด') : lesson.theme}</h2>
        {!lesson.light && <p className="lesson-sub">{lesson.en}</p>}
        <ol className="blocks">
          {(lesson.light ? LIGHT_BLOCKS : DAY_BLOCKS).map((b) => (
            <li key={b.time} className={b.active ? 'hands-on' : ''}>
              <span className="time num">{b.time}</span>
              <span><strong>{b.label}</strong> — {b.desc}</span>
            </li>
          ))}
        </ol>
        <p className="muted small">เส้นสีเหลือง = ช่วงลงมือทำ (เกิน 70% ของเวลา)</p>
      </header>

      {lesson.light ? (
        <LightDay week={w} lesson={lesson} known={known} />
      ) : (
        <StudyDay lesson={lesson} week={week} day={day} level={w.level} known={known} setKnown={setKnown} />
      )}

      <div className="lesson-foot">
        <button className="ghost" disabled={index === 0} onClick={() => setIndex(index - 1)}>‹ วันก่อน</button>
        <Check checked={!!lessonDone[key]} onChange={(v) => setLessonDone({ ...lessonDone, [key]: v })} className="done-big">
          เรียนบทนี้เสร็จแล้ว
        </Check>
        <button className="ghost" disabled={index === TOTAL_DAYS - 1} onClick={() => setIndex(index + 1)}>วันถัดไป ›</button>
      </div>
    </section>
  )
}

function StudyDay({ lesson, week, day, level, known, setKnown }) {
  const listen = RESOURCES[lesson.listen[0]]
  const listenUrl = listen.url(lesson.listen[1])
  const listenHow = listen.how ? listen.how(lesson.listen[1]) : lesson.listen[1]
  const prompt = AI_PROMPT
    .replace('{LEVEL}', level)
    .replace('{TOPIC}', lesson.en)
    .replace('{WORDS}', lesson.words.map(([w]) => w).join(', '))
  const knownHere = lesson.words.filter(([w]) => known[`${week}-${day}-${w}`]).length

  return (
    <>
      {/* ---- คำศัพท์ ---- */}
      <div className="dash-card">
        <div className="card-title-row">
          <h2>📚 คำศัพท์ 12 คำ</h2>
          <span className="muted small num">จำได้แล้ว {knownHere}/{lesson.words.length}</span>
        </div>
        <ul className="word-list">
          {lesson.words.map(([word, pos, th, ex]) => {
            const k = `${week}-${day}-${word}`
            return (
              <li key={k} className={`word-item${known[k] ? ' is-known' : ''}`}>
                <div className="word-main">
                  <Say text={word} />
                  <span className="word">{word}</span>
                  <span className="pos">{pos}</span>
                  <span className="th">{th}</span>
                </div>
                <p className="ex">
                  <Say text={ex} label="ประโยคตัวอย่าง" />
                  <span>{ex}</span>
                </p>
                <button
                  className={`known-btn${known[k] ? ' on' : ''}`}
                  aria-pressed={!!known[k]}
                  onClick={() => setKnown({ ...known, [k]: !known[k] })}
                >
                  {known[k] ? '✓ จำได้' : 'จำได้แล้ว?'}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="two-col">
        {/* ---- วลี ---- */}
        <div className="dash-card">
          <h2>💬 วลีพร้อมใช้</h2>
          <ul className="phrase-list">
            {lesson.phrases.map(([en, th]) => (
              <li key={en}>
                <Say text={en} />
                <div><p className="phrase-en">{en}</p><p className="muted small">{th}</p></div>
              </li>
            ))}
          </ul>
        </div>

        {/* ---- รูปประโยค ---- */}
        <div className="dash-card">
          <h2>🧩 รูปประโยค</h2>
          {lesson.patterns.map(([p, th, ex]) => (
            <div key={p} className="pattern">
              <p className="pattern-p">{p}</p>
              <p className="muted small">{th}</p>
              <p className="pattern-ex"><Say text={ex} label="ตัวอย่าง" /><span>{ex}</span></p>
            </div>
          ))}
          <p className="muted small">งาน: แต่งประโยคจากแต่ละรูปแบบเกี่ยวกับชีวิตตัวเอง 5 ประโยค แล้วพูดออกเสียง</p>
        </div>
      </div>

      {/* ---- ฟัง ---- */}
      <div className="dash-card">
        <h2>🎧 ฟัง + Shadowing</h2>
        <p>{listenHow}</p>
        <a className="link-btn" href={listenUrl} target="_blank" rel="noreferrer">เปิด {listen.name} ↗</a>
      </div>

      {/* ---- ภารกิจพูด ---- */}
      <div className="dash-card mission">
        <h2>🗣️ ภารกิจพูดวันนี้</h2>
        <p className="mission-task">{lesson.speak}</p>
        <h3>ตอบคำถามเหล่านี้ด้วยเสียง (ข้อละ 30–60 วินาที)</h3>
        <ol className="ask-list">
          {lesson.ask.map((q) => (
            <li key={q}><Say text={q} /><span>{q}</span></li>
          ))}
        </ol>
        <details className="ai-box">
          <summary>ฝึกกับ AI แบบคุยด้วยเสียง (คัดลอก prompt)</summary>
          <pre className="prompt">{prompt}</pre>
          <CopyButton text={prompt} label="คัดลอก prompt" />
        </details>
      </div>
    </>
  )
}

function LightDay({ week, lesson, known }) {
  const words = week.days.flatMap((d, i) => (d.words || []).map(([w, , th]) => ({ w, th, k: `${week.week}-${i + 1}-${w}` })))
  const notYet = words.filter((x) => !known[x.k])
  return (
    <>
      <div className="dash-card mission">
        <h2>{lesson.final ? '🏁 สอบพูดครั้งสุดท้าย' : '🎤 สอบพูดประจำสัปดาห์'}</h2>
        <p className="quote">“{lesson.test}” <Say text={lesson.test} label="โจทย์สอบพูด" /></p>
        <p>{lesson.testTh}</p>
        <p className="muted small">อัดเสียงรอบเดียวโดยไม่หยุด แล้วไปให้คะแนนตัวเองในแท็บ "ติดตามผล"</p>
      </div>
      <div className="dash-card">
        <div className="card-title-row">
          <h2>📚 คำที่ยังจำไม่ได้ในสัปดาห์นี้</h2>
          <span className="muted small num">{notYet.length}/{words.length} คำ</span>
        </div>
        {notYet.length ? (
          <ul className="chip-row">
            {notYet.map((x) => <li key={x.k} className="chip" title={x.th}>{x.w}<Say text={x.w} /></li>)}
          </ul>
        ) : (
          <p className="empty">จำได้ครบทุกคำแล้ว เยี่ยมมาก 🎉</p>
        )}
        <p className="muted small">ทบทวนคำเหล่านี้ด้วยโหมดแฟลชการ์ดในแท็บ "คลังคำศัพท์"</p>
      </div>
      <div className="dash-card">
        <h2>🌿 กิจกรรมสนุก</h2>
        <p>{lesson.fun}</p>
      </div>
    </>
  )
}

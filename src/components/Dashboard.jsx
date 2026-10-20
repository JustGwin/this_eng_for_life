import { useEffect, useMemo, useRef, useState } from 'react'
import { ALL_WORDS, TOTAL_DAYS, WEEKS, lessonKey } from '../data/course.js'
import {
  HABITS, MONTH_SHORT, MONTH_TH, PLAN_MONTHS, WEEKDAY_SHORT,
  dayKey, formatDate, lessonOfDate, scheduledHabits, todayLessonIndex, dateOfIndex,
} from '../data/schedule.js'
import { useStored } from '../useStored.js'
import { Check, Say, Stat } from './ui.jsx'

const STATUS_LABEL = { done: 'เสร็จแล้ว', missed: 'พลาด', due: 'ต้องทำวันนี้', upcoming: 'ยังไม่ถึง', none: 'ไม่มีในตาราง' }

export default function Dashboard({ lessonDone, setLessonDone, known, openLesson }) {
  const today = new Date()
  const todayKey = dayKey(today)
  const initialMonth = Math.max(0, PLAN_MONTHS.findIndex((x) => x.y === today.getFullYear() && x.m === today.getMonth()))

  const [monthIdx, setMonthIdx] = useState(initialMonth)
  const [log, setLog] = useStored('en-habit-log', {})
  const { y, m } = PLAN_MONTHS[monthIdx]
  const scrollRef = useRef(null)

  // เลื่อน matrix ให้เห็นคอลัมน์วันนี้ (สำคัญบนมือถือ)
  useEffect(() => {
    const box = scrollRef.current
    const th = box?.querySelector('thead th.is-today')
    const label = box?.querySelector('thead th.habit-col')
    if (box) box.scrollLeft = th && label ? Math.max(0, th.offsetLeft - label.offsetWidth - 3 * th.offsetWidth) : 0
  }, [monthIdx])

  const days = useMemo(() => {
    const n = new Date(y, m + 1, 0).getDate()
    return Array.from({ length: n }, (_, i) => {
      const date = new Date(y, m, i + 1)
      const key = dayKey(date)
      return {
        date, key, num: i + 1,
        weekday: WEEKDAY_SHORT[date.getDay()],
        info: lessonOfDate(date),
        scheduled: scheduledHabits(date),
        isToday: key === todayKey,
        isFuture: key > todayKey,
      }
    })
  }, [y, m, todayKey])

  const isDone = (key, id) => !!log[key]?.[id]
  const toggle = (key, id) => setLog({ ...log, [key]: { ...log[key], [id]: !log[key]?.[id] } })
  const status = (day, id) => {
    if (!day.scheduled.includes(id)) return 'none'
    if (isDone(day.key, id)) return 'done'
    if (day.isFuture) return 'upcoming'
    return day.isToday ? 'due' : 'missed'
  }

  // ---- สถิติ ----
  const planDays = days.filter((d) => d.scheduled.length)
  const elapsed = planDays.filter((d) => !d.isFuture)
  const doneCount = (d) => d.scheduled.filter((id) => isDone(d.key, id)).length
  const perfect = elapsed.filter((d) => doneCount(d) === d.scheduled.length).length
  const activeHabits = HABITS.filter((h) => planDays.some((d) => d.scheduled.includes(h.id)))
  const knownCount = ALL_WORDS.filter((w) => known[w.key]).length
  const lessonsDone = Object.values(lessonDone).filter(Boolean).length
  const todayDay = days.find((d) => d.isToday && d.scheduled.length)
  const ring = todayDay
    ? { label: 'วันนี้', done: doneCount(todayDay), total: todayDay.scheduled.length }
    : { label: 'ทั้งเดือน', done: planDays.reduce((s, d) => s + doneCount(d), 0), total: planDays.reduce((s, d) => s + d.scheduled.length, 0) }
  const trend = elapsed.map((d) => ({ day: d.num, pct: Math.round((doneCount(d) / d.scheduled.length) * 100), done: doneCount(d), total: d.scheduled.length }))
  const habitRate = (id) => {
    const due = elapsed.filter((d) => d.scheduled.includes(id))
    return due.length ? Math.round((due.filter((d) => isDone(d.key, id)).length / due.length) * 100) : null
  }

  // ---- บทเรียนวันนี้ ----
  const ti = todayLessonIndex()
  const tw = Math.floor(ti / 7) + 1
  const td = (ti % 7) + 1
  const todayLesson = WEEKS[tw - 1].days[td - 1]

  return (
    <section className="dash">
      <div className="month-nav">
        <button className="icon-btn" onClick={() => setMonthIdx(monthIdx - 1)} disabled={monthIdx === 0} aria-label="เดือนก่อน">‹</button>
        <span className="muted small">เดือน {monthIdx + 1} / {PLAN_MONTHS.length} ของคอร์ส</span>
        <button className="icon-btn" onClick={() => setMonthIdx(monthIdx + 1)} disabled={monthIdx === PLAN_MONTHS.length - 1} aria-label="เดือนถัดไป">›</button>
      </div>

      {/* ---- Month overview ---- */}
      <div className="dash-card overview-card">
        <div>
          <p className="eyebrow">Month overview</p>
          <h2 className="month-title">{MONTH_TH[m]} <span>{y}</span></h2>
          <p className="muted small">คอร์ส 8 สัปดาห์ · เริ่ม {formatDate(dateOfIndex(0))} จบ {formatDate(dateOfIndex(TOTAL_DAYS - 1))}</p>
          <dl className="kpis">
            <Stat label="วันเรียนเดือนนี้" value={planDays.length} />
            <Stat label="วันที่ทำครบ" value={perfect} />
            <Stat label="คำที่จำได้" value={`${knownCount}/${ALL_WORDS.length}`} />
            <Stat label="บทที่เรียนแล้ว" value={`${lessonsDone}/${TOTAL_DAYS}`} />
          </dl>
        </div>
        <Ring {...ring} />
      </div>

      {/* ---- บทเรียนวันนี้ ---- */}
      <div className="dash-card today-card">
        <div className="card-title-row">
          <div>
            <p className="eyebrow">บทเรียนวันนี้ · สัปดาห์ {tw} วันที่ {td} · {WEEKS[tw - 1].level}</p>
            <h2 className="today-title">{todayLesson.light ? (todayLesson.final ? 'สอบพูดครั้งสุดท้าย' : 'วันเบา: ทบทวน + สอบพูด') : todayLesson.theme}</h2>
            {!todayLesson.light && <p className="muted">{todayLesson.en}</p>}
          </div>
          <button className="primary" onClick={() => openLesson(ti)}>เปิดบทเรียน →</button>
        </div>
        {todayLesson.light ? (
          <p className="quote">“{todayLesson.test}” <Say text={todayLesson.test} label="โจทย์สอบพูด" /></p>
        ) : (
          <ul className="chip-row">
            {todayLesson.words.map(([w]) => (
              <li key={w} className="chip">{w}<Say text={w} /></li>
            ))}
          </ul>
        )}
      </div>

      {/* ---- Habit matrix ---- */}
      <div className="dash-card flat">
        <div className="card-title-row">
          <h2>Habit matrix</h2>
          <span className="muted small">แตะช่องเพื่อติ๊ก</span>
        </div>
        {activeHabits.length === 0 ? (
          <p className="empty">เดือนนี้ไม่มีวันเรียนในคอร์ส</p>
        ) : (
          <div className="matrix-scroll" ref={scrollRef}>
            <table className="matrix">
              <thead>
                <tr>
                  <th className="habit-col" scope="col"><span className="eyebrow">สิ่งที่ต้องทำ</span></th>
                  {days.map((d) => (
                    <th key={d.key} scope="col" className={`${d.isToday ? 'is-today' : ''}${d.info?.lesson.light ? ' is-light' : ''}`}>
                      <span className="wd">{d.weekday}</span>
                      <span className="dn">{d.num}</span>
                    </th>
                  ))}
                  <th scope="col" className="rate-col"><span className="eyebrow">%</span></th>
                </tr>
              </thead>
              <tbody>
                {activeHabits.map((h) => {
                  const rate = habitRate(h.id)
                  return (
                    <tr key={h.id}>
                      <th scope="row" className="habit-col">{h.label}</th>
                      {days.map((d) => {
                        const s = status(d, h.id)
                        const clickable = s !== 'none' && s !== 'upcoming'
                        return (
                          <td key={d.key} className={d.isToday ? 'is-today' : ''}>
                            <button
                              className={`cell s-${s}`}
                              disabled={!clickable}
                              aria-pressed={s === 'done'}
                              aria-label={`${h.label} ${d.num} ${MONTH_SHORT[m]}: ${STATUS_LABEL[s]}`}
                              title={`${h.label} · ${d.num} ${MONTH_SHORT[m]} · ${STATUS_LABEL[s]}`}
                              onClick={() => toggle(d.key, h.id)}
                            />
                          </td>
                        )
                      })}
                      <td className="rate-col num">{rate == null ? '–' : rate}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <ul className="legend">
          {['done', 'missed', 'due', 'upcoming', 'none'].map((s) => (
            <li key={s}><span className={`cell s-${s}`} aria-hidden="true" />{STATUS_LABEL[s]}</li>
          ))}
        </ul>
      </div>

      {/* ---- Consistency trend ---- */}
      <div className="dash-card">
        <div className="card-title-row">
          <h2>Consistency trend</h2>
          <span className="muted small">% ที่ทำเสร็จต่อวัน · {MONTH_TH[m]}</span>
        </div>
        <Trend data={trend} daysInMonth={days.length} month={m} />
      </div>

      {/* ---- บทเรียนของเดือน ---- */}
      <div className="dash-card">
        <div className="card-title-row">
          <h2>บทเรียนเดือนนี้</h2>
          <span className="muted small">ติ๊กเมื่อเรียนจบ · แตะชื่อบทเพื่อเปิด</span>
        </div>
        <ol className="lesson-list">
          {days.filter((d) => d.info).map((d) => {
            const { week, day, lesson, index } = d.info
            const key = lessonKey(week, day)
            return (
              <li key={d.key} className={`lesson-row${d.isToday ? ' is-today' : ''}`}>
                <Check checked={!!lessonDone[key]} onChange={(v) => setLessonDone({ ...lessonDone, [key]: v })}>
                  <span className="sr-only">เรียนบทนี้แล้ว</span>
                </Check>
                <span className="lesson-date num">{formatDate(d.date)}</span>
                <button className="lesson-link" onClick={() => openLesson(index)}>
                  <span className="lesson-wd">W{week}·D{day}</span>
                  <span className="lesson-name">{lesson.light ? (lesson.final ? '🏁 สอบพูดครั้งสุดท้าย' : '🌿 วันเบา + สอบพูด') : lesson.theme}</span>
                  {!lesson.light && <span className="muted small lesson-en">{lesson.en}</span>}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function Ring({ label, done, total }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  const r = 42
  const c = 2 * Math.PI * r
  return (
    <div className="ring" role="img" aria-label={`${label}: ทำแล้ว ${done} จาก ${total} (${pct}%)`}>
      <p className="eyebrow">{label}</p>
      <svg viewBox="0 0 100 100" width="120" height="120" aria-hidden="true">
        <circle cx="50" cy="50" r={r} className="ring-track" />
        <circle cx="50" cy="50" r={r} className="ring-fill" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 50 50)" />
        <text x="50" y="50" className="ring-text">{pct}%</text>
      </svg>
      <p className="muted small num">{done} / {total} รายการ</p>
    </div>
  )
}

function Trend({ data, daysInMonth, month }) {
  const [hover, setHover] = useState(null)
  const [W, setW] = useState(640)
  const boxRef = useRef(null)
  const H = 200, L = 40, R = 12, T = 12, B = 28

  // วาดตามความกว้างจริง เพื่อให้ตัวอักษรขนาดคงที่ไม่ยืดตามจอ
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const x = (day) => L + ((day - 1) / Math.max(1, daysInMonth - 1)) * (W - L - R)
  const yPos = (pct) => T + (1 - pct / 100) * (H - T - B)

  if (!data.length) {
    return <p className="empty" ref={boxRef}>ยังไม่มีข้อมูล จะเริ่มแสดงเมื่อถึงวันเรียนวันแรกในเดือนนี้</p>
  }

  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(d.day).toFixed(1)},${yPos(d.pct).toFixed(1)}`).join(' ')
  const ticks = (W < 420 ? [1, 10, 20, 30] : [1, 5, 10, 15, 20, 25, 30]).filter((t) => t <= daysInMonth)
  const pick = (e) => {
    const box = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - box.left) / box.width) * W
    let best = data[0]
    for (const d of data) if (Math.abs(x(d.day) - px) < Math.abs(x(best.day) - px)) best = d
    setHover(best)
  }

  return (
    <div className="trend" ref={boxRef}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="trend-svg" onMouseMove={pick} onMouseLeave={() => setHover(null)} role="img" aria-label="กราฟเปอร์เซ็นต์ที่ทำเสร็จในแต่ละวัน">
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={yPos(v)} y2={yPos(v)} className="grid" />
            <text x={L - 8} y={yPos(v)} className="axis" textAnchor="end" dominantBaseline="middle">{v}%</text>
          </g>
        ))}
        {ticks.map((t) => (
          <text key={t} x={x(t)} y={H - 8} className="axis" textAnchor="middle">{t}</text>
        ))}
        <path d={path} className="trend-line" />
        {data.length === 1 && <circle cx={x(data[0].day)} cy={yPos(data[0].pct)} r="4" className="trend-dot" />}
        {hover && (
          <g>
            <line x1={x(hover.day)} x2={x(hover.day)} y1={T} y2={H - B} className="crosshair" />
            <circle cx={x(hover.day)} cy={yPos(hover.pct)} r="5" className="trend-dot" />
          </g>
        )}
      </svg>
      {hover && (
        <div className="tooltip" style={{ left: `${(x(hover.day) / W) * 100}%` }}>
          <strong>{hover.day} {MONTH_SHORT[month]}</strong>
          <span className="num">{hover.pct}% · {hover.done}/{hover.total}</span>
        </div>
      )}
      <details className="table-view">
        <summary>ดูเป็นตาราง</summary>
        <table className="table">
          <thead><tr><th>วันที่</th><th className="num">ทำแล้ว</th><th className="num">%</th></tr></thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.day}><td>{d.day} {MONTH_SHORT[month]}</td><td className="num">{d.done}/{d.total}</td><td className="num">{d.pct}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  )
}

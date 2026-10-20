import { useMemo, useState } from 'react'
import { ALL_WORDS, WEEKS } from '../data/course.js'
import { useStored } from '../useStored.js'
import { Say } from './ui.jsx'

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Vocab({ known, setKnown }) {
  const [query, setQuery] = useState('')
  const [week, setWeek] = useStored('en-vocab-week', 'all')
  const [status, setStatus] = useStored('en-vocab-status', 'all')
  const [mode, setMode] = useStored('en-vocab-mode', 'list')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALL_WORDS.filter((w) =>
      (week === 'all' || w.week === Number(week)) &&
      (status === 'all' || (status === 'known' ? known[w.key] : !known[w.key])) &&
      (!q || w.word.toLowerCase().includes(q) || w.th.includes(q) || w.ex.toLowerCase().includes(q)),
    )
  }, [query, week, status, known])

  const knownCount = ALL_WORDS.filter((w) => known[w.key]).length
  const pct = Math.round((knownCount / ALL_WORDS.length) * 100)

  return (
    <section className="stack">
      <div className="dash-card vocab-head">
        <div>
          <p className="eyebrow">คลังคำศัพท์ทั้งคอร์ส</p>
          <h2 className="month-title">{knownCount} <span>/ {ALL_WORDS.length} คำที่จำได้</span></h2>
          <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100" aria-label="คำที่จำได้">
            <span style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="seg-control" role="tablist" aria-label="โหมด">
          <button role="tab" aria-selected={mode === 'list'} onClick={() => setMode('list')}>รายการ</button>
          <button role="tab" aria-selected={mode === 'flash'} onClick={() => setMode('flash')}>แฟลชการ์ด</button>
        </div>
      </div>

      <div className="filters">
        <input
          type="search"
          className="search"
          placeholder="ค้นหาคำ ความหมาย หรือประโยค..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="ค้นหาคำศัพท์"
        />
        <select value={week} onChange={(e) => setWeek(e.target.value)} aria-label="กรองตามสัปดาห์">
          <option value="all">ทุกสัปดาห์</option>
          {WEEKS.map((w) => <option key={w.week} value={w.week}>สัปดาห์ {w.week}: {w.title}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="กรองตามสถานะ">
          <option value="all">ทุกคำ</option>
          <option value="unknown">ยังจำไม่ได้</option>
          <option value="known">จำได้แล้ว</option>
        </select>
      </div>

      {mode === 'list' ? (
        <WordTable list={list} known={known} setKnown={setKnown} />
      ) : (
        <Flashcards key={`${week}-${status}-${query}`} list={list} known={known} setKnown={setKnown} />
      )}
    </section>
  )
}

function WordTable({ list, known, setKnown }) {
  if (!list.length) return <p className="empty">ไม่พบคำที่ตรงกับตัวกรอง</p>
  return (
    <div className="dash-card flat">
      <p className="muted small">แสดง {list.length} คำ</p>
      <ul className="word-list">
        {list.map((w) => (
          <li key={w.key} className={`word-item${known[w.key] ? ' is-known' : ''}`}>
            <div className="word-main">
              <Say text={w.word} />
              <span className="word">{w.word}</span>
              <span className="pos">{w.pos}</span>
              <span className="th">{w.th}</span>
              <span className="word-tag">W{w.week} · {w.theme}</span>
            </div>
            <p className="ex"><Say text={w.ex} label="ประโยคตัวอย่าง" /><span>{w.ex}</span></p>
            <button className={`known-btn${known[w.key] ? ' on' : ''}`} aria-pressed={!!known[w.key]} onClick={() => setKnown({ ...known, [w.key]: !known[w.key] })}>
              {known[w.key] ? '✓ จำได้' : 'จำได้แล้ว?'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Flashcards({ list, known, setKnown }) {
  const [deck, setDeck] = useState(() => shuffle(list))
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [score, setScore] = useState({ yes: 0, no: 0 })

  if (!deck.length) return <p className="empty">ไม่มีคำให้ทบทวน ลองเปลี่ยนตัวกรอง</p>

  const finished = i >= deck.length
  const card = deck[Math.min(i, deck.length - 1)]
  const next = (gotIt) => {
    if (gotIt) setKnown({ ...known, [card.key]: true })
    setScore((s) => ({ yes: s.yes + (gotIt ? 1 : 0), no: s.no + (gotIt ? 0 : 1) }))
    setFlipped(false)
    setI(i + 1)
  }
  const restart = () => { setDeck(shuffle(list)); setI(0); setFlipped(false); setScore({ yes: 0, no: 0 }) }

  if (finished) {
    return (
      <div className="dash-card flash-done">
        <h2>ทบทวนครบ {deck.length} ใบแล้ว</h2>
        <p className="num">จำได้ {score.yes} · ยังไม่ได้ {score.no}</p>
        <button className="primary" onClick={restart}>สับไพ่แล้วเริ่มใหม่</button>
      </div>
    )
  }

  return (
    <div className="flash-wrap">
      <p className="muted small num">ใบที่ {i + 1}/{deck.length} · จำได้ {score.yes} · ยังไม่ได้ {score.no}</p>
      <button className={`flash${flipped ? ' is-flipped' : ''}`} onClick={() => setFlipped(!flipped)} aria-label={flipped ? 'ซ่อนคำตอบ' : 'ดูคำตอบ'}>
        <span className="flash-word">{card.word}</span>
        <span className="pos">{card.pos}</span>
        {flipped ? (
          <>
            <span className="flash-th">{card.th}</span>
            <span className="flash-ex">{card.ex}</span>
          </>
        ) : (
          <span className="muted small">พูดความหมายและแต่งประโยค 1 ประโยคก่อน แล้วแตะเพื่อดูคำตอบ</span>
        )}
      </button>
      <div className="flash-actions">
        <Say text={card.word} />
        <Say text={card.ex} label="ประโยคตัวอย่าง" slow />
        <button className="ghost" onClick={() => next(false)}>ยังจำไม่ได้</button>
        <button className="primary" onClick={() => next(true)}>จำได้แล้ว ✓</button>
      </div>
    </div>
  )
}

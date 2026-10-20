import { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import Overview from './components/Overview.jsx'
import Lesson from './components/Lesson.jsx'
import Vocab from './components/Vocab.jsx'
import Speaking from './components/Speaking.jsx'
import Tracker from './components/Tracker.jsx'
import Methods from './components/Methods.jsx'
import { TOTAL_DAYS, WEEKS } from './data/course.js'
import { todayLessonIndex } from './data/schedule.js'
import { useStored } from './useStored.js'

const TABS = [
  { id: 'dashboard', label: 'แดชบอร์ด' },
  { id: 'lesson', label: 'บทเรียน' },
  { id: 'vocab', label: 'คลังคำศัพท์' },
  { id: 'speaking', label: 'ฝึกพูด' },
  { id: 'overview', label: 'ภาพรวมคอร์ส' },
  { id: 'tracker', label: 'ติดตามผล' },
  { id: 'methods', label: 'วิธีเรียน' },
]

const tabFromHash = () => {
  const id = window.location.hash.slice(1)
  return TABS.some((t) => t.id === id) ? id : 'dashboard'
}

export default function App() {
  const [tab, setTab] = useState(tabFromHash)
  const [theme, setTheme] = useStored('pl-theme', 'dark')
  const [lessonIndex, setLessonIndex] = useStored('en-lesson-index', todayLessonIndex())
  const [lessonDone, setLessonDone] = useStored('en-lesson-done', {})
  const [known, setKnown] = useStored('en-known', {})

  useEffect(() => {
    const onHash = () => setTab(tabFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark')
  }, [theme])

  const openLesson = (i) => {
    setLessonIndex(i)
    window.location.hash = 'lesson'
    window.scrollTo(0, 0)
  }
  const changeLesson = (i) => {
    setLessonIndex(i)
    window.scrollTo(0, 0)
  }

  const done = Object.values(lessonDone).filter(Boolean).length
  const pct = Math.round((done / TOTAL_DAYS) * 100)
  const ti = todayLessonIndex()
  const week = WEEKS[Math.floor(ti / 7)]
  const isLight = theme === 'light'

  return (
    <>
      <header className="site-head">
        <div className="wrap head-inner">
          <div>
            <h1>Path Life <span className="brand-tag">English</span></h1>
            <p className="muted">คอร์สภาษาอังกฤษเพื่อการพูด 2 เดือน · คำศัพท์ชีวิตประจำวันและการทำงาน</p>
          </div>
          <button className="ghost" onClick={() => setTheme(isLight ? 'dark' : 'light')} aria-label="สลับธีม">{isLight ? '☾ โหมดมืด' : '☀ โหมดสว่าง'}</button>
        </div>
        <div className="wrap progress-row">
          <span className="small">วันที่ {ti + 1}/{TOTAL_DAYS} · สัปดาห์ {week.week} {week.title} · {week.level}</span>
          <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100" aria-label="บทเรียนที่เรียนแล้ว">
            <span style={{ width: `${pct}%` }} />
          </div>
          <span className="small num">{done}/{TOTAL_DAYS}</span>
        </div>
        <nav className="wrap tabs" aria-label="หมวด">
          {TABS.map((t) => (
            <a key={t.id} href={`#${t.id}`} aria-current={tab === t.id ? 'page' : undefined}>{t.label}</a>
          ))}
        </nav>
      </header>

      <main className="wrap">
        {tab === 'dashboard' && <Dashboard lessonDone={lessonDone} setLessonDone={setLessonDone} known={known} openLesson={openLesson} />}
        {tab === 'lesson' && (
          <Lesson index={lessonIndex} setIndex={changeLesson} lessonDone={lessonDone} setLessonDone={setLessonDone} known={known} setKnown={setKnown} />
        )}
        {tab === 'vocab' && <Vocab known={known} setKnown={setKnown} />}
        {tab === 'speaking' && <Speaking />}
        {tab === 'overview' && <Overview openLesson={openLesson} />}
        {tab === 'tracker' && <Tracker />}
        {tab === 'methods' && <Methods />}
      </main>

      <footer className="wrap muted small foot">
        เคล็ดลับ: กดปุ่มลำโพงเพื่อฟังเสียงอ่านทุกคำและทุกประโยค แล้วพูดตามออกเสียงทุกครั้ง
      </footer>
    </>
  )
}

// ผูกคอร์ส 8 สัปดาห์เข้ากับวันที่จริงในปฏิทิน
import { TOTAL_DAYS, WEEKS } from './course.js'

export const PLAN_START = new Date(2026, 9, 20) // 20 ต.ค. 2026 = วันที่ 1 ของคอร์ส

// สิ่งที่ต้องทำในแต่ละวัน (แถวใน Habit matrix)
export const HABITS = [
  { id: 'anki', label: 'ทบทวน Anki', every: true },
  { id: 'vocab', label: 'คำศัพท์ใหม่ 12 คำ', study: true },
  { id: 'sentence', label: 'แต่งประโยค 10 ประโยค', study: true },
  { id: 'shadow', label: 'Shadowing', study: true },
  { id: 'speak', label: 'ภารกิจพูด + อัดเสียง', study: true },
  { id: 'selftalk', label: 'Self-talk 10 นาที', every: true },
  { id: 'test', label: 'สอบพูดประจำสัปดาห์', light: true },
  { id: 'fun', label: 'กิจกรรมสนุก', light: true },
]

export const MONTH_TH = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
export const MONTH_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
export const WEEKDAY_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

const DAY_MS = 86400000
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export const dayKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const dateOfIndex = (i) => new Date(PLAN_START.getFullYear(), PLAN_START.getMonth(), PLAN_START.getDate() + i)

// ลำดับวันในคอร์ส (0-based) หรือ null ถ้าอยู่นอกคอร์ส
export function planDayIndex(date) {
  const i = Math.round((startOfDay(date) - PLAN_START) / DAY_MS)
  return i >= 0 && i < TOTAL_DAYS ? i : null
}

// { week, day, lesson } ของวันที่นั้น — day 1–7, วันที่ 7 ของทุกสัปดาห์คือวันเบา
export function lessonOfDate(date) {
  const i = planDayIndex(date)
  if (i == null) return null
  const week = Math.floor(i / 7) + 1
  const day = (i % 7) + 1
  return { index: i, week, day, lesson: WEEKS[week - 1].days[day - 1] }
}

export function scheduledHabits(date) {
  const info = lessonOfDate(date)
  if (!info) return []
  const isLight = !!info.lesson.light
  return HABITS.filter((h) => h.every || (isLight ? h.light : h.study)).map((h) => h.id)
}

export function todayLessonIndex() {
  const i = planDayIndex(new Date())
  if (i != null) return i
  return new Date() < PLAN_START ? 0 : TOTAL_DAYS - 1
}

// เดือนในปฏิทินทั้งหมดที่คอร์สครอบคลุม
export const PLAN_MONTHS = (() => {
  const end = dateOfIndex(TOTAL_DAYS - 1)
  const list = []
  for (let y = PLAN_START.getFullYear(), m = PLAN_START.getMonth(); y < end.getFullYear() || (y === end.getFullYear() && m <= end.getMonth()); ) {
    list.push({ y, m })
    if (++m > 11) { m = 0; y++ }
  }
  return list
})()

export const formatDate = (d) => `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`

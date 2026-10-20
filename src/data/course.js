// ข้อมูลหลักของคอร์สภาษาอังกฤษ 2 เดือน — เนื้อหารายวันอยู่ใน ./lessons/w1–w8.js
import w1 from './lessons/w1.js'
import w2 from './lessons/w2.js'
import w3 from './lessons/w3.js'
import w4 from './lessons/w4.js'
import w5 from './lessons/w5.js'
import w6 from './lessons/w6.js'
import w7 from './lessons/w7.js'
import w8 from './lessons/w8.js'

export const WEEKS = [w1, w2, w3, w4, w5, w6, w7, w8]
export const TOTAL_DAYS = WEEKS.length * 7

export const lessonKey = (week, day) => `w${week}d${day}`

// รวมคำศัพท์ทั้งหมดไว้ใช้ในคลังคำศัพท์
export const ALL_WORDS = WEEKS.flatMap((w) =>
  w.days.flatMap((d, i) =>
    (d.words || []).map(([word, pos, th, ex]) => ({
      key: `${w.week}-${i + 1}-${word}`,
      word, pos, th, ex,
      week: w.week, day: i + 1, theme: d.theme, level: w.level,
    })),
  ),
)
export const ALL_PHRASES = WEEKS.flatMap((w) => w.days.flatMap((d) => d.phrases || []))
export const ALL_PATTERNS = WEEKS.flatMap((w) => w.days.flatMap((d) => d.patterns || []))

export const STAGES = [
  {
    id: 1, weeks: [1, 2], level: 'A1 → A2', title: 'รากฐานการพูด',
    goal: 'พูดเรื่องตัวเองและชีวิตประจำวันได้โดยไม่ต้องแปลในหัว',
    can: ['แนะนำตัว 1 นาทีได้ลื่น', 'สั่งอาหาร ถามทาง ซื้อของได้', 'เล่าเรื่องในอดีตง่าย ๆ ได้', 'โทรนัดและเลื่อนนัดได้'],
  },
  {
    id: 2, weeks: [3, 4], level: 'A2 → B1', title: 'ภาษาอังกฤษในที่ทำงาน',
    goal: 'สื่อสารในออฟฟิศและใช้คำศัพท์ตามอาชีพได้',
    can: ['เข้าประชุมและเสนอความเห็นได้', 'ขอร้องและปฏิเสธอย่างสุภาพได้', 'ดูแลลูกค้าได้ตั้งแต่สอบถามจนถึงร้องเรียน', 'ใช้ศัพท์ 6 สายอาชีพ: IT, โรงแรม, ขาย, การเงิน, การแพทย์, ช่าง'],
  },
  {
    id: 3, weeks: [5, 6], level: 'B1', title: 'สัมภาษณ์และงานจริง',
    goal: 'ผ่านการสัมภาษณ์งานและทำงานร่วมกับคนต่างชาติได้',
    can: ['ตอบคำถามสัมภาษณ์งานได้ 10 ข้อ', 'เล่าเรื่องแบบ STAR ได้', 'คุยงานกับลูกค้าฟรีแลนซ์ได้', 'อธิบายงานเทคและงาน 3D ได้'],
  },
  {
    id: 4, weeks: [7, 8], level: 'B1 → B2', title: 'พูดลื่นแบบมืออาชีพ',
    goal: 'แสดงความเห็น เล่าเรื่อง นำเสนอ และต่อรองได้อย่างเป็นธรรมชาติ',
    can: ['โต้แย้งโดยให้เหตุผลได้', 'ใช้ phrasal verbs และ idioms ได้แบบเป็นธรรมชาติ', 'นำเสนองาน 3–5 นาทีได้', 'ต่อรองและรับมือความขัดแย้งได้'],
  },
]

export const DAY_BLOCKS = [
  { time: '0:00–0:15', label: 'ทบทวน', desc: 'Anki: ทบทวนการ์ดของวันก่อน ๆ (spaced repetition)', active: false },
  { time: '0:15–0:35', label: 'คำศัพท์ใหม่', desc: 'กด 🔊 ฟังทีละคำ พูดตาม 3 รอบ แล้วทำการ์ด Anki', active: false },
  { time: '0:35–0:55', label: 'แต่งประโยค', desc: 'ใช้รูปประโยคและวลีแต่งประโยคเกี่ยวกับชีวิตตัวเอง 10 ประโยค แล้วพูดออกเสียง', active: true },
  { time: '0:55–1:20', label: 'ฟัง + Shadowing', desc: 'ฟังคลิปที่กำหนด แล้วพูดตามแบบซ้อนเสียงทีละประโยค', active: true },
  { time: '1:20–1:50', label: 'พูด', desc: 'ตอบคำถาม 3 ข้อ + ทำภารกิจพูด แล้วอัดเสียง', active: true },
  { time: '1:50–2:00', label: 'ฟังตัวเอง', desc: 'ฟังเสียงที่อัด จด 2 จุดที่ต้องแก้ แล้วพูดประโยคนั้นใหม่', active: true },
]

export const LIGHT_BLOCKS = [
  { time: '0:00–0:30', label: 'ทบทวนทั้งสัปดาห์', desc: 'Anki + โหมดแฟลชการ์ดในคลังคำศัพท์ (ติ๊กคำที่จำได้แล้ว)', active: false },
  { time: '0:30–1:00', label: 'สอบพูด', desc: 'อัดเสียงตอบโจทย์สอบประจำสัปดาห์ แล้วให้คะแนนตัวเองในแท็บ "ติดตามผล"', active: true },
  { time: '1:00–2:00', label: 'กิจกรรมสนุก', desc: 'ภาษาอังกฤษแบบสบาย ๆ เพื่อไม่ให้หมดไฟ', active: true },
]

// แหล่งเรียนฟรี — youglish จะสร้างลิงก์ค้นหาจากวลีของแต่ละวัน
export const RESOURCES = {
  youglish: { name: 'YouGlish', url: (q) => `https://youglish.com/pronounce/${encodeURIComponent(q)}/english`, how: (q) => `ฟังวลี "${q}" จากคลิปจริง 5 คลิป แล้ว shadowing ตามทีละคลิป` },
  bbc6: { name: 'BBC Learning English — 6 Minute English', url: () => 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english' },
  bbcWork: { name: 'BBC Learning English — English at Work', url: () => 'https://www.bbc.co.uk/learningenglish/english/features/english-at-work' },
  ted: { name: 'TED Talks', url: () => 'https://www.ted.com/talks' },
}

export const TOOLS = [
  ['Anki (ฟรีบนคอม/Android)', 'https://apps.ankiweb.net/', 'ทำการ์ดคำศัพท์ทบทวนตามรอบ'],
  ['Cambridge Dictionary', 'https://dictionary.cambridge.org/', 'ความหมาย + เสียงอ่าน UK/US'],
  ['YouGlish', 'https://youglish.com/', 'ฟังคำจากคลิปจริงหลายพันคลิป'],
  ['BBC Learning English', 'https://www.bbc.co.uk/learningenglish/', 'คลิปฟังฟรีพร้อม transcript'],
  ['VOA Learning English', 'https://learningenglish.voanews.com/', 'ข่าวพูดช้า เหมาะฝึก shadowing'],
  ['Rachel\'s English (YouTube)', 'https://www.youtube.com/@rachelsenglish', 'ฝึกออกเสียงแบบอเมริกัน'],
]

// ---------- ระบบฝึกพูด ----------
export const SPEAKING_LOOP = [
  { step: 'ฟังก่อนพูด', desc: 'กด 🔊 ฟังคำและประโยคตัวอย่างทุกคำ ห้ามเดาเสียงเองจากตัวสะกด' },
  { step: 'จำเป็นก้อน (chunk)', desc: 'จำทั้งวลี เช่น "I\'m working on..." แทนคำเดี่ยว จะได้พูดออกมาเป็นประโยคทันที' },
  { step: 'แต่งประโยคของตัวเอง', desc: 'ใช้รูปประโยคพูดเรื่องจริงของตัวเอง สมองจะจำได้ดีกว่าประโยคในหนังสือหลายเท่า' },
  { step: 'Shadowing', desc: 'พูดตามเสียงต้นฉบับแทบจะพร้อมกัน เลียนแบบจังหวะ การเน้นเสียง และอารมณ์' },
  { step: 'พูดอิสระ + อัดเสียง', desc: 'ทำภารกิจพูดโดยไม่ดูโน้ต ผิดได้ ขอแค่พูดต่อไปเรื่อย ๆ' },
  { step: 'ฟังตัวเองแล้วแก้', desc: 'จดแค่ 2 จุดที่ต้องแก้ แล้วพูดประโยคนั้นใหม่ 3 รอบ ไม่ต้องแก้ทุกอย่างในครั้งเดียว' },
]

export const PRONUNCIATION = [
  { issue: 'เสียงท้ายคำหาย (-s, -t, -d, -k)', tip: 'คนไทยมักไม่ออกเสียงท้ายคำ ทำให้ฟังเป็นอีกคำ ให้ออกเสียงท้ายเบา ๆ แต่ต้องได้ยิน', pairs: [['like', 'likes'], ['work', 'worked'], ['bay', 'bake'], ['row', 'road']] },
  { issue: 'th (θ / ð)', tip: 'วางปลายลิ้นแตะฟันบนแล้วเป่าลม ไม่ใช่เสียง ซ หรือ ด', pairs: [['sink', 'think'], ['tree', 'three'], ['dis', 'this'], ['day', 'they']] },
  { issue: 'v กับ w', tip: 'v ฟันบนแตะริมฝีปากล่างแล้วมีเสียงสั่น ส่วน w ห่อปากกลม ไม่ให้ฟันแตะปาก', pairs: [['west', 'vest'], ['wine', 'vine'], ['wet', 'vet'], ['worse', 'verse']] },
  { issue: 'r กับ l', tip: 'r ลิ้นไม่แตะเพดาน ม้วนลิ้นไปด้านหลังเล็กน้อย ส่วน l ปลายลิ้นแตะหลังฟันบน', pairs: [['light', 'right'], ['lice', 'rice'], ['collect', 'correct'], ['play', 'pray']] },
  { issue: 'sh กับ ch', tip: 'sh เป็นเสียงลมยาวต่อเนื่อง (ชู่ว) ส่วน ch หยุดลมก่อนแล้วค่อยปล่อย (ช แบบหนัก)', pairs: [['ship', 'chip'], ['share', 'chair'], ['wash', 'watch'], ['shoes', 'choose']] },
  { issue: 'สระสั้นกับสระยาว', tip: 'สระสั้นห้ามลากยาว เพราะความหมายจะเปลี่ยน', pairs: [['ship', 'sheep'], ['full', 'fool'], ['live', 'leave'], ['sit', 'seat']] },
  { issue: 'ลงเสียงหนักผิดพยางค์ (word stress)', tip: 'ภาษาอังกฤษเน้นพยางค์เดียวให้ดังและยาวกว่าพยางค์อื่น ถ้าเน้นผิดคนฟังจะไม่เข้าใจ', pairs: [['thirTEEN', 'THIRty'], ['PREsent (n.)', 'preSENT (v.)'], ['PHOtograph', 'phoTOgrapher'], ['DEsert (ทะเลทราย)', 'desSERT (ของหวาน)']] },
  { issue: '-ed มี 3 เสียง', tip: 'ออกเสียง /t/ หลังเสียงไม่ก้อง, /d/ หลังเสียงก้อง และ /ɪd/ เมื่อคำลงท้ายด้วย t หรือ d', pairs: [['worked /t/', 'played /d/'], ['wanted /ɪd/', 'needed /ɪd/'], ['watched /t/', 'cleaned /d/']] },
  { issue: 'การเชื่อมเสียง (linking)', tip: 'ถ้าคำหน้าลงท้ายด้วยพยัญชนะและคำหลังขึ้นต้นด้วยสระ ให้อ่านต่อกันเป็นเสียงเดียว', pairs: [['pick it up', 'pi-ki-tup'], ['an apple', 'a-napple'], ['turn it off', 'tur-ni-toff']] },
]

export const RESCUE_PHRASES = [
  ["How do you say ... in English?", "... ภาษาอังกฤษพูดว่าอะไร"],
  ["Sorry, could you repeat that?", "ขอโทษ ช่วยพูดอีกรอบได้ไหม"],
  ["Could you speak a little more slowly?", "ช่วยพูดช้าลงหน่อยได้ไหม"],
  ["What do you mean by ...?", "... หมายความว่าอะไร"],
  ["Just to check, you mean ...?", "ขอเช็คหน่อย หมายถึง... ใช่ไหม"],
  ["Let me put it another way.", "ขอพูดอีกแบบนะ"],
  ["Give me a second to think.", "ขอเวลาคิดแป๊บนึง"],
  ["I'm not sure how to say this, but ...", "ไม่แน่ใจว่าจะพูดยังไง แต่..."],
  ["It's like a ... but ...", "มันคล้าย ๆ ... แต่ว่า... (ใช้ตอนนึกคำไม่ออก)"],
  ["Sorry, I lost my train of thought.", "ขอโทษ ลืมว่ากำลังพูดอะไรอยู่"],
]

export const PARTNERS = [
  { name: 'Self-talk (คุยกับตัวเอง)', desc: 'บรรยายสิ่งที่ทำอยู่เป็นภาษาอังกฤษ เช่น ตอนอาบน้ำหรือเดินทาง ฟรีและทำได้ทุกที่ วันละ 10 นาที' },
  { name: 'AI voice chat', desc: 'ใช้โหมดคุยด้วยเสียงของ AI เป็นคู่ซ้อม โดยใช้ prompt ด้านล่าง แล้วให้ AI แก้ประโยคให้ทีละน้อย' },
  { name: 'Language exchange', desc: 'แอปอย่าง HelloTalk หรือ Tandem: สอนภาษาไทยแลกกับฝึกภาษาอังกฤษกับเจ้าของภาษา' },
  { name: 'อัดเสียงทุกวัน', desc: 'เก็บไฟล์ไว้เป็นโฟลเดอร์รายสัปดาห์ แล้วฟังย้อนเทียบทุกวันเบาเพื่อดูพัฒนาการ' },
]

export const AI_PROMPT = `You are my English speaking partner. My level is {LEVEL}.
Today's topic: {TOPIC}.
Rules:
1. Ask me one question at a time and wait for my answer.
2. After each answer, correct at most 2 mistakes and show a more natural version.
3. Use the words I'm learning today: {WORDS}.
4. Keep your replies short (2–3 sentences) so I speak more than you.`

export const RUBRIC = [
  { id: 'fluency', name: 'ความลื่นไหล (Fluency)', d1: 'หยุดบ่อย พูดเป็นคำ ๆ', d3: 'พูดได้ต่อเนื่อง มีหยุดคิดบ้าง', d5: 'พูดลื่น ใช้ filler แทนการเงียบ' },
  { id: 'vocab', name: 'คำศัพท์ (Vocabulary)', d1: 'ใช้แต่คำพื้นฐานซ้ำ ๆ', d3: 'ใช้คำของสัปดาห์ได้บางส่วน', d5: 'ใช้คำ วลี และ collocation ได้หลากหลายและถูกบริบท' },
  { id: 'pron', name: 'การออกเสียง (Pronunciation)', d1: 'ฟังยาก เสียงท้ายหาย', d3: 'ฟังเข้าใจ มีบางคำผิด', d5: 'ชัดเจน เน้นเสียงถูก มีการเชื่อมเสียง' },
  { id: 'grammar', name: 'ไวยากรณ์ (Grammar)', d1: 'ผิดบ่อยจนเข้าใจยาก', d3: 'ผิดบ้างแต่สื่อสารได้', d5: 'ใช้รูปประโยคได้หลากหลาย ผิดน้อย' },
  { id: 'confidence', name: 'ความมั่นใจ (Confidence)', d1: 'กลัว ไม่อยากพูด', d3: 'พูดได้แต่ยังเกร็ง', d5: 'สบาย ๆ กล้าพูดผิดแล้วแก้เอง' },
]

export const WEEKLY_CHECKS = [
  'เรียนครบ 6 วัน + วันเบา 1 วัน',
  'ทบทวน Anki ทุกวัน (ไม่มีการ์ดค้าง)',
  'ทำการ์ดคำศัพท์ใหม่ครบ 72 คำ',
  'Shadowing ครบทุกวัน',
  'อัดเสียงภารกิจพูดครบทุกวัน',
  'ตอบคำถามพูดครบ 18 ข้อ',
  'สอบพูดประจำสัปดาห์ + ให้คะแนนตัวเองแล้ว',
  'Self-talk อย่างน้อย 3 วัน',
]

export const METHODS = [
  { name: 'Active Recall', what: 'ดึงความรู้ออกจากหัวเองก่อนดูเฉลย', example: 'ในโหมดแฟลชการ์ด ให้ดูคำภาษาอังกฤษแล้วพูดความหมายและแต่งประโยคออกมาก่อน ค่อยกดดูคำตอบ' },
  { name: 'Spaced Repetition (Anki)', what: 'ทบทวนตามรอบที่ห่างขึ้นเรื่อย ๆ ก่อนที่จะลืม', example: 'ด้านหน้าการ์ดใส่ประโยคตัวอย่างและเว้นช่องคำศัพท์ไว้ เช่น "I ___ to college by bus." ด้านหลังใส่ commute + ความหมาย ทำวันละ 12 ใบ และห้ามข้ามวันทบทวน' },
  { name: 'Shadowing', what: 'พูดตามเสียงต้นฉบับแทบจะพร้อมกัน', example: '(1) ฟังรอบแรกให้เข้าใจ (2) อ่าน transcript พร้อมฟัง (3) พูดตามทีละประโยค (4) พูดซ้อนพร้อมเสียงโดยไม่ดูบท (5) อัดเสียงแล้วเทียบกับต้นฉบับ' },
  { name: 'Chunking', what: 'จำเป็นวลีหรือก้อนประโยค ไม่จำคำเดี่ยว', example: 'จำ "I\'m afraid I can\'t make it." ทั้งประโยค แทนการท่อง afraid = กลัว ซึ่งในประโยคนี้ไม่ได้แปลว่ากลัว' },
  { name: 'Output ก่อนสมบูรณ์', what: 'พูดตั้งแต่วันแรก แม้จะผิด', example: 'ภารกิจพูดทุกวันไม่ได้วัดว่าถูกหรือผิด แต่วัดว่าพูดได้นานแค่ไหนโดยไม่หยุด' },
  { name: 'Feynman Technique', what: 'อธิบายเรื่องที่เรียนด้วยภาษาง่าย ๆ', example: 'อธิบายคำว่า "bottleneck" เป็นภาษาอังกฤษง่าย ๆ ให้เด็ก 10 ขวบเข้าใจ ถ้าทำได้แปลว่าเข้าใจคำนั้นจริง' },
  { name: 'เรียนจากเรื่องของตัวเอง', what: 'ทุกประโยคที่ฝึกให้เป็นเรื่องจริงของเรา', example: 'แทนที่จะพูด "John works in a bank" ให้พูดเรื่องตัวเองแทน เช่น "I\'m learning Blender to sell 3D models." จะจำได้นานกว่าและได้ใช้จริง' },
  { name: 'ใช้ AI แบบไม่พึ่งจนไม่ได้อะไร', what: 'ให้ AI เป็นคู่ซ้อมและคนช่วยแก้ ไม่ใช่คนพูดแทน', example: 'พูดหรือเขียนเองก่อนเสมอ แล้วค่อยให้ AI แก้ทีละ 2 จุด ห้ามให้ AI เขียนบทพูดทั้งหมดให้แล้วเอาไปอ่าน' },
]

export const PROBLEMS = [
  ['แปลไทยในหัวก่อนพูดทุกครั้ง', 'ฝึกพูดเป็นก้อนวลีและรูปประโยค ใช้ self-talk บรรยายสิ่งรอบตัวทันทีโดยไม่ต้องแปล'],
  ['กลัวพูดผิด เลยไม่พูด', 'คนฟังสนใจเนื้อหามากกว่าไวยากรณ์ ตั้งเป้าว่าวันนี้ต้องพูดผิดให้ได้ 10 ครั้ง ผิดคือการได้ฝึก'],
  ['จำศัพท์ได้แต่ใช้ไม่เป็น', 'ทุกคำต้องแต่งประโยคของตัวเองอย่างน้อย 1 ประโยคและพูดออกเสียง ไม่ใช่แค่อ่านผ่าน'],
  ['ฟังเจ้าของภาษาไม่ทัน', 'เริ่มจาก VOA หรือ BBC ที่พูดช้า ใช้ shadowing และเรียนเรื่อง linking เพราะเจ้าของภาษาพูดคำติดกัน'],
  ['นึกคำไม่ออกกลางประโยค', 'ใช้ rescue phrases และอธิบายอ้อม ๆ เช่น "It\'s like a..." แทนการหยุดเงียบ'],
  ['ไม่มีคนคุยด้วย', 'ใช้ self-talk, AI voice chat และ language exchange อัดเสียงตัวเองก็นับเป็นการฝึกพูด'],
  ['เบื่อ หมดไฟกลางทาง', 'วันเบามีไว้ทำกิจกรรมสนุก ถ้าเหนื่อยมากให้ทำขั้นต่ำ 20 นาที (Anki + พูด 2 นาที) เพื่อไม่ให้ streak ขาด'],
  ['Anki การ์ดค้างเยอะ', 'ทบทวนการ์ดเก่าก่อนเพิ่มการ์ดใหม่เสมอ ถ้าค้างเกิน 100 ใบให้หยุดเพิ่มการ์ดใหม่ 1 วัน'],
]

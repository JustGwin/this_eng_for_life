import { useEffect, useState } from 'react'

// state ที่จำไว้ใน localStorage (ถ้า storage ใช้ไม่ได้ก็ยังทำงานปกติ แค่ไม่จำ)
export function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved == null ? initial : JSON.parse(saved)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore
    }
  }, [key, value])

  return [value, setValue]
}

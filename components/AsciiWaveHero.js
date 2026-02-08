import { useRef, useState, useEffect, useCallback } from 'react'

const CHARS = ' ·∙:+=○●◆'
const CHAR_W = 8
const CHAR_H = 14

export default function AsciiWaveHero({ children }) {
  const preRef = useRef(null)
  const containerRef = useRef(null)
  const rafRef = useRef(null)
  const [dims, setDims] = useState({ cols: 80, rows: 12 })

  const measure = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const w = el.clientWidth
    const h = el.clientHeight
    setDims({
      cols: Math.max(1, Math.floor(w / CHAR_W)),
      rows: Math.max(1, Math.ceil(h / CHAR_H)) + 1,
    })
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    measure()

    const ro = new ResizeObserver(() => measure())
    ro.observe(el)

    return () => ro.disconnect()
  }, [measure])

  useEffect(() => {
    const pre = preRef.current
    if (!pre) return

    const { cols, rows } = dims
    let t = 0

    const draw = () => {
      t += 0.015
      let out = ''
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v =
            Math.sin(x * 0.03 + t) +
            Math.cos(y * 0.1 + t * 0.6) +
            Math.sin((x + y) * 0.025 + t * 0.4) +
            Math.cos(x * 0.07 - t * 0.3)
          const norm = (v + 4) / 8
          const idx = Math.floor(norm * (CHARS.length - 1))
          out += CHARS[idx]
        }
        if (y < rows - 1) out += '\n'
      }
      pre.textContent = out
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [dims])

  return (
    <div ref={containerRef} className="ascii-wave-hero">
      <pre ref={preRef} className="ascii-wave-pre" />
      <div className="ascii-wave-content">
        {children}
      </div>
    </div>
  )
}

import { useRef, useEffect } from 'react'

// "Drift" — refined liquid contour flow field.
// Domain-warped noise rendered as slowly marbling topographic ridges.
// Monochrome: color + light/dark come entirely from your existing
// .ascii-wave-pre rules in styles/main.css. No CSS changes needed.
const CHARS = ' ·-:=+*≡▒▓█'
const CHAR_W = 8
const CHAR_H = 14

function fract(n) {
  return n - Math.floor(n)
}

export default function AsciiWaveHero({ children }) {
  const preRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const pre = preRef.current
    const el = containerRef.current
    if (!pre || !el) return

    let raf = 0
    let cols = 80
    let rows = 16
    let t = 0
    const len = CHARS.length

    const measure = () => {
      cols = Math.max(1, Math.floor(el.clientWidth / CHAR_W))
      rows = Math.max(1, Math.ceil(el.clientHeight / CHAR_H)) + 1
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)

    const draw = () => {
      t += 0.011
      let out = ''
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // domain warp -> liquid marbling
          const wx = x + 7 * Math.sin(y * 0.06 + t * 0.5)
          const wy = y + 5 * Math.cos(x * 0.05 - t * 0.4)
          const v =
            Math.sin(wx * 0.05 + t) +
            Math.sin(wy * 0.11 - t * 0.6) +
            Math.sin((wx + wy) * 0.03 + t * 0.3)
          // crisp contour ridges where the field crosses a band
          const ridge = Math.pow(1 - Math.abs(fract(v * 1.4) - 0.5) * 2, 1.7)
          const norm = Math.min(1, Math.max(0, ridge * 0.96))
          out += CHARS[Math.floor(norm * (len - 1))]
        }
        if (y < rows - 1) out += '\n'
      }
      pre.textContent = out
      raf = requestAnimationFrame(draw)
    }

    // paint a first frame synchronously so there is never a blank flash
    draw()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className="ascii-wave-hero">
      <pre ref={preRef} className="ascii-wave-pre" />
      <div className="ascii-wave-content">{children}</div>
    </div>
  )
}

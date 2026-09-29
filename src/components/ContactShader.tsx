import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import { useLowPower } from '@/lib/perf-mode'

/** Reads a theme token (hex or rgb()) into 0–1 RGB for the shader. */
function tokenRgb(name: string): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const hex = raw.match(/^#([0-9a-f]{6})$/i)
  if (hex) {
    const n = parseInt(hex[1], 16)
    return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
  }
  const rgb = raw.match(/\d+(\.\d+)?/g)
  if (rgb && rgb.length >= 3) return [+rgb[0] / 255, +rgb[1] / 255, +rgb[2] / 255]
  return [0.95, 0.93, 0.91]
}

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec3 uBase;
  uniform vec3 uAccent;
  varying vec2 vUv;

  // Hash + value noise + fbm: cheap, organic movement
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv * vec2(uRes.x / uRes.y, 1.0) * 1.6;
    float t = uTime * 0.04;
    // Domain warping gives the slow, liquid drift
    vec2 q = vec2(fbm(uv + t), fbm(uv + vec2(5.2, 1.3) - t));
    float n = fbm(uv + 2.4 * q + vec2(t * 0.6, -t * 0.4));
    float glow = smoothstep(0.45, 0.85, n) * (0.35 + 0.65 * vUv.y);
    vec3 col = mix(uBase, uAccent, glow * 0.28);
    // Faint film grain so the gradient never bands
    col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.02;
    gl_FragColor = vec4(col, 1.0);
  }
`

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`

/**
 * Slow, liquid gold gradient behind the contact section (OGL, one full-screen
 * triangle). Half resolution, ~30fps (~15 on low-power devices), paused
 * off-screen; not mounted for reduced motion, where the CSS gradient remains.
 */
export function ContactShader() {
  const host = useRef<HTMLDivElement>(null)
  const low = useLowPower()
  const lowRef = useRef(low)
  lowRef.current = low
  const reduce = useReducedMotion()
  const enabled = !reduce

  useEffect(() => {
    const el = host.current
    if (!el || !enabled) return

    let renderer: Renderer
    try {
      renderer = new Renderer({ dpr: 0.5, alpha: false, antialias: false })
    } catch {
      return // WebGL unavailable: the CSS background stays
    }
    const gl = renderer.gl
    gl.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'
    el.appendChild(gl.canvas)

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: [1, 1] },
        uBase: { value: tokenRgb('--color-surface') },
        uAccent: { value: tokenRgb('--accent-bright') },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    const resize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight)
      program.uniforms.uRes.value = [el.clientWidth, el.clientHeight]
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    // Re-read colors if the palette changes
    const mo = new MutationObserver(() => {
      program.uniforms.uBase.value = tokenRgb('--color-surface')
      program.uniforms.uAccent.value = tokenRgb('--accent-bright')
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-palette'] })

    let raf = 0
    let last = 0
    let visible = false
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      // ~30fps is plenty for a slow drift; ~15fps on low-power devices
      if (now - last < (lowRef.current ? 66 : 33)) return
      last = now
      program.uniforms.uTime.value = now / 1000
      renderer.render({ scene: mesh })
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(loop)
    })
    io.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      gl.canvas.remove()
    }
  }, [enabled])

  return <div ref={host} aria-hidden className="pointer-events-none absolute inset-0" />
}

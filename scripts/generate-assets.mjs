import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { deflateSync } from 'node:zlib'

const outDir = new URL('../public/', import.meta.url)
mkdirSync(outDir, { recursive: true })

const crcTable = new Uint32Array(256).map((_, index) => {
  let value = index
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  }
  return value >>> 0
})

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type)
  const length = Buffer.alloc(4)
  const crc = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])))
  return Buffer.concat([length, typeBuffer, data, crc])
}

function png(width, height, painter) {
  const pixels = Buffer.alloc(width * height * 4)

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4
      const [r, g, b, a] = painter(x, y, width, height)
      pixels[offset] = r
      pixels[offset + 1] = g
      pixels[offset + 2] = b
      pixels[offset + 3] = a
    }
  }

  const raw = Buffer.alloc(height * (width * 4 + 1))
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 4 + 1)
    raw[rowStart] = 0
    pixels.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4)
  }

  const header = Buffer.alloc(13)
  header.writeUInt32BE(width, 0)
  header.writeUInt32BE(height, 4)
  header[8] = 8
  header[9] = 6

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function mix(a, b, t) {
  return Math.round(a + (b - a) * t)
}

function avatar(seed) {
  return png(96, 96, (x, y, width, height) => {
    const dx = x - width / 2
    const dy = y - height / 2
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance > 47) return [0, 0, 0, 0]

    const warm = (x + y) / (width + height)
    const r = mix(126 + seed * 18, 249, warm)
    const g = mix(74 + seed * 10, 185, warm)
    const b = mix(38 + seed * 4, 121, warm)
    const ring = Math.abs(distance - (23 + seed * 4)) < 2.2
    const slash = Math.abs(y - x * (0.36 + seed * 0.08) - 20 + seed * 9) < 2.4
    const dot =
      Math.sqrt((x - 35 - seed * 8) ** 2 + (y - 34 + seed * 5) ** 2) < 5

    if (ring || slash) return [63, 34, 17, 235]
    if (dot && seed === 1) return [141, 214, 249, 255]
    if (dot && seed === 2) return [255, 219, 104, 255]
    if (dot) return [255, 170, 190, 255]
    return [r, g, b, 255]
  })
}

function lineDistance(x, y, ax, ay, bx, by) {
  const length = (bx - ax) ** 2 + (by - ay) ** 2
  const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / length))
  const px = ax + t * (bx - ax)
  const py = ay + t * (by - ay)
  return Math.sqrt((x - px) ** 2 + (y - py) ** 2)
}

function platform(kind) {
  return png(240, 240, (x, y, width, height) => {
    const cx = width / 2
    const cy = height / 2
    const dx = x - cx
    const dy = y - cy
    const distance = Math.sqrt(dx * dx + dy * dy)
    const base = distance < 102 ? 12 : 0
    const border = Math.abs(distance - 100) < 1.8
    let mark = false

    if (kind === 'chatgpt') {
      for (let i = 0; i < 6; i += 1) {
        const angle = (Math.PI * 2 * i) / 6
        const lx = cx + Math.cos(angle) * 42
        const ly = cy + Math.sin(angle) * 42
        if (Math.sqrt((x - lx) ** 2 + (y - ly) ** 2) < 30) mark = true
      }
      if (distance < 31) mark = false
    }

    if (kind === 'perplexity') {
      mark =
        lineDistance(x, y, 78, 70, 78, 170) < 5 ||
        lineDistance(x, y, 78, 70, 156, 116) < 5 ||
        lineDistance(x, y, 78, 170, 156, 116) < 5 ||
        lineDistance(x, y, 156, 70, 156, 170) < 5 ||
        lineDistance(x, y, 156, 70, 82, 116) < 5 ||
        lineDistance(x, y, 156, 170, 82, 116) < 5
    }

    if (kind === 'google') {
      const ring = Math.abs(distance - 46) < 8
      const open = x > cx + 8 && y < cy + 8
      const bar = x > cx && x < cx + 52 && Math.abs(y - cy) < 7
      mark = (ring && !open) || bar
    }

    if (border || mark) return [255, 255, 255, mark ? 235 : 120]
    return [base, base, base, distance < 108 ? 255 : 0]
  })
}

function saveMapMemory() {
  const pins = [
    [180, 168, 232, 113, 88],
    [420, 118, 98, 207, 132],
    [650, 250, 113, 181, 232],
    [910, 170, 255, 128, 101],
    [1080, 330, 232, 113, 88],
    [760, 520, 98, 207, 132],
    [330, 510, 113, 181, 232],
  ]

  return png(1280, 760, (x, y, width, height) => {
    const grain = ((x * 17 + y * 31) % 23) - 11
    const horizon = Math.sin(x / 95) * 18 + Math.cos(x / 41) * 8 + 380
    const roadOne = Math.abs(y - (260 + Math.sin(x / 95) * 66 + Math.cos(x / 34) * 16))
    const roadTwo = Math.abs(y - (520 + Math.sin(x / 125) * 46 - Math.cos(x / 50) * 12))
    const roadThree = Math.abs(x - (width * 0.62 + Math.sin(y / 76) * 44))
    const water = y > horizon
    let r = water ? 16 : 11
    let g = water ? 45 : 35
    let b = water ? 38 : 31
    let a = 255

    if (roadOne < 2 || roadTwo < 2 || roadThree < 2.2) {
      r = 96
      g = 207
      b = 132
    } else if (roadOne < 9 || roadTwo < 9 || roadThree < 9) {
      r = 34
      g = 80
      b = 66
    }

    for (const [px, py, pr, pg, pb] of pins) {
      const d = Math.sqrt((x - px) ** 2 + (y - py) ** 2)
      if (Math.abs(d - 42) < 2 || Math.abs(d - 28) < 1.5) {
        r = pr
        g = pg
        b = pb
      }
      if (d < 7) {
        r = 238
        g = 230
        b = 210
      }
    }

    const labelBand = x > 70 && x < 430 && y > 78 && y < 142
    if (labelBand) {
      r = Math.round(r * 0.35)
      g = Math.round(g * 0.35)
      b = Math.round(b * 0.35)
      a = 238
    }

    const vignette =
      Math.sqrt((x - width / 2) ** 2 + (y - height / 2) ** 2) /
      Math.sqrt((width / 2) ** 2 + (height / 2) ** 2)
    const shade = Math.max(0.38, 1 - vignette * 0.58)
    return [
      Math.max(0, Math.min(255, Math.round(r * shade + grain))),
      Math.max(0, Math.min(255, Math.round(g * shade + grain))),
      Math.max(0, Math.min(255, Math.round(b * shade + grain))),
      a,
    ]
  })
}

function saveIcon(kind) {
  return png(240, 240, (x, y, width, height) => {
    const cx = width / 2
    const cy = height / 2
    const distance = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
    const base = distance < 103
    const border = Math.abs(distance - 100) < 1.8
    let mark = false

    if (kind === 'source') {
      const top = lineDistance(x, y, 82, 92, 120, 68) < 5
      const right = lineDistance(x, y, 120, 68, 158, 92) < 5
      const left = lineDistance(x, y, 82, 92, 82, 152) < 5
      const bottom = lineDistance(x, y, 82, 152, 158, 152) < 5
      const rightWall = lineDistance(x, y, 158, 92, 158, 152) < 5
      mark = top || right || left || bottom || rightWall
    }

    if (kind === 'review') {
      const rect =
        (x > 74 && x < 166 && (Math.abs(y - 76) < 4 || Math.abs(y - 164) < 4)) ||
        (y > 76 && y < 164 && (Math.abs(x - 74) < 4 || Math.abs(x - 166) < 4))
      const check =
        lineDistance(x, y, 92, 126, 113, 146) < 5 ||
        lineDistance(x, y, 113, 146, 151, 101) < 5
      mark = rect || check
    }

    if (kind === 'stamp') {
      const pin = distance < 42 && y < 130
      const stem = lineDistance(x, y, 120, 126, 120, 170) < 5
      const ring = Math.abs(distance - 64) < 3
      mark = pin || stem || ring
      if (Math.sqrt((x - cx) ** 2 + (y - 105) ** 2) < 14) mark = false
    }

    if (border) return [63, 34, 17, 220]
    if (mark) return [63, 34, 17, 245]
    if (!base && distance >= 108) return [0, 0, 0, 0]

    if (kind === 'source') {
      return [141, 214, 249, distance < 94 ? 245 : 170]
    }
    if (kind === 'review') {
      return [255, 219, 104, distance < 94 ? 245 : 170]
    }
    return [255, 170, 190, distance < 94 ? 245 : 170]
  })
}

const assets = {
  'avatar-1.png': avatar(1),
  'avatar-2.png': avatar(2),
  'avatar-3.png': avatar(3),
  'icon-source-clue.png': saveIcon('source'),
  'icon-review-candidate.png': saveIcon('review'),
  'icon-map-stamp.png': saveIcon('stamp'),
  'save-map-memory.png': saveMapMemory(),
}

for (const [name, data] of Object.entries(assets)) {
  writeFileSync(join(outDir.pathname, name), data)
}

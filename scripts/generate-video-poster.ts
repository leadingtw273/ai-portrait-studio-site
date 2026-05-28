// scripts/generate-video-poster.ts
import { execSync } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const VIDEOS = [
  { name: 'tea-product-promo',   source: 'src/assets/tea-product-promo.mp4' },
  { name: 'automotive-kv-promo', source: 'src/assets/automotive-kv-promo.mp4' },
] as const

const OUT_DIR = 'public/video-posters'

function hasFfmpeg(): boolean {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

async function allPostersExist(): Promise<boolean> {
  for (const v of VIDEOS) {
    const out = path.join(OUT_DIR, `${v.name}.jpg`)
    try {
      await fs.access(out)
    } catch {
      return false
    }
  }
  return true
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true })

  // ffmpeg 不存在時的 fallback：若 poster 已 commit 進 repo，安靜跳過；否則 fail
  if (!hasFfmpeg()) {
    if (await allPostersExist()) {
      console.warn('⚠ ffmpeg not found; using committed posters in public/video-posters/')
      return
    }
    console.error('✗ ffmpeg not found AND no committed posters exist. Install ffmpeg or commit posters.')
    process.exit(1)
  }

  // 正常路徑：用 ffmpeg 從 mp4 抽第 1 秒 frame、resize 1280x720、jpg quality 4
  for (const v of VIDEOS) {
    const out = path.join(OUT_DIR, `${v.name}.jpg`)
    try {
      await fs.access(v.source)
    } catch {
      console.warn(`⚠ source not found, skip: ${v.source}`)
      continue
    }
    execSync(
      `ffmpeg -y -ss 00:00:01 -i "${v.source}" -frames:v 1 -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720" -q:v 4 "${out}"`,
      { stdio: 'inherit' },
    )
    console.log(`✓ ${out}`)
  }
}

main().catch((err) => {
  console.error('generate-video-poster failed:', err)
  process.exit(1)
})

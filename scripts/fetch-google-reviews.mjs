/**
 * Fetches Egnatia's Google rating + reviews from the official Places API (New)
 * and writes public/reviews.json for the site to display.
 *
 * Runs automatically before every build ("prebuild"). Needs GOOGLE_PLACES_API_KEY
 * (a GitHub Actions secret in CI). Without a key it writes an empty file and the
 * reviews section simply stays hidden, so builds never fail because of it.
 *
 * The JSON is regenerated on each deploy and by a daily scheduled build, and is
 * not committed to git (Google content isn't meant to be stored long-term).
 */
import { writeFileSync, existsSync } from 'node:fs'

const PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJBVgIVRlFwokRzoaH2eIn7Dk'
const KEY = process.env.GOOGLE_PLACES_API_KEY
const OUT = new URL('../public/reviews.json', import.meta.url)
const writeReviewUri = `https://search.google.com/local/writereview?placeid=${PLACE_ID}`

const empty = { fetchedAt: null, rating: null, count: 0, mapsUri: null, writeReviewUri, reviews: [] }

async function main() {
  if (!KEY) {
    // Local builds without a key keep whatever file is there; CI starts clean, so the section hides
    if (!existsSync(OUT)) writeFileSync(OUT, JSON.stringify(empty))
    console.log('[reviews] GOOGLE_PLACES_API_KEY not set: skipping Google reviews')
    return
  }
  const res = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=en`, {
    headers: {
      'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
    },
  })
  if (!res.ok) {
    console.warn(`[reviews] Places API ${res.status}: ${(await res.text()).slice(0, 300)}`)
    writeFileSync(OUT, JSON.stringify(empty))
    return
  }
  const place = await res.json()
  const data = {
    fetchedAt: new Date().toISOString(),
    rating: place.rating ?? null,
    count: place.userRatingCount ?? 0,
    mapsUri: place.googleMapsUri ?? null,
    writeReviewUri,
    reviews: (place.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? 'Google user',
        authorUri: r.authorAttribution?.uri ?? null,
        photo: r.authorAttribution?.photoUri ?? null,
        rating: r.rating ?? null,
        text: r.originalText?.text ?? r.text?.text ?? '',
        lang: r.originalText?.languageCode ?? r.text?.languageCode ?? 'en',
        time: r.publishTime ?? null,
        relative: r.relativePublishTimeDescription ?? '',
        uri: r.googleMapsUri ?? null,
      }))
      .filter((r) => r.text.trim()),
  }
  writeFileSync(OUT, JSON.stringify(data))
  console.log(`[reviews] ${data.rating}★ from ${data.count} reviews, ${data.reviews.length} with text`)
}

main().catch((err) => {
  console.warn('[reviews] failed:', err.message)
  writeFileSync(OUT, JSON.stringify(empty))
})

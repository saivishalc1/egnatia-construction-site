import { useEffect, useState } from 'react'
import { publicUrl } from './utils'

export type GoogleReview = {
  author: string
  authorUri: string | null
  photo: string | null
  rating: number | null
  text: string
  lang: string
  time: string | null
  relative: string
  uri: string | null
}

export type GoogleReviews = {
  fetchedAt: string | null
  rating: number | null
  count: number
  mapsUri: string | null
  writeReviewUri: string
  reviews: GoogleReview[]
}

let cache: Promise<GoogleReviews | null> | null = null

/** reviews.json is written at build time from the Google Places API; fetched once and shared. */
function loadReviews() {
  cache ??= fetch(publicUrl('reviews.json'))
    .then((r) => (r.ok ? (r.json() as Promise<GoogleReviews>) : null))
    .catch(() => null)
  return cache
}

/** Google rating + reviews, or null when there's no data (the UI then hides itself). */
export function useGoogleReviews() {
  const [data, setData] = useState<GoogleReviews | null>(null)
  useEffect(() => {
    let alive = true
    loadReviews().then((d) => alive && setData(d && d.rating ? d : null))
    return () => {
      alive = false
    }
  }, [])
  return data
}

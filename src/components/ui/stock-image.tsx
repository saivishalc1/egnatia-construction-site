import { unsplash, unsplashSrcSet } from '@/data'

type StockImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  /** Unsplash photo id */
  id: string
  /** Layout width hint, e.g. "(min-width: 1024px) 33vw, 100vw" */
  sizes: string
}

/** Responsive, lazily decoded Unsplash image. */
export function StockImage({ id, sizes, loading = 'lazy', ...rest }: StockImageProps) {
  return (
    <img
      src={unsplash(id, 1200)}
      srcSet={unsplashSrcSet(id)}
      sizes={sizes}
      loading={loading}
      decoding="async"
      {...rest}
    />
  )
}

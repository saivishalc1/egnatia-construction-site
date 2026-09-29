// Number Ticker Currency Counter by @shadcnspace on 21st.dev
// https://21st.dev/@shadcnspace/components/number-ticker-02
// Adapted: accepts any Intl format (compact currency for the estimator) and a prefix/suffix.

import NumberFlow, { type Format, type Value } from '@number-flow/react'

type NumberTickerProps = {
  value: Value
  /** BCP 47 locale, e.g. "en-US" or "es-US". */
  locales?: string
  format?: Format
  prefix?: string
  suffix?: string
  className?: string
}

const currencyCompact: Format = {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
}

/** Smoothly rolls each digit when the value changes. */
export default function NumberTicker({
  value,
  locales,
  format = currencyCompact,
  prefix,
  suffix,
  className,
}: NumberTickerProps) {
  return (
    <NumberFlow
      value={value}
      locales={locales}
      format={format}
      prefix={prefix}
      suffix={suffix}
      className={className}
      willChange
    />
  )
}

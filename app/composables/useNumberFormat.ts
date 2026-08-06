import { toValue, type MaybeRefOrGetter } from 'vue'

export type TNumberFormatValue = number | bigint | string | null | undefined

export type TNumberFormatOptions = Intl.NumberFormatOptions & {
  locale?: string
}

export type TUseNumberFormatOptions = {
  locale?: MaybeRefOrGetter<string | undefined>
}

export type TUseNumberFormatControls = {
  formatNumber: (value: TNumberFormatValue, options?: TNumberFormatOptions) => string
  padNumber: (value: TNumberFormatValue, length?: number) => string
}

const DEFAULT_PADDING_LENGTH = 2

const getFormatterCacheKey = (
  locale: string | undefined,
  options: Intl.NumberFormatOptions
): string =>
  JSON.stringify([
    locale ?? '',
    Object.entries(options).sort(([left], [right]) => left.localeCompare(right)),
  ])

export const useNumberFormat = (
  options: TUseNumberFormatOptions = {}
): TUseNumberFormatControls => {
  const { locale: appLocale } = useI18n()
  const formatterCache = new Map<string, Intl.NumberFormat>()

  const getFormatter = (
    locale: string | undefined,
    numberOptions: Intl.NumberFormatOptions
  ): Intl.NumberFormat => {
    const cacheKey = getFormatterCacheKey(locale, numberOptions)
    const cachedFormatter = formatterCache.get(cacheKey)

    if (cachedFormatter) {
      return cachedFormatter
    }

    const formatter = new Intl.NumberFormat(locale, numberOptions)
    formatterCache.set(cacheKey, formatter)

    return formatter
  }

  const formatNumber = (
    value: TNumberFormatValue,
    formatOptions: TNumberFormatOptions = {}
  ): string => {
    if (value === null || value === undefined) {
      return ''
    }

    if (typeof value === 'string') {
      const normalizedValue = value.trim()

      if (!normalizedValue) {
        return ''
      }

      const numericValue = Number(normalizedValue)

      if (!Number.isFinite(numericValue)) {
        return value
      }

      value = numericValue
    }

    if (typeof value === 'number' && !Number.isFinite(value)) {
      return String(value)
    }

    const { locale: formatLocale, ...numberOptions } = formatOptions
    const locale =
      formatLocale?.trim() ||
      toValue(options.locale)?.trim() ||
      appLocale.value?.trim() ||
      undefined
    const formatter = getFormatter(locale, {
      useGrouping: true,
      ...numberOptions,
    })
    const normalizedValue = typeof value === 'number' && Object.is(value, -0) ? 0 : value

    return formatter.format(normalizedValue)
  }

  const padNumber = (value: TNumberFormatValue, length = DEFAULT_PADDING_LENGTH): string => {
    if (value === null || value === undefined) {
      return ''
    }

    const normalizedValue = String(value).trim()
    const paddingLength =
      Number.isSafeInteger(length) && length > 0 ? length : DEFAULT_PADDING_LENGTH

    if (!/^\d+$/.test(normalizedValue)) {
      return value.toString()
    }

    return normalizedValue.padStart(paddingLength, '0')
  }

  return {
    formatNumber,
    padNumber,
  }
}

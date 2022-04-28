import RegexUtils from 'common/utils/regex.utils'

export type CorsCallback = (err: Error | null, allow?: boolean) => void
export type CorsValidator = (origin: string | undefined, callback: CorsCallback) => void

export default class CorsUtils {
  static createRegexValidator(allowedUrls: string[]): CorsValidator {
    const urlRegexes = this.createUrlRegexes(allowedUrls)

    return (origin, callback) => {
      const isAllowed = !origin || urlRegexes.some(regex => regex.test(origin))
      const error = !isAllowed ? new Error(`Unknown origin: ${origin}`) : null
      callback(error, isAllowed)
    }
  }

  private static createUrlRegexes(allowedUrls: string[]): RegExp[] {
    if (allowedUrls.includes('*')) {
      return [/^.+$/i]
    }

    return allowedUrls.map(url => {
      const regexSafeUrl = RegexUtils.escapeValue(url)
      return new RegExp(`^${regexSafeUrl}\/*$`, 'i')
    })
  }
}

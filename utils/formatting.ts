// Formatting Utilities for ECCLIVO Telegram Mini App

import dayjs from 'dayjs'

/**
 * Format price with thousand separators
 * @param value - Number to format
 * @param currency - Currency symbol (default: 'сум')
 * @returns Formatted price string
 */
export function formatPrice(value: number, currency: string = 'сум'): string {
  if (value === null || value === undefined || isNaN(value)) {
    return `0 ${currency}`
  }

  const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${formatted} ${currency}`
}

/**
 * Format date to YYYY-MM-DD format
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * Format date to display format (DD.MM.YYYY)
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDisplayDate(date: string | Date): string {
  if (!date) return ''
  return dayjs(date).format('DD.MM.YYYY')
}

/**
 * Format phone number to +998 XX XXX XX XX format
 * @param phone - Phone number to format
 * @returns Formatted phone number
 */
export function formatPhone(phone: string): string {
  if (!phone) return ''

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  // Format: +998 XX XXX XX XX
  if (cleaned.length === 12 && cleaned.startsWith('998')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`
  }

  // If already starts with +998
  if (cleaned.length === 12) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`
  }

  return phone
}

/**
 * Format passport series and number
 * @param series - Passport series
 * @param number - Passport number
 * @returns Formatted passport string
 */
export function formatPassport(series: string, number: string): string {
  if (!series || !number) return ''
  return `${series.toUpperCase()} ${number}`
}

/**
 * Format government number (XX 123 XXX)
 * @param govNumber - Government number
 * @returns Formatted government number
 */
export function formatGovNumber(govNumber: string): string {
  if (!govNumber) return ''

  const cleaned = govNumber.replace(/\s/g, '').toUpperCase()

  // Format: XX 123 XXX
  if (cleaned.length >= 8) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)}`
  }

  return govNumber.toUpperCase()
}

/**
 * Format tech passport (series and number)
 * @param series - Tech passport series
 * @param number - Tech passport number
 * @returns Formatted tech passport string
 */
export function formatTechPassport(series: string, number: string): string {
  if (!series || !number) return ''
  return `${series.toUpperCase()} ${number}`
}

/**
 * Parse price string to number
 * @param priceString - Price string with separators
 * @returns Numeric value
 */
export function parsePrice(priceString: string): number {
  if (!priceString) return 0

  const cleaned = priceString.replace(/[^\d]/g, '')
  return parseInt(cleaned, 10) || 0
}

/**
 * Get localized name based on locale
 * @param item - Object with name and nameUz properties
 * @param locale - Current locale ('ru' or 'uz')
 * @returns Localized name
 */
export function getLocalizedName(item: any, locale: string = 'ru'): string {
  if (!item) return ''

  if (locale === 'uz' && item.nameUz) {
    return item.nameUz
  }

  return item.name || item.nameUz || ''
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis
 */
export function truncate(text: string, maxLength: number = 50): string {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Capitalize first letter of string
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalize(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Format full name from individual parts
 * @param lastName - Last name
 * @param firstName - First name
 * @param middleName - Middle name
 * @returns Full name string
 */
export function formatFullName(
  lastName?: string,
  firstName?: string,
  middleName?: string
): string {
  const parts = [lastName, firstName, middleName].filter(Boolean)
  return parts.join(' ')
}

/**
 * Format address for display
 * @param address - Address object or string
 * @returns Formatted address string
 */
export function formatAddress(address: any): string {
  if (!address) return ''

  if (typeof address === 'string') {
    return address
  }

  // If address is an object, try to format it
  const parts = [
    address.region,
    address.district,
    address.street,
    address.house
  ].filter(Boolean)

  return parts.join(', ')
}

/**
 * Format vehicle info for display
 * @param vehicle - Vehicle object
 * @returns Formatted vehicle string
 */
export function formatVehicleInfo(vehicle: any): string {
  if (!vehicle) return ''

  const parts = [
    vehicle.model,
    vehicle.year ? `(${vehicle.year})` : null,
    vehicle.color
  ].filter(Boolean)

  return parts.join(' ')
}

/**
 * Format file size
 * @param bytes - Size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format duration (minutes to human readable)
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} мин`
  }

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (mins === 0) {
    return `${hours} ч`
  }

  return `${hours} ч ${mins} мин`
}

/**
 * Format percentage
 * @param value - Numeric value
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Mask sensitive data (e.g., passport, phone)
 * @param value - Value to mask
 * @param visibleChars - Number of visible characters at start and end
 * @returns Masked string
 */
export function maskSensitiveData(value: string, visibleChars: number = 2): string {
  if (!value || value.length <= visibleChars * 2) return value

  const start = value.slice(0, visibleChars)
  const end = value.slice(-visibleChars)
  const masked = '*'.repeat(value.length - visibleChars * 2)

  return `${start}${masked}${end}`
}

/**
 * Format validation error messages
 * @param errors - Validation errors object
 * @returns Formatted error string
 */
export function formatValidationErrors(errors: Record<string, string>): string {
  return Object.values(errors).join(', ')
}

/**
 * Format gender value to display text
 * @param gender - Gender value ('male' or 'female')
 * @param locale - Current locale ('ru' or 'uz')
 * @returns Formatted gender string
 */
export function formatGender(gender?: string | null, locale: string = 'ru'): string {
  if (!gender) return ''
  
  const genderLower = String(gender).toLowerCase()
  if (genderLower === 'male' || genderLower === 'мужской' || genderLower === 'erkak') {
    return locale === 'uz' ? 'Erkak' : 'Мужской'
  }
  if (genderLower === 'female' || genderLower === 'женский' || genderLower === 'ayol') {
    return locale === 'uz' ? 'Ayol' : 'Женский'
  }
  return String(gender)
}

/**
 * Format time ago (e.g., "2 hours ago")
 * @param date - Date to compare
 * @returns Time ago string
 */
export function formatTimeAgo(date: string | Date): string {
  const now = dayjs()
  const then = dayjs(date)

  const diffMinutes = now.diff(then, 'minute')
  const diffHours = now.diff(then, 'hour')
  const diffDays = now.diff(then, 'day')

  if (diffMinutes < 1) return 'только что'
  if (diffMinutes < 60) return `${diffMinutes} мин назад`
  if (diffHours < 24) return `${diffHours} ч назад`
  if (diffDays < 7) return `${diffDays} дн назад`

  return formatDisplayDate(date)
}

/**
 * Convert date from YYYY-MM-DD (API format) to DD-MM-YYYY (display format)
 * @param date - Date in YYYY-MM-DD format
 * @returns Date in DD-MM-YYYY format
 */
export function dateToDisplayFormat(date: string): string {
  if (!date) return ''
  
  // If already in DD-MM-YYYY format, return as is
  if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    return date
  }
  
  // Convert from YYYY-MM-DD to DD-MM-YYYY
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const parts = date.split('-')
    return `${parts[2]}-${parts[1]}-${parts[0]}`
  }
  
  // Try using dayjs
  try {
    return dayjs(date).format('DD-MM-YYYY')
  } catch {
    return date
  }
}

/**
 * Convert date from DD-MM-YYYY (display format) to YYYY-MM-DD (API format)
 * @param date - Date in DD-MM-YYYY format
 * @returns Date in YYYY-MM-DD format
 */
export function dateToApiFormat(date: string): string {
  if (!date) return ''
  
  // If already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date
  }
  
  // Convert from DD-MM-YYYY to YYYY-MM-DD
  if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    const parts = date.split('-')
    return `${parts[2]}-${parts[1]}-${parts[0]}`
  }
  
  // Try using dayjs
  try {
    return dayjs(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
  } catch {
    return date
  }
}

/**
 * Validate date in DD-MM-YYYY format
 * @param date - Date string to validate
 * @returns true if valid, false otherwise
 */
export function isValidDate(date: string): boolean {
  if (!date) return false
  
  // Check format DD-MM-YYYY
  if (!/^\d{2}-\d{2}-\d{4}$/.test(date)) return false
  
  const parts = date.split('-')
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[2], 10)
  
  // Basic validation
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  if (year < 1900 || year > 2100) return false
  
  // Check if date is valid using dayjs
  try {
    const d = dayjs(`${year}-${month}-${day}`, 'YYYY-MM-DD')
    return d.isValid() && d.format('YYYY-MM-DD') === `${year}-${month}-${day}`
  } catch {
    return false
  }
}

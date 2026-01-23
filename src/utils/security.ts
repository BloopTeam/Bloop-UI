/**
 * Security utilities for Bloop UI
 * All input sanitization and security helpers
 */

/**
 * Sanitize HTML string to prevent XSS attacks
 * Removes all HTML tags and encodes special characters
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitize input for use in file paths
 * Prevents path traversal attacks
 */
export function sanitizePath(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/\.\./g, '')
    .replace(/[<>:"|?*]/g, '')
    .replace(/^\/+/, '')
    .trim()
}

/**
 * Sanitize input for use in terminal commands
 * Prevents command injection
 */
export function sanitizeCommand(input: string): string {
  if (typeof input !== 'string') return ''
  
  // Remove dangerous shell characters
  return input
    .replace(/[;&|`$(){}[\]!#]/g, '')
    .replace(/\r?\n/g, ' ')
    .trim()
}

/**
 * Validate and sanitize URL
 * Only allows http, https protocols
 */
export function sanitizeUrl(input: string): string | null {
  if (typeof input !== 'string') return null
  
  try {
    const url = new URL(input)
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null
    }
    return url.href
  } catch {
    return null
  }
}

/**
 * Sanitize user-provided JSON
 * Prevents prototype pollution
 */
export function safeJsonParse<T>(input: string, fallback: T): T {
  try {
    const parsed = JSON.parse(input)
    
    // Prevent prototype pollution
    if (parsed && typeof parsed === 'object') {
      delete parsed.__proto__
      delete parsed.constructor
      delete parsed.prototype
    }
    
    return parsed as T
  } catch {
    return fallback
  }
}

/**
 * Rate limiter for preventing abuse
 */
export class RateLimiter {
  private timestamps: number[] = []
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests: number = 10, windowMs: number = 1000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  canProceed(): boolean {
    const now = Date.now()
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs)
    
    if (this.timestamps.length >= this.maxRequests) {
      return false
    }
    
    this.timestamps.push(now)
    return true
  }

  reset(): void {
    this.timestamps = []
  }
}

/**
 * Secure storage wrapper with encryption placeholder
 */
export const secureStorage = {
  set(key: string, value: string): void {
    const sanitizedKey = sanitizePath(key)
    try {
      localStorage.setItem(`bloop_${sanitizedKey}`, value)
    } catch (e) {
      console.warn('Storage unavailable')
    }
  },

  get(key: string): string | null {
    const sanitizedKey = sanitizePath(key)
    try {
      return localStorage.getItem(`bloop_${sanitizedKey}`)
    } catch {
      return null
    }
  },

  remove(key: string): void {
    const sanitizedKey = sanitizePath(key)
    try {
      localStorage.removeItem(`bloop_${sanitizedKey}`)
    } catch {
      // Ignore
    }
  },

  clear(): void {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('bloop_'))
      keys.forEach(k => localStorage.removeItem(k))
    } catch {
      // Ignore
    }
  }
}

/**
 * Content validation
 */
export function isValidFileName(name: string): boolean {
  if (!name || typeof name !== 'string') return false
  if (name.length > 255) return false
  
  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/
  if (invalidChars.test(name)) return false
  
  // Check for reserved names (Windows)
  const reserved = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i
  if (reserved.test(name)) return false
  
  return true
}

/**
 * Generate cryptographically secure random ID
 */
export function generateSecureId(length: number = 16): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

import Cookies from 'universal-cookie'
import * as z from 'zod'

const detectedThemeSchema = z.enum(['dark', 'light'], {
  message: 'Theme must be either "dark" or "light"',
})

const selectedThemeSchema = z.enum(['', 'dark', 'light'], {
  message: 'Selected theme must be "", "dark", or "light"',
})

const themeSchema = z
  .object({
    detected: detectedThemeSchema.default('light'),
    selected: selectedThemeSchema.default(''),
  })
  .strict() // Prevents additional properties

export type ThemeCookie = z.infer<typeof themeSchema>
export type DetectedTheme = z.infer<typeof detectedThemeSchema>
export type SelectedTheme = z.infer<typeof selectedThemeSchema>

/**
 * Default theme configuration
 */
const DEFAULT_THEME: ThemeCookie = {
  detected: 'light',
  selected: '', // Empty means follow system
}

/**
 * Cookie configuration for theme persistence
 */
const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 60 * 60 * 24 * 365, // 1 year
  sameSite: 'lax' as const,
}

export function getTheme(rawCookie?: string | null): ThemeCookie {
  try {
    const cookies = new Cookies(rawCookie || null)
    const themeCookie = cookies.get('theme')

    // Return default if no cookie exists
    if (!themeCookie) {
      return DEFAULT_THEME
    }

    // Parse and validate the cookie data
    const parseResult = themeSchema.safeParse(themeCookie)

    if (!parseResult.success) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Invalid theme cookie data:', parseResult.error.format())
      }
      return DEFAULT_THEME
    }

    return parseResult.data
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error reading theme cookie:', error)
    }
    return DEFAULT_THEME
  }
}

export function setTheme(nextTheme: ThemeCookie): void {
  try {
    const validatedTheme = themeSchema.parse(nextTheme)

    const cookies = new Cookies()
    cookies.set('theme', validatedTheme, COOKIE_OPTIONS)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Invalid theme data: ${error.issues.map((issue) => issue.message).join(', ')}`,
      )
    }
    throw error
  }
}

export function updateDetectedTheme(
  detectedTheme: DetectedTheme,
  rawCookie?: string | null,
): void {
  const currentTheme = getTheme(rawCookie)
  const updatedTheme: ThemeCookie = {
    ...currentTheme,
    detected: detectedTheme,
  }
  setTheme(updatedTheme)
}

export function updateSelectedTheme(
  selectedTheme: SelectedTheme,
  rawCookie?: string | null,
): void {
  const currentTheme = getTheme(rawCookie)
  const updatedTheme: ThemeCookie = {
    ...currentTheme,
    selected: selectedTheme,
  }
  setTheme(updatedTheme)
}

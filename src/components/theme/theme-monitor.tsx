import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { updateDetectedTheme } from './theme-storage'

export function ThemeMonitor() {
  const router = useRouter()

  useEffect(() => {
    const themeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    function handleThemeChange() {
      updateDetectedTheme(themeQuery.matches ? 'dark' : 'light')
      router.invalidate()
    }
    themeQuery.addEventListener('change', handleThemeChange)
    return () => {
      themeQuery.removeEventListener('change', handleThemeChange)
    }
  }, [router])
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
            console.log('Theme script is running');
            const allCookies = (document.cookie || "").split(";");
            const themeCookie = allCookies.find((cookie) => cookie.trim().startsWith("theme="));
            if (!themeCookie && navigator.cookieEnabled) {
              const themeDetected = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
              document.cookie = 'theme=' + JSON.stringify({ detected: themeDetected, selected: "" }) + ';path=/';
              window.location.reload();
            }
			`,
      }}
    />
  )
}

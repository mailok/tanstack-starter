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
            const themeDetected = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            if (!themeCookie && navigator.cookieEnabled) {
              document.cookie = 'theme=' + JSON.stringify({ detected: themeDetected, selected: "" }) + ';path=/';
              window.location.reload();
            } else if (themeCookie && navigator.cookieEnabled) {
              try {
                const cookieValue = decodeURIComponent(themeCookie.trim().substring(6));
                const themeData = JSON.parse(cookieValue);
                if (themeData.detected !== themeDetected) {
                  themeData.detected = themeDetected;
                  document.cookie = 'theme=' + JSON.stringify(themeData) + ';path=/';
                  window.location.reload();
                }
              } catch (e) {
                console.error('Error parsing theme cookie:', e);
              }
            }
			`,
      }}
    />
  )
}

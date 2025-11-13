import { UnderConstruction } from '@/components/under-construction'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return <UnderConstruction pageName="Home" />
}

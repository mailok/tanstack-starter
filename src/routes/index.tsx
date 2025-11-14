import { UnderConstruction } from '@/components/under-construction'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
  notFoundComponent: () => <div>Not Found (Index)</div>,
  errorComponent: () => <div>Error (Index)</div>,
})

function App() {
  return <UnderConstruction pageName="Home" />
}

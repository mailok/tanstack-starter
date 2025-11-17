import { UnderConstruction } from '@/components/under-construction'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getEnv = createServerFn({ method: 'GET' }).handler(async () => {
  return {
    DATABASE_URL: process.env.DATABASE_URL,
  }
})

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    return {
      env: await getEnv(),
    }
  },
})

function App() {
  const { env } = Route.useLoaderData()
  return (
    <>
      <p>ENV: {env.DATABASE_URL}</p>
      <UnderConstruction pageName="Home" />
    </>
  )
}

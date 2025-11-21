type SleepOtions = {
  delay?: number
  error?: true | { random?: true }
}

const DEFAULT_DELAY = Math.floor(Math.random() * (1200 - 100 + 1)) + 100
const DEFAULT_ERROR_MESSAGE = 'Something went wrong!'

export async function sleep(options: SleepOtions = {}) {
  const { delay = DEFAULT_DELAY, error = false } = options

  await new Promise((resolve) => setTimeout(resolve, delay))

  if (error) {
    if (error === true) {
      throw new Error(DEFAULT_ERROR_MESSAGE)
    }

    if (error.random === true) {
      if (Math.random() < 0.5) {
        throw new Error(DEFAULT_ERROR_MESSAGE)
      }
    }
  }
}

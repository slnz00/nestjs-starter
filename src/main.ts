import bootstrapApp from 'app/app.bootstrap'
import shutdownApp from 'app/app.shutdown'

async function main(): Promise<void> {
  const app = await bootstrapApp()

  setupInterruptSignal(async () => {
    await shutdownApp(app)
  })
}

function setupInterruptSignal(handleShutdown: () => Promise<void>): void {
  let shouldTerminate = false

  process.on('SIGINT', async () => {
    // Forcefully close application after second interrupt signal
    if (shouldTerminate) {
      process.exit(130)
    }
    shouldTerminate = true

    try {
      await handleShutdown()
      process.exit(0)
    } catch (err) {
      console.error('Error during application shutdown:', err)
      process.exit(1)
    }
  })
}

main().catch(console.error)

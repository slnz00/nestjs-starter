import { INestApplication } from '@nestjs/common'

const SHUTDOWN_TIMEOUT = 10000

export default function shutdown(_app: INestApplication): Promise<void> {
  return shutdownWithTimeout(async () => {
    // TODO...
  })
}

function shutdownWithTimeout(handler: () => Promise<void>): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const timerId = setTimeout(
      (): void => reject(new Error(`App was shutdown timed out, timeout amount: ${SHUTDOWN_TIMEOUT}ms`)),
      SHUTDOWN_TIMEOUT
    )

    const resolveTimeout = (): void => {
      clearTimeout(timerId)
      resolve()
    }

    handler().then(resolveTimeout).catch(reject)
  })
}

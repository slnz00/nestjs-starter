import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import Config from 'common/config'
import AppModule from './app.module'
import setupApp from './setup'

export default async function bootstrap(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  })

  await setupApp(app)
  await startApp(app)
  await displayAppInfo(app)

  return app
}

async function startApp(app: INestApplication): Promise<void> {
  const config = Config.getInstance()

  await app.listen(config.app.port)
}

async function displayAppInfo(app: INestApplication): Promise<void> {
  const config = Config.getInstance()
  const getAppUrl = async (): Promise<string> => {
    const url = await app.getUrl()
    return url.replace('::', 'localhost').replace('[::1]', 'localhost')
  }

  const lines = [
    '',
    `Application is running on: ${await getAppUrl()}`,
    `Node environment: ${config.environment.nodeEnv}`,
  ]

  console.info(lines.join('\n'))
}

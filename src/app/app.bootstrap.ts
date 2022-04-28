import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import Config from 'common/config'
import AppModule from './App.module'
import setupApp from './setup'

export default async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  })

  await setupApp(app)
  await startApp(app)
  await displayAppInfo(app)
}

async function startApp(app: INestApplication): Promise<void> {
  const config = Config.getInstance()

  await app.listen(config.app.port)
}

async function displayAppInfo(app: INestApplication): Promise<void> {
  const config = Config.getInstance()
  const getAppUrl = async (): Promise<string> => {
    const url = await app.getUrl()
    return url.replace('[::1]', 'localhost')
  }

  const environments = {
    node: config.environment.node || 'undefined',
    app: config.environment.app || 'undefined',
  }

  console.info(
    `\nApplication is running on: ${await getAppUrl()}` +
      `\nNode environment: ${environments.node}` +
      `\nApp environment: ${environments.app}\n`
  )
}

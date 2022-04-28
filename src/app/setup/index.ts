import { INestApplication } from '@nestjs/common'
import setupCors from 'app/setup/cors.setup'
import SingletonProvider from 'common/providers/singleton.provider'

export default async function setupApp(app: INestApplication): Promise<void> {
  await app.init()
  await SingletonProvider.waitForInitializations()

  await setupCors(app)
}

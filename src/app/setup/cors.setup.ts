import { INestApplication } from '@nestjs/common'
import Config from 'common/config'
import CorsUtils from 'common/utils/cors.utils'

export default async function setupCors(app: INestApplication): Promise<void> {
  const config = Config.getInstance()

  const validator = CorsUtils.createRegexValidator(config.security.corsAllowedUrls)

  app.enableCors({
    optionsSuccessStatus: 200,
    origin: validator,
  })
}

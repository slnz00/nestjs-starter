import { Logger } from '@nestjs/common'
import Config from 'common/config'
import SingletonProvider from 'common/providers/singleton.provider'

export default abstract class ServiceProvider extends SingletonProvider {
  readonly logger = new Logger(this.constructor.name)
  readonly config = Config.getInstance()
}

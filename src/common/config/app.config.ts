import { IsInt } from 'class-validator'
import BaseConfig from 'common/config/base.config'

export default class AppConfig extends BaseConfig {
  @IsInt()
  readonly port = this.get('app.port', 6060)
}

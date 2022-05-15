import { IsOptional, IsString } from 'class-validator'
import BaseConfig from 'common/config/base.config'

export default class EnvironmentConfig extends BaseConfig {
  @IsString()
  @IsOptional()
  readonly nodeEnv = this.getEnv('NODE_ENV', null)

  @IsString()
  @IsOptional()
  readonly tz = this.getEnv('TZ', null)
}

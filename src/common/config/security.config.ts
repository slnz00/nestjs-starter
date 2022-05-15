import { Type } from 'class-transformer'
import { IsDefined, IsString, ValidateNested } from 'class-validator'
import BaseConfig from 'common/config/base.config'

class CorsConfig extends BaseConfig {
  @IsString({ each: true })
  @IsDefined({ each: true })
  readonly allowedUrls: string[] = this.get('security.cors.allowedUrls', ['*'])
}

export default class SecurityConfig {
  @ValidateNested()
  @Type(() => CorsConfig)
  readonly cors = new CorsConfig()
}

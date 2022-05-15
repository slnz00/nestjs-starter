import EnvironmentConfig from 'common/config/environment.config'
import SecurityConfig from 'common/config/security.config'
import AppConfig from 'common/config/app.config'
import { Type } from 'class-transformer'
import { ValidateNested, validateSync } from 'class-validator'

export default class Config {
  @ValidateNested()
  @Type(() => SecurityConfig)
  readonly security = new SecurityConfig()

  @ValidateNested()
  @Type(() => EnvironmentConfig)
  readonly environment = new EnvironmentConfig()

  @ValidateNested()
  @Type(() => AppConfig)
  readonly app = new AppConfig()

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private static instance: Config | null

  private constructor() {
    this.validate()
  }

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config()
    }

    return Config.instance
  }

  private validate(): void {
    const errors = validateSync(this, { skipMissingProperties: false })

    if (errors.length > 0) {
      throw new Error(errors.toString())
    }
  }
}

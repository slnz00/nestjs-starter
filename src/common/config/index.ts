import EnvironmentConfig from 'common/config/environment.config'
import SecurityConfig from 'common/config/security.config'
import AppConfig from 'common/config/app.config'
import { Type } from 'class-transformer'
import { ValidateNested, validateSync } from 'class-validator'
import * as dotenv from 'dotenv'

// Load environment variables when ConfigService is imported
loadEnvironmentFiles()

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
    this._validate()
  }

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config()
    }

    return Config.instance
  }

  private _validate(): void {
    const errors = validateSync(this, { skipMissingProperties: false })

    if (errors.length > 0) {
      throw new Error(errors.toString())
    }
  }
}

// Environment variable load order is: .env, .env.[APP_ENV], runtime environment
//  - The goal is to define environment variables in .env files instead of runtime environment
//  - .env.[APP_ENV] files are used to define runtime environments in a version-controlled way
function loadEnvironmentFiles(): void {
  // Load .env to get/override existing APP_ENV environment variable
  dotenv.config({ path: '.env', override: true })

  const appEnv = process.env.APP_ENV
  if (appEnv) {
    dotenv.config({ path: `env/.env.${appEnv}`, override: true })

    // Load .env again to override environment variables defined in .env.[APP_ENV] file
    dotenv.config({ path: '.env', override: true })
  }
}

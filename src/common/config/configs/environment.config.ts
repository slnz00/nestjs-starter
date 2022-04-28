import { IsOptional, IsString } from 'class-validator'

const { env } = process

export default class EnvironmentConfig {
  @IsString()
  @IsOptional()
  app = env.APP_ENV || null

  @IsString()
  @IsOptional()
  node = env.NODE_ENV || null

  @IsString()
  @IsOptional()
  tz = env.TZ || null
}

import { IsDefined, IsString } from 'class-validator'

const { env } = process

export default class SecurityConfig {
  @IsString({ each: true })
  @IsDefined({ each: true })
  corsAllowedUrls: string[] = env.CORS_ALLOWED_URLS_JSON ? JSON.parse(env.CORS_ALLOWED_URLS_JSON) : ['*']
}

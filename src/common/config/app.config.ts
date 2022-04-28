import { IsInt } from 'class-validator'

const { env } = process

export default class AppConfig {
  @IsInt()
  port = this.getPort() || 6060

  getPort(): number | null {
    if (!env.PORT) {
      return null
    }

    const port = parseInt(env.PORT, 10)
    return !Number.isNaN(port) ? port : null
  }
}

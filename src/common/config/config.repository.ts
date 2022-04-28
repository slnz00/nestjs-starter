import * as config from 'config'

export default class ConfigRepository {
  private static instance: ConfigRepository | null

  private constructor() {
    this.initialize()
  }

  static getInstance(): ConfigRepository {
    if (!ConfigRepository.instance) {
      ConfigRepository.instance = new ConfigRepository()
    }

    return ConfigRepository.instance
  }

  private initialize() {
    con
  }
}

import * as config from 'config'

const ENV_KEY = '__env__'

interface EnvVarDefinition {
  [ENV_KEY]: string
}

export default abstract class BaseConfig {
  private static isEnvVarDefinition(value: any): value is EnvVarDefinition {
    return !!value && typeof value === 'object' && typeof value[ENV_KEY] === 'string'
  }

  private static parseEnvVar<T>(property: string, def: EnvVarDefinition): T {
    const envVarName = def[ENV_KEY]
    const value = process.env[envVarName]
    if (value === undefined) {
      throw new Error(`Failed to get config property "${property}" from environment variable "${envVarName}"`)
    }

    try {
      return JSON.parse(value)
    } catch (_err) {
      return value as unknown as T
    }
  }

  protected getEnv(name: string, defaultValue?: string | null): string | undefined | null {
    const value = process.env[name]
    return value !== undefined ? value : defaultValue
  }

  protected get<T = any>(property: string, defaultValue?: T): T {
    try {
      const value = config.get(property)

      // Config values defined as { "__env__": "ENV_VAR_NAME" } get retrieved and parsed from env vars
      if (BaseConfig.isEnvVarDefinition(value)) {
        return BaseConfig.parseEnvVar<T>(property, value)
      }

      return value
    } catch (err) {
      const isConfigNotFoundError = err.message === `Configuration property "${property}" is not defined`
      if (isConfigNotFoundError && defaultValue !== undefined) {
        return defaultValue
      }

      throw err
    }
  }
}

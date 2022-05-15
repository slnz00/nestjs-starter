require('dotenv').config()

const lodash = require('lodash')
const fs = require('fs')
const childProcess = require('./child-process')

const CONFIG_NAME = process.env.CONFIG_NAME
const DEPLOYMENT_CONFIG_PATH = `config/encrypted/${CONFIG_NAME}.deployment.json`
const ENV_KEY = '__env__'

class Config {
  constructor() {
    this._configObject = null
    this._initPromise = null
  }

  /**
   * @private
   */
  async _initialize() {
    if (!CONFIG_NAME) {
      throw new Error('CONFIG_NAME environment variable is not defined')
    }
    if (!fs.existsSync(DEPLOYMENT_CONFIG_PATH)) {
      throw new Error(`Deployment config does not exist under path: ${DEPLOYMENT_CONFIG_PATH}`)
    }

    // Decrypt config
    await childProcess.exec(`./dev/config/decrypt ${CONFIG_NAME}`)

    // Load decrypted config json
    const configJson = fs.readFileSync(DEPLOYMENT_CONFIG_PATH, 'utf-8')
    this._configObject = JSON.parse(configJson)
  }

  /**
   * @param {string} property
   * @param {*} [defaultValue]
   * @returns {Promise<*>}
   */
  async get(property, defaultValue) {
    if (!this._initPromise) {
      this._initPromise = this._initialize()
    }
    await this._initPromise

    let value = lodash.get(this._configObject, property)
    if (value === undefined && defaultValue === undefined) {
      throw new Error(`Config property "${property}" is not defined`)
    }

    const isEnvVar = value && typeof value === 'object' && value[ENV_KEY] && value[ENV_KEY] === 'string'
    if (isEnvVar) {
      value = this._parseEnvVar(property, value[ENV_KEY])
    }

    return value !== undefined ? value : defaultValue
  }

  /**
   * @param {string} property
   * @param {string} envVarName
   * @returns {*}
   * @private
   */
  _parseEnvVar(property, envVarName) {
    const value = process.env[envVarName]
    if (value === undefined) {
      throw new Error(`Failed to get config property "${property}" from environment variable "${envVarName}"`)
    }

    try {
      return JSON.parse(value)
    } catch (_err) {
      return value
    }
  }
}

module.exports = new Config()

import { Logger } from '@nestjs/common'
import Singleton, { SINGLETON_REFERENCE_ID_SYMBOL } from './singleton'
import SingletonInitRef from './singleton.initref'

export default class SingletonInitializer {
  // singleton reference id => initialization reference
  private initializationRefs: Map<string, SingletonInitRef> = new Map()
  private logger: Logger = new Logger(SingletonInitializer.name)

  async waitForInitializations(): Promise<void> {
    const refs = Array.from(this.initializationRefs.values())
    const results = await Promise.all(refs.map(ref => ref.waitForInitialization()))

    const errorResult = results.find(result => !!result.error)
    if (errorResult) {
      this.logger.error('Singleton service initialization failed')
      throw errorResult.error
    }
  }

  startInitialization(instance: Singleton, init?: () => any, deps: Singleton[] = []): void {
    const ref = this._getOrRegisterInitializationRef(instance)
    if (ref.initializationStarted) {
      throw new Error(`[${instance.constructor.name}]: Initialization process started multiple times`)
    }

    const dependencyRefs = deps.map(dep => this._getOrRegisterInitializationRef(dep))

    this._checkForCircularDependencies(instance, deps)

    ref.startInitialization(init, dependencyRefs).catch(err => {
      this.logger.error(`[${instance.constructor.name}] Unhandled error during singleton initialization: ${err}`)
    })
  }

  private _getOrRegisterInitializationRef(instance: Singleton): SingletonInitRef {
    const existingRef = this._getInitializationRef(instance)
    if (existingRef) {
      return existingRef
    }

    const refId = instance[SINGLETON_REFERENCE_ID_SYMBOL]
    const ref = new SingletonInitRef(refId, instance)
    this.initializationRefs.set(refId, ref)

    return ref
  }

  private _getInitializationRef(instanceOrId: Singleton | string): SingletonInitRef | null {
    const isId = typeof instanceOrId === 'string'
    const refId = isId ? instanceOrId : instanceOrId[SINGLETON_REFERENCE_ID_SYMBOL]

    return this.initializationRefs.get(refId) || null
  }

  private _getInitializationRefOrFail(instanceOrId: Singleton | string): SingletonInitRef {
    const ref = this._getInitializationRef(instanceOrId)
    if (!ref) {
      const isId = typeof instanceOrId === 'string'
      const instanceName = isId ? `Ref: ${instanceOrId}` : instanceOrId.constructor.name
      throw new Error(`[${instanceName}] Initialization failed, singleton does not have an initialization reference`)
    }

    return ref
  }

  private _checkForCircularDependencies(instance: Singleton, deps: Singleton[]): void {
    const ref = this._getInitializationRefOrFail(instance)

    const circularDependency = deps.find(dep => {
      const depRef = this._getInitializationRef(dep)
      return !!depRef && depRef.isDependency(ref)
    })

    if (circularDependency) {
      const instanceName = instance.constructor.name
      const dependencyName = circularDependency.constructor.name
      throw new Error(
        `[${instanceName}] Circular dependency found during singleton service initialization: ${instanceName} - ${dependencyName}`
      )
    }
  }
}

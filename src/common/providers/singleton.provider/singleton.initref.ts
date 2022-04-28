import Singleton from './singleton'
import AsyncUtils, { DeferredPromise } from 'common/utils/async.utils'

export enum InitializationResultType {
  // Initialization is skipped when one of the dependency initializations fail (DependencyResult.success is false)
  SKIPPED = 'SKIPPED',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR',
}

export interface DependencyResult {
  success: boolean
}

export interface InitializationResult {
  result: InitializationResultType
  error?: any
}

export default class SingletonInitRef {
  static readonly INITIALIZATION_TIMEOUT = 15000

  private readonly _id: string
  private readonly _instance: Singleton
  private _initializationStarted: boolean

  private _dependencyRefs: SingletonInitRef[]
  private _dependencyInitPromise?: Promise<DependencyResult>
  private _deferredResult: DeferredPromise<InitializationResult>

  constructor(id: string, instance: Singleton) {
    this._id = id
    this._instance = instance
    this._initializationStarted = false

    this._dependencyRefs = []
    this._deferredResult = AsyncUtils.createDeferredPromise()

    this._setupTimeoutTimer()
  }

  get id(): string {
    return this._id
  }

  get instance(): Singleton {
    return this._instance
  }

  get initializationStarted(): boolean {
    return this._initializationStarted
  }

  async waitForDependencyInitializations(): Promise<DependencyResult> {
    if (!this._dependencyInitPromise) {
      throw new Error(
        `[${this.instance.constructor.name}] Failed to wait for dependency initializations, dependencies are not set`
      )
    }

    return this._dependencyInitPromise
  }

  async waitForInitialization(): Promise<InitializationResult> {
    return this._deferredResult.promise
  }

  isDependency(ref: SingletonInitRef): boolean {
    return this._dependencyRefs.some(depRef => depRef.id === ref.id)
  }

  async startInitialization(init?: () => any, dependencyRefs: SingletonInitRef[] = []): Promise<void> {
    if (this._initializationStarted) {
      return
    }

    try {
      this._setDependencies(dependencyRefs)
      this._initializationStarted = true

      const asyncInit = async (): Promise<any> => init?.()

      const dependencyResult = await this.waitForDependencyInitializations()

      if (dependencyResult?.success) {
        await asyncInit()
        this.resolveInitialization(InitializationResultType.FINISHED)
      } else {
        this.resolveInitialization(InitializationResultType.SKIPPED)
      }
    } catch (error) {
      this.rejectInitialization(error)
    }
  }

  resolveInitialization(result: InitializationResultType): void {
    this._deferredResult.resolve({ result })
  }

  rejectInitialization(error: any): void {
    this._deferredResult.resolve({
      result: InitializationResultType.ERROR,
      error,
    })
  }

  private _setDependencies(dependencyRefs: SingletonInitRef[]): void {
    if (this._dependencyInitPromise) {
      throw new Error(`[${this.instance.constructor.name}] Singleton dependencies are already set`)
    }

    this._dependencyRefs = dependencyRefs
    this._dependencyInitPromise = this._createDependencyInitPromise()
  }

  private _createDependencyInitPromise(): Promise<DependencyResult> {
    const dependencyInitPromises = this._dependencyRefs.map(ref => ref.waitForInitialization())

    return Promise.all(dependencyInitPromises).then(depResults => {
      const success = depResults.every(result => !result.error)

      return {
        success,
      }
    })
  }

  private _setupTimeoutTimer(): void {
    const { INITIALIZATION_TIMEOUT } = SingletonInitRef

    const instanceName = this.instance.constructor.name
    const timeoutMessage = `[${instanceName}] Initialization timed out, make sure singleton services are initialized using the 'useInitialization' method`
    const timeoutResult = {
      error: new Error(timeoutMessage),
      result: InitializationResultType.ERROR,
    }

    setTimeout(() => this._deferredResult.resolve(timeoutResult), INITIALIZATION_TIMEOUT)
  }
}

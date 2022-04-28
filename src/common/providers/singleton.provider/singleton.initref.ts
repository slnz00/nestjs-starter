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

  private dependencyRefs: SingletonInitRef[]
  private dependencyInitPromise?: Promise<DependencyResult>
  private deferredResult: DeferredPromise<InitializationResult>

  constructor(id: string, instance: Singleton) {
    this._id = id
    this._instance = instance
    this._initializationStarted = false

    this.dependencyRefs = []
    this.deferredResult = AsyncUtils.createDeferredPromise()

    this.setupTimeoutTimer()
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
    if (!this.dependencyInitPromise) {
      throw new Error(
        `[${this.instance.constructor.name}] Failed to wait for dependency initializations, dependencies are not set`
      )
    }

    return this.dependencyInitPromise
  }

  async waitForInitialization(): Promise<InitializationResult> {
    return this.deferredResult.promise
  }

  isDependency(ref: SingletonInitRef): boolean {
    return this.dependencyRefs.some(depRef => depRef.id === ref.id)
  }

  async startInitialization(init?: () => any, dependencyRefs: SingletonInitRef[] = []): Promise<void> {
    if (this._initializationStarted) {
      return
    }

    try {
      this.setDependencies(dependencyRefs)
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
    this.deferredResult.resolve({ result })
  }

  rejectInitialization(error: any): void {
    this.deferredResult.resolve({
      result: InitializationResultType.ERROR,
      error,
    })
  }

  private setDependencies(dependencyRefs: SingletonInitRef[]): void {
    if (this.dependencyInitPromise) {
      throw new Error(`[${this.instance.constructor.name}] Singleton dependencies are already set`)
    }

    this.dependencyRefs = dependencyRefs
    this.dependencyInitPromise = this.createDependencyInitPromise()
  }

  private createDependencyInitPromise(): Promise<DependencyResult> {
    const dependencyInitPromises = this.dependencyRefs.map(ref => ref.waitForInitialization())

    return Promise.all(dependencyInitPromises).then(depResults => {
      const success = depResults.every(result => !result.error)

      return {
        success,
      }
    })
  }

  private setupTimeoutTimer(): void {
    const { INITIALIZATION_TIMEOUT } = SingletonInitRef

    const instanceName = this.instance.constructor.name
    const timeoutMessage = `[${instanceName}] Initialization timed out, make sure singleton services are initialized using the 'useInitialization' method`
    const timeoutResult = {
      error: new Error(timeoutMessage),
      result: InitializationResultType.ERROR,
    }

    setTimeout(() => this.deferredResult.resolve(timeoutResult), INITIALIZATION_TIMEOUT)
  }
}

import SingletonInitializer from 'common/providers/singleton.provider/singleton.initializer'

export const SINGLETON_REFERENCE_ID_SYMBOL = Symbol('singleton-reference-id')

export default class Singleton {
  private static idCounter: number = 0
  // eslint-disable-next-line @typescript-eslint/ban-types
  private static readonly instances: Map<Function, Singleton> = new Map()
  private static readonly initializer: SingletonInitializer = new SingletonInitializer();

  [SINGLETON_REFERENCE_ID_SYMBOL]: string

  constructor() {
    const instance = this.getInstance()
    if (instance) {
      return instance
    }

    this[SINGLETON_REFERENCE_ID_SYMBOL] = `${this.constructor.name}_${Singleton.idCounter++}`
    Singleton.instances.set(this.constructor, this)
  }

  static async waitForInitializations(): Promise<void> {
    const initializer = Singleton.initializer
    await initializer.waitForInitializations()
  }

  getInstance(): Singleton | null {
    return Singleton.instances.get(this.constructor) || null
  }

  useInitialization(init?: () => any, deps?: Singleton[]): void {
    const initializer = Singleton.initializer
    initializer.startInitialization(this, init, deps)
  }
}

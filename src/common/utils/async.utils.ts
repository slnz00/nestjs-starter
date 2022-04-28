export type DeferredPromise<T> = {
  promise: Promise<T>
  resolve: (result?: Promise<T> | T) => void
  reject: (error?: any) => void
}

export default class AsyncUtils {
  static createDeferredPromise<T>(): DeferredPromise<T> {
    const deferred: any = {
      promise: null,
      resolve: null,
      reject: null,
    }

    deferred.promise = new Promise((resolveDeferred, rejectDeferred) => {
      deferred.resolve = resolveDeferred
      deferred.reject = rejectDeferred
    })

    return deferred
  }

  static sleep(amountInMs: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, amountInMs))
  }
}

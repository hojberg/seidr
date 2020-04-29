import Result, { Err, Ok } from "./result";
import Monad from "./monad";

type MaybePromise<T> = T | PromiseLike<T>;

/**
 * A hybrid of a `Result` and a `Promise`, `AsyncResult` includes
 * the common convenience methods of working with a `Result` such
 * as `map`, `bimap` and `flatMap`, while representing possibly-
 * asynchronous state like a `Promise`.
 *
 * Aside from the convenience methods, `AsyncResult` also encodes
 * type information about its error variant, unlike a native
 * `Promise`, which may reject with `any` value.
 */
class AsyncResult<L, R> implements PromiseLike<Result<L, R>>, Monad<R> {
  private promise: Promise<Result<L, R>>;

  constructor(result: Result<L, R> | PromiseLike<Result<L, R>>) {
    this.promise = Promise.resolve(result);
  }

  // Implement `PromiseLike<Result<L, R>>`
  public then<TResult1 = Result<L, R>, TResult2 = never>(
    onfulfilled?:
      | ((value: Result<L, R>) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  // This isn't strictly compatible with `SumType`'s `caseOf`,
  // since it returns `Promise<T>` rather than just `T`, but
  // it's the conceptual async equivalent.
  public caseOf<T>(conditions: {
    Err: (err: L) => MaybePromise<T>;
    Ok: (value: R) => MaybePromise<T>;
  }): Promise<T> {
    return this.promise.then(result => result.caseOf(conditions));
  }

  // Implement `Functor<R>`
  public map<U>(f: (t: R) => MaybePromise<U>): AsyncResult<L, U> {
    return this.bimap(l => l, f);
  }

  public bimap<C, D>(
    leftF: (l: L) => MaybePromise<C>,
    rightF: (r: R) => MaybePromise<D>
  ): AsyncResult<C, D> {
    return new AsyncResult(
      this.caseOf({
        Err: async err => Err<C, D>(await leftF(err)),
        Ok: async value => Ok<C, D>(await rightF(value))
      })
    );
  }

  // Implement `Monad<R>`.
  // (This requires multiple signatures to convince TS that we're
  // successfully implementing Monad, even though the second signature
  // actually encompasses the first, since an AsyncResult is already
  // a PromiseLike<Result>)
  public flatMap<U, V>(
    f: (t: R) => AsyncResult<L | U, V>
  ): AsyncResult<L | U, V>;
  public flatMap<U, V>(
    f: (t: R) => MaybePromise<Result<L | U, V>>
  ): AsyncResult<L | U, V>;
  public flatMap<U, V>(
    f: (t: R) => MaybePromise<Result<L | U, V>>
  ): AsyncResult<L | U, V> {
    return new AsyncResult(
      this.caseOf({
        Err: error => Err(error),
        Ok: async value => f(value)
      })
    );
  }

  /**
   * The conceptual equivalent of `Result.fromNullable`. The key
   * difference is that promises _do_ carry error information, it's
   * just not reflected in their type. For that reason, where
   * `fromNullable` accepts an error value, `fromPromise` accepts a
   * function that's responsible for taking the `unknown` rejection
   * value from the promise and returning something typed.
   */
  public static fromPromise<L = never, R = never>(
    error: (rejection: unknown) => L,
    promise: PromiseLike<R>
  ): AsyncResult<L, R> {
    return new AsyncResult(
      promise.then(
        value => Ok(value),
        rejection => Err(error(rejection))
      )
    );
  }

  /**
   * The inverse of `fromPromise`. This converts an `Ok` value
   * to a resolved promise, and an `Err` value to a rejected one.
   *
   * Note that this erases any type information about the error
   * case, but is exactly isomorphic at runtime since the actual
   * error value is not lost.
   */
  public toPromise(): Promise<R> {
    return this.caseOf({
      Ok: value => value,
      Err: error => {
        throw error;
      }
    });
  }
}

function AsyncOk<L = never, R = never>(value: R): AsyncResult<L, R> {
  return new AsyncResult(Ok(value));
}

function AsyncErr<L = never, R = never>(err: L): AsyncResult<L, R> {
  return new AsyncResult(Err(err));
}

export default AsyncResult;
export { AsyncResult, AsyncOk, AsyncErr };

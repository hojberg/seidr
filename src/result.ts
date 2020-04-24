import SumType from 'sums-up';
import Monad from './monad';
import { Maybe, Nothing, Just } from './maybe';

class Result<L, R> extends SumType<{ Err: [L]; Ok: [R] }> implements Monad<R> {
  public static fromNullable<L, R>(error: L, x: R | undefined | null): Result<L, R> {
    return x ? Ok(x) : Err(error);
  }

  public map<U>(f: (t: R) => U): Result<L, U> {
    return this.caseOf({
      Err: (err: L) => Err(err),
      Ok: (data: R) => Ok(f(data)),
    });
  }

  /**
   * Map over both variants
   */
  public bimap<C, D>(leftF: (l: L) => C, rightF: (r: R) => D): Result<C, D> {
    return this.caseOf({
      Err: (err: L) => Err(leftF(err)),
      Ok: (data: R) => Ok(rightF(data)),
    });
  }

  public flatMap<U, V>(f: (t: R) => Result<L | U, V>): Result<L | U, V> {
    return this.caseOf({
      Err: (err: L) => Err(err),
      Ok: (data: R) => f(data),
    });
  }

  public toMaybe(): Maybe<R> {
    return this.caseOf({
      Err: (_: L) => Nothing(),
      Ok: Just,
    });
  }
}

/**
 * Constructor for the Err variant (left side) of Result
 */
function Err<L = never, R = never>(error: L): Result<L, R> {
  return new Result('Err', error);
}

/**
 * Constructor for the Ok variant (right side) of Result
 */
function Ok<L = never, R = never>(data: R): Result<L, R> {
  return new Result('Ok', data);
}

export default Result;
export { Result, Err, Ok };

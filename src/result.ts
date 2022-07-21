import SumType from "sums-up";
import Monad from "./monad";
import { Maybe, Nothing, Just } from "./maybe";

class Result<L, R> extends SumType<{ Err: [L]; Ok: [R] }> implements Monad<R> {
  public static fromNullable<L, R>(
    error: L,
    x: R | undefined | null
  ): Result<L, R> {
    return x == null || x == undefined ? Err(error) : Ok(x);
  }

  public static withDefault<T, U>(elseCase: T | U, m: Maybe<T>): T | U {
    return m.getOrElse(elseCase);
  }

  public map<U>(f: (t: R) => U): Result<L, U> {
    return this.caseOf({
      Err: (err) => Err(err),
      Ok: (data) => Ok(f(data)),
    });
  }

  public mapErr<K>(f: (e: L) => K): Result<K, R> {
    return this.caseOf({
      Err: (err) => Err(f(err)),
      Ok: (data) => Ok(data),
    });
  }

  public bimap<C, D>(leftF: (l: L) => C, rightF: (r: R) => D): Result<C, D> {
    return this.caseOf({
      Err: (err) => Err(leftF(err)),
      Ok: (data) => Ok(rightF(data)),
    });
  }

  public flatMap<U, V>(f: (t: R) => Result<L | U, V>): Result<L | U, V> {
    return this.caseOf({
      Err: (err) => Err(err),
      Ok: (data) => f(data),
    });
  }

  public toMaybe(): Maybe<R> {
    return this.caseOf({
      Err: (_) => Nothing(),
      Ok: Just,
    });
  }

  public getOrElse<U>(elseCase: R | U): R | U {
    return this.caseOf({
      Err: (_) => elseCase,
      Ok: (data: R) => data,
    });
  }
}

/**
 * Constructor for the Err variant (left side) of Result
 */
function Err<L = never, R = never>(error: L): Result<L, R> {
  return new Result("Err", error);
}

/**
 * Constructor for the Ok variant (right side) of Result
 */
function Ok<L = never, R = never>(data: R): Result<L, R> {
  return new Result("Ok", data);
}

export default Result;
export { Result, Err, Ok };

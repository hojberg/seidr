import SumType from 'sums-up';
import Monad from './monad';
import { Maybe, Nothing, Just } from './maybe';

class Result<L, R> extends SumType<{ Err: [L]; Ok: [R] }> implements Monad<R> {
  map<U>(f: (t: R) => U): Result<L, U> {
    return this.caseOf({
      Err: (err: L) => Err<L, U>(err),
      Ok: (data: R) => Ok<L, U>(f(data)),
    });
  }

  flatMap<U>(f: (t: R) => Result<L, U>): Result<L, U> {
    return this.caseOf({
      Err: (err: L) => Err<L, U>(err),
      Ok: (data: R) => f(data),
    });
  }

  toMaybe(): Maybe<R> {
    return this.caseOf({
      Err: (err: L) => Nothing(),
      Ok: Just,
    });
  }
}

function Err<L, R>(error: L): Result<L, R> {
  return new Result<L, R>('Err', error);
}

function Ok<L, R>(data: R): Result<L, R> {
  return new Result<L, R>('Ok', data);
}

export default Result;
export { Result, Err, Ok };

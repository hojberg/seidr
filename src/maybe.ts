import SumType from 'sums-up';
import Monad from './monad';

class Maybe<T> extends SumType<{ Nothing: []; Just: [T] }> implements Monad<T> {
  public static of<T>(t: T): Maybe<T> {
    return Just(t);
  }

  public static fromNullable<T>(t: T | undefined | null): Maybe<T> {
    return t ? Just(t) : Nothing();
  }

  public map<U>(f: (t: T) => U): Maybe<U> {
    return this.caseOf({
      Nothing: () => Nothing(),
      Just: (data: T) => Just(f(data)),
    });
  }

  public flatMap<U>(f: (t: T) => Maybe<U>): Maybe<U> {
    return this.caseOf({
      Nothing: () => Nothing(),
      Just: (data: T) => f(data),
    });
  }

  public getOrElse(elseCase: T): T {
    return this.caseOf({
      Nothing: () => elseCase,
      Just: (data: T) => data,
    });
  }
}

function Nothing<T>(): Maybe<T> {
  return new Maybe<T>('Nothing');
}

function Just<T>(data: T): Maybe<T> {
  return new Maybe<T>('Just', data);
}

export default Maybe;
export { Maybe, Nothing, Just };

import SumType from 'sums-up';
import Monad from './monad';

class Maybe<T> extends SumType<{ Nothing: []; Just: [T] }> implements Monad<T> {
  static of<T>(t: T): Maybe<T> {
    return Just(t);
  }

  map<U>(f: (t: T) => U): Maybe<U> {
    return this.caseOf({
      Nothing: () => Nothing(),
      Just: (data: T) => Just(f(data)),
    });
  }

  flatMap<U>(f: (t: T) => Maybe<U>): Maybe<U> {
    return this.caseOf({
      Nothing: () => Nothing(),
      Just: (data: T) => f(data),
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

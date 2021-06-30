import SumType from "sums-up";
import Monad from "./monad";

class Maybe<T> extends SumType<{ Nothing: []; Just: [T] }> implements Monad<T> {
  public static of<T>(t: T): Maybe<T> {
    return Just(t);
  }

  public static fromNullable<T>(t: T | undefined | null): Maybe<T> {
    return t === null || t === undefined ? Nothing() : Just(t);
  }

  public static withDefault<T, U>(elseCase: T | U, m: Maybe<T>): T | U {
    return m.getOrElse(elseCase);
  }

  public map<U>(f: (t: T) => U): Maybe<U> {
    return this.caseOf({
      Nothing: () => Nothing(),
      Just: (data: T) => Just(f(data)),
    });
  }

  public and<U>(other: Maybe<U>): Maybe<[T, U]> {
    return this.flatMap(mine => other.map(other => [mine, other]));
  }

  public flatMap<U>(f: (t: T) => Maybe<U>): Maybe<U> {
    return this.caseOf({
      Nothing: () => Nothing(),
      Just: (data: T) => f(data),
    });
  }

  public getOrElse<U>(elseCase: T | U): T | U {
    return this.caseOf({
      Nothing: () => elseCase,
      Just: (data: T) => data,
    });
  }

  public orElse(f: () => Maybe<T>): Maybe<T> {
    return this.caseOf({
      Nothing: () => f(),
      Just: (_) => this,
    });
  }
}

function Nothing<T = never>(): Maybe<T> {
  return new Maybe<T>("Nothing");
}

function Just<T>(data: T): Maybe<T> {
  return new Maybe<T>("Just", data);
}

export default Maybe;
export { Maybe, Nothing, Just };

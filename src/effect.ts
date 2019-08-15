import SumType from 'sums-up';
import { Mapper } from './functor';
import { Monad } from './monad';

export type Thunk<T> = (...args: unknown[]) => T;

class Eff<T> extends SumType<{ Effect: [Thunk<T>] }> implements Monad<T> {
  public unsafePerform(): T {
    return this.caseOf({
      Effect: thunk => thunk(),
    });
  }

  public map<U>(mapper: Mapper<T, U>): Effect<U> {
    return this.caseOf({
      Effect: thunk => Effect(() => mapper(thunk()))
    });
  }

  public flatMap<U>(mapper: (t: T) => Effect<U>): Effect<U> {
    return this.caseOf({
      Effect: thunk => mapper(thunk())
    });
  }

}

export type Effect<T> = Eff<T>;

export function Effect<T>(thunk: Thunk<T>): Eff<T> {
  return new Eff('Effect', thunk);
}

export function unsafePerform<T>(eff: Effect<T>): T {
  return eff.unsafePerform();
}

const NONE = Effect(() => {});

export function none(): Effect<void> {
  return NONE;
}

export function of<T>(value: T): Effect<T> {
  return Effect(() => value);
}

export default Effect;

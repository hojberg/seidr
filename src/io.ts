import SumType from "sums-up";
import { Mapper } from "./functor";
import { Monad } from "./monad";

export type Thunk<T> = (...args: unknown[]) => T;

/* eslint-disable @typescript-eslint/class-name-casing */
class _IO<T> extends SumType<{ IO: [Thunk<T>] }> implements Monad<T> {
  public unsafePerform(): T {
    return this.caseOf({
      IO: (thunk) => thunk(),
    });
  }

  public map<U>(mapper: Mapper<T, U>): IO<U> {
    return this.caseOf({
      IO: (thunk) => IO(() => mapper(thunk())),
    });
  }

  public flatMap<U>(mapper: (t: T) => IO<U>): IO<U> {
    return this.caseOf({
      IO: (thunk) => mapper(thunk()),
    });
  }
}

export type IO<T> = _IO<T>;

export function IO<T>(thunk: Thunk<T>): IO<T> {
  return new _IO("IO", thunk);
}

export function unsafePerform<T>(io: IO<T>): T {
  return io.unsafePerform();
}

const NONE = IO(() => {});

export function none(): IO<void> {
  return NONE;
}

export function of<T>(value: T): IO<T> {
  return IO(() => value);
}

export default IO;

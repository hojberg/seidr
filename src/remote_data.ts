import SumType from "sums-up";
import Monad from "./monad";

type RemoteDataVariants<E, T> = {
  NotAsked: [];
  Loading: [];
  Failure: [E];
  Success: [T];
};

class RemoteData<E, T> extends SumType<RemoteDataVariants<E, T>>
  implements Monad<T> {
  public static of<E, T>(t: T): RemoteData<E, T> {
    return Success(t);
  }

  public map<U>(f: (t: T) => U): RemoteData<E, U> {
    return this.caseOf({
      NotAsked: () => NotAsked(),
      Loading: () => Loading(),
      Failure: e => Failure(e),
      Success: (data: T) => Success(f(data))
    });
  }

  public flatMap<U>(f: (t: T) => RemoteData<E, U>): RemoteData<E, U> {
    return this.caseOf({
      NotAsked: () => NotAsked(),
      Loading: () => Loading(),
      Failure: e => Failure(e),
      Success: (data: T) => f(data)
    });
  }
}

function NotAsked<E, T>(): RemoteData<E, T> {
  return new RemoteData<E, T>("NotAsked");
}

function Loading<E, T>(): RemoteData<E, T> {
  return new RemoteData<E, T>("Loading");
}

function Failure<E, T>(e: E): RemoteData<E, T> {
  return new RemoteData<E, T>("Failure", e);
}

function Success<E, T>(data: T): RemoteData<E, T> {
  return new RemoteData<E, T>("Success", data);
}

export default RemoteData;
export { RemoteData, NotAsked, Loading, Failure, Success };

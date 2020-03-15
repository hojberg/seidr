import SumType from "sums-up";
import Monad from "./monad";

type RemoteDataVariants<T> = {
  NotAsked: [];
  Loading: [];
  Failure: [Error];
  Success: [T];
};

class RemoteData<T> extends SumType<RemoteDataVariants<T>> implements Monad<T> {
  public static of<T>(t: T): RemoteData<T> {
    return Success(t);
  }

  public map<U>(f: (t: T) => U): RemoteData<U> {
    return this.caseOf({
      NotAsked: () => NotAsked(),
      Loading: () => Loading(),
      Failure: e => Failure(e),
      Success: (data: T) => Success(f(data))
    });
  }

  public flatMap<U>(f: (t: T) => RemoteData<U>): RemoteData<U> {
    return this.caseOf({
      NotAsked: () => NotAsked(),
      Loading: () => Loading(),
      Failure: e => Failure(e),
      Success: (data: T) => f(data)
    });
  }
}

function NotAsked<T>(): RemoteData<T> {
  return new RemoteData<T>("NotAsked");
}

function Loading<T>(): RemoteData<T> {
  return new RemoteData<T>("Loading");
}

function Failure<T>(e: Error): RemoteData<T> {
  return new RemoteData<T>("Failure", e);
}

function Success<T>(data: T): RemoteData<T> {
  return new RemoteData<T>("Success", data);
}

export default RemoteData;
export { RemoteData, NotAsked, Loading, Failure, Success };

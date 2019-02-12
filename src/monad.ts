import Applicative from './applicative';

type FlatMapper<T, U> = (t: T) => Monad<U>;

interface Monad<T> extends Applicative<T> {
  flatMap<U>(f: FlatMapper<T, U>): Monad<U>;
}

export default Monad;
export { Monad, FlatMapper };

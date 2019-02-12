type Mapper<T, U> = (t: T) => U;

interface Functor<T> {
  map<U>(f: Mapper<T, U>): Functor<U>;
}

export default Functor;
export { Functor, Mapper };

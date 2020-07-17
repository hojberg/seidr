import SumType from "sums-up";
import Functor from "./functor";

class List<A>
  extends SumType<{
    Nil: [];
    Cons: [A, List<A>];
  }>
  implements Functor<A> {
  static empty() {
    return Nil();
  }

  static fromArray<A>(as: Array<A>): List<A> {
    return as.reduce(
      (acc, a) => acc.concat(Cons(a, Nil())),
      List.empty() as List<A>
    );
  }

  public map<B>(f: (a: A) => B): List<B> {
    return this.caseOf({
      Nil: () => Nil(),
      Cons: (head, tail) => Cons(f(head), tail.map(f)),
    });
  }

  public reduce<B>(f: (b: B, A: A) => B, acc: B): B {
    return this.caseOf({
      Nil: () => acc,
      Cons: (head, tail) => tail.reduce(f, f(acc, head)),
    });
  }

  public concat(that: List<A>): List<A> {
    return this.caseOf({
      Nil: () => that,
      Cons: (head, tail) => Cons(head, tail.concat(that)),
    });
  }

  public get length(): number {
    return this.caseOf({
      Nil: () => 0,
      Cons: (_a, as) => 1 + as.length,
    });
  }

  public toArray(): Array<A> {
    return this.caseOf({
      Nil: () => [],
      Cons: (head, tail) => [head].concat(tail.toArray()),
    });
  }
}

function Nil<A>(): List<A> {
  return new List("Nil");
}

function Cons<A>(a: A, list: List<A>): List<A> {
  return new List("Cons", a, list);
}

export default List;
export { List, Nil, Cons };

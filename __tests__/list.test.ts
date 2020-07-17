import { List, Nil, Cons } from "../src/list";

describe("List", () => {
  describe("fromArray", () => {
    expect(List.fromArray(["foo", "bar", "baz"])).toEqual(
      Cons("foo", Cons("bar", Cons("baz", Nil())))
    );
  });

  describe("toArray", () => {
    expect(Cons("foo", Cons("bar", Cons("baz", Nil()))).toArray()).toEqual([
      "foo",
      "bar",
      "baz",
    ]);
  });

  describe("length", () => {
    it("returns the length of the list", () => {
      expect(Cons("foo", Cons("bar", Cons("baz", Nil()))).length).toEqual(3);
    });
  });

  describe("concat", () => {
    it("combines 2 lists", () => {
      const a = Cons("foo", Cons("bar", Cons("baz", Nil())));
      const b = Cons("bee", Nil());

      expect(a.concat(b)).toEqual(
        Cons("foo", Cons("bar", Cons("baz", Cons("bee", Nil()))))
      );
    });
  });

  describe("map", () => {
    it("runs a function on each element", () => {
      const l = Cons(1, Cons(2, Cons(3, Nil())));
      expect(l.map((x) => x * 2)).toEqual(Cons(2, Cons(4, Cons(6, Nil()))));
    });
  });

  describe("reduce", () => {
    it("reduces the list to a single value", () => {
      const l = Cons(1, Cons(2, Cons(3, Nil())));
      expect(l.reduce((acc, x) => acc + x, 0)).toEqual(6);
    });
  });
});

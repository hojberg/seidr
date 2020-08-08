import { Maybe, Just, Nothing } from "../src/maybe";

describe("Maybe", () => {
  describe("Nothing", () => {
    describe("map", () => {
      test("it disregards the mapper and returns a Nothing", () => {
        expect(Nothing<number>().map((x: number) => x + 2)).toEqual(Nothing());
      });
    });

    describe("flatMap", () => {
      describe("with a mapper that returns Nothing", () => {
        test("it disregards the mapper and returns a Nothing", () => {
          expect(Nothing<number>().flatMap((_: number) => Nothing())).toEqual(
            Nothing()
          );
        });
      });

      describe("with a mapper that returns Just", () => {
        test("it disregards the mapper and returns a Nothing", () => {
          expect(Nothing<number>().flatMap((_: number) => Just(2))).toEqual(
            Nothing()
          );
        });
      });
    });

    describe("filter", () => {
      describe("with a Nothing", () => {
        test("it returns Nothing", () => {
          expect(Nothing<number>().filter((_) => true)).toEqual(Nothing());
        });
      });

      describe("with a Just", () => {
        describe("when the predicate is TRUE", () => {
          test("it returns the Just", () => {
            expect(Just<number>(6).filter((n) => n === 6)).toEqual(Just(6));
          });
        });
        describe("when the predicate is FALSE", () => {
          test("it returns a Nothing", () => {
            expect(Just<number>(6).filter((n) => n === 5)).toEqual(Nothing());
          });
        });
      });
    });

    describe("getOrElse", () => {
      test("it returns the fallback value", () => {
        expect(Nothing().getOrElse(0)).toEqual(0);
      });
    });

    describe("orElse", () => {
      test("it calls the function returning the value", () => {
        expect(Nothing<number>().orElse(() => Just(3))).toEqual(Just(3));
      });
    });
  });

  describe("Just", () => {
    describe("map", () => {
      test("it runs the mapper and re-wraps in a Just", () => {
        expect(Just(3).map((x: number) => x + 2)).toEqual(Just(5));
      });
    });

    describe("flatMap", () => {
      describe("with a mapper that returns Nothing", () => {
        test("it returns a Nothing", () => {
          expect(Just(3).flatMap((_: number) => Nothing())).toEqual(Nothing());
        });
      });

      describe("with a mapper that returns Just", () => {
        test("it returns the Just from the mapper", () => {
          expect(Just(3).flatMap((_: number) => Just(16))).toEqual(Just(16));
        });
      });

      describe("with a mapper that might return Just or Nothing", () => {
        test("it infers the correct new type value for `T`", () => {
          // This is more a test of type inference than runtime behavior
          expect(
            Just(3)
              .flatMap((_) => (Math.random() > 0.5 ? Just("hello") : Nothing()))
              .map((value) => value.length)
          ).toBeTruthy();
        });
      });
    });

    describe("getOrElse", () => {
      test("it returns the value", () => {
        expect(Just(3).getOrElse(0)).toEqual(3);
      });
    });

    describe("orElse", () => {
      test("it disregards the function and returns itself", () => {
        expect(Just(3).orElse(() => Just(564))).toEqual(Just(3));
      });
    });
  });

  describe("fromNullable", () => {
    describe("when passed a null or undefined value", () => {
      test("it returns a Nothing", () => {
        expect(Maybe.fromNullable(undefined)).toEqual(Nothing());
        expect(Maybe.fromNullable(null)).toEqual(Nothing());
      });
    });

    describe("when passed a valid value", () => {
      test("it returns a Just", () => {
        expect(Maybe.fromNullable("")).toEqual(Just(""));
        expect(Maybe.fromNullable("Test")).toEqual(Just("Test"));
        expect(Maybe.fromNullable(123)).toEqual(Just(123));
        expect(Maybe.fromNullable(0)).toEqual(Just(0));
        expect(Maybe.fromNullable(false)).toEqual(Just(false));
      });
    });
  });
});

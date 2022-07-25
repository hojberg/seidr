import { Result, Ok, Err } from "../src/result";
import { Nothing, Just } from "../src/maybe";

describe("Result", () => {
  describe("Err", () => {
    describe("map", () => {
      test("it disregards the mapper and returns a Err", () => {
        expect(Err<Error, number>(new Error("oops")).map((x) => x + 2)).toEqual(
          Err(new Error("oops"))
        );
      });
    });

    describe("mapErr", () => {
      test("it maps Err", () => {
        expect(
          Err<Error, number>(new Error("oops")).mapErr((e) => e.message)
        ).toEqual(Err("oops"));
      });
    });

    describe("flatMap", () => {
      describe("with a mapper that returns Err", () => {
        test("it disregards the mapper and returns a Err", () => {
          expect(
            Err<Error, number>(new Error("oops")).flatMap((_) =>
              Err(new Error(":("))
            )
          ).toEqual(Err(new Error("oops")));
        });
      });

      describe("with a mapper that returns Ok", () => {
        test("it disregards the mapper and returns a Err", () => {
          expect(Err(new Error("oops")).flatMap((_) => Ok(2))).toEqual(
            Err(new Error("oops"))
          );
        });
      });
    });

    describe("toMaybe", () => {
      test("it returns a Nothing", () => {
        expect(Err(new Error("oops")).toMaybe()).toEqual(Nothing());
      });
    });

    describe("getOrElse", () => {
      test("it returns the fallback value", () => {
        expect(Err("nope").getOrElse(0)).toEqual(0);
      });
    });
  });

  describe("Ok", () => {
    describe("map", () => {
      test("it runs the mapper and re-wraps in a Ok", () => {
        expect(Ok(3).map((x: number) => x + 2)).toEqual(Ok(5));
      });
    });

    describe("mapErr", () => {
      test("it disregards the mapper and returns Ok", () => {
        expect(Ok<Error, number>(3).mapErr((e) => e.message)).toEqual(Ok(3));
      });
    });

    describe("flatMap", () => {
      describe("with a mapper that returns Err", () => {
        test("it returns a Err", () => {
          expect(Ok(3).flatMap((_) => Err(new Error("oops")))).toEqual(
            Err(new Error("oops"))
          );
        });
      });

      describe("with a mapper that returns Ok", () => {
        test("it returns the Ok from the mapper", () => {
          expect(Ok(3).flatMap((_) => Ok(16))).toEqual(Ok(16));
        });
      });

      describe("with a mapper that might return Ok or Err", () => {
        test("it infers the correct new type value for `R`", () => {
          // This is more a test of type inference than runtime behavior
          expect(
            Ok(3)
              .flatMap((_) => (Math.random() > 0.5 ? Ok("hello") : Err(123)))
              .bimap(
                (shouldBeANumber) => shouldBeANumber.toFixed(),
                (shouldBeAString) => shouldBeAString.length
              )
          ).toBeTruthy();
        });
      });
    });

    describe("toMaybe", () => {
      test("it returns a Just of the Ok value", () => {
        expect(Ok(3).toMaybe()).toEqual(Just(3));
      });
    });

    describe("getOrElse", () => {
      test("it returns the value", () => {
        expect(Ok(3).getOrElse(0)).toEqual(3);
      });
    });
  });

  describe("fromNullable", () => {
    let err: Error;
    beforeEach(() => {
      err = new Error("unable to convert");
    });

    describe("when passed a null or undefined value", () => {
      test("it returns an Err", () => {
        expect(Result.fromNullable(err, undefined)).toEqual(Err(err));
        expect(Result.fromNullable(err, null)).toEqual(Err(err));
      });
    });

    describe("when passed a valid value", () => {
      test("it returns an Ok", () => {
        expect(Result.fromNullable(err, "Test")).toEqual(Ok("Test"));
        expect(Result.fromNullable(err, 123)).toEqual(Ok(123));
        expect(Result.fromNullable(err, 0)).toEqual(Ok(0));
      });
    });
  });
});

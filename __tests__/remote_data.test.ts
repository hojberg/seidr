import { NotAsked, Loading, Failure, Success } from "../src/remote_data";

describe("RemoteData", () => {
  describe("NotAsked", () => {
    describe("map", () => {
      test("it disregards the mapper and returns a NotAsked", () => {
        expect(NotAsked<Error, number>().map(x => x + 2)).toEqual(NotAsked());
      });
    });

    describe("flatMap", () => {
      describe("with a mapper that returns NotAsked", () => {
        test("it disregards the mapper and returns a NotAsked", () => {
          expect(NotAsked().flatMap(_ => NotAsked())).toEqual(NotAsked());
        });
      });

      describe("with a mapper that returns Success", () => {
        test("it disregards the mapper and returns a NotAsked", () => {
          expect(NotAsked().flatMap(_ => Success(2))).toEqual(NotAsked());
        });
      });
    });
  });

  describe("Loading", () => {
    describe("map", () => {
      test("it disregards the mapper and returns a Loading", () => {
        expect(Loading<Error, number>().map(x => x + 2)).toEqual(Loading());
      });
    });

    describe("flatMap", () => {
      describe("with a mapper that returns Loading", () => {
        test("it disregards the mapper and returns a Loading", () => {
          expect(Loading().flatMap(_ => Loading())).toEqual(Loading());
        });
      });

      describe("with a mapper that returns Success", () => {
        test("it disregards the mapper and returns a Loading", () => {
          expect(Loading().flatMap(_ => Success(2))).toEqual(Loading());
        });
      });
    });
  });

  describe("Failure", () => {
    describe("map", () => {
      test("it disregards the mapper and returns a Failure", () => {
        expect(
          Failure<Error, number>(new Error("oops")).map(x => x + 2)
        ).toEqual(Failure(new Error("oops")));
      });
    });

    describe("flatMap", () => {
      describe("with a mapper that returns Failure", () => {
        test("it disregards the mapper and returns a Failure", () => {
          expect(
            Failure(new Error("oops")).flatMap(_ => Failure(new Error(":(")))
          ).toEqual(Failure(new Error("oops")));
        });
      });

      describe("with a mapper that returns Success", () => {
        test("it disregards the mapper and returns a Failure", () => {
          expect(Failure(new Error("oops")).flatMap(_ => Success(2))).toEqual(
            Failure(new Error("oops"))
          );
        });
      });
    });
  });

  describe("Success", () => {
    describe("map", () => {
      test("it runs the mapper and re-wraps in a Success", () => {
        expect(Success(3).map(x => x + 2)).toEqual(Success(5));
      });
    });

    describe("flatMap", () => {
      describe("with a mapper that returns Failure", () => {
        test("it returns a Failure", () => {
          expect(
            Success<Error, number>(3).flatMap(_ => Failure(new Error("oops")))
          ).toEqual(Failure(new Error("oops")));
        });
      });

      describe("with a mapper that returns Success", () => {
        test("it returns the Success from the mapper", () => {
          expect(Success(3).flatMap(_ => Success(16))).toEqual(Success(16));
        });
      });
    });
  });
});

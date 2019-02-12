import { Result, Ok, Err } from '../src/result';
import { Nothing, Just } from '../src/maybe';

describe('Result', () => {
  describe('Err', () => {
    describe('map', () => {
      test('it disregards the mapper and returns a Err', () => {
        expect(
          Err<Error, number>(new Error('oops')).map((x: number) => x + 2)
        ).toEqual(Err(new Error('oops')));
      });
    });

    describe('flatMap', () => {
      describe('with a mapper that returns Err', () => {
        test('it disregards the mapper and returns a Err', () => {
          expect(
            Err<Error, number>(new Error('oops')).flatMap((x: number) =>
              Err(new Error(':('))
            )
          ).toEqual(Err(new Error('oops')));
        });
      });

      describe('with a mapper that returns Ok', () => {
        test('it disregards the mapper and returns a Err', () => {
          expect(
            Err<Error, number>(new Error('oops')).flatMap((x: number) => Ok(2))
          ).toEqual(Err(new Error('oops')));
        });
      });
    });

    describe('toMaybe', () => {
      test('it returns a Nothing', () => {
        expect(Err(new Error('oops')).toMaybe()).toEqual(Nothing());
      });
    });
  });

  describe('Ok', () => {
    describe('map', () => {
      test('it runs the mapper and re-wraps in a Ok', () => {
        expect(Ok<Error, number>(3).map((x: number) => x + 2)).toEqual(Ok(5));
      });
    });

    describe('flatMap', () => {
      describe('with a mapper that returns Err', () => {
        test('it returns a Err', () => {
          expect(
            Ok<Error, number>(3).flatMap((x: number) => Err(new Error('oops')))
          ).toEqual(Err(new Error('oops')));
        });
      });

      describe('with a mapper that returns Ok', () => {
        test('it returns the Ok from the mapper', () => {
          expect(Ok(3).flatMap((x: number) => Ok(16))).toEqual(Ok(16));
        });
      });
    });

    describe('toMaybe', () => {
      test('it returns a Just of the Ok value', () => {
        expect(Ok(3).toMaybe()).toEqual(Just(3));
      });
    });
  });
});

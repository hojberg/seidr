import { Ok, Err } from '../src/result';
import { AsyncResult, AsyncOk, AsyncErr } from '../src/async_result';

describe('AsyncResult', () => {
  describe('PromiseLike<Result>', () => {
    test('it acts as a promise for an equivalent synchronous result', async () => {
      expect(await AsyncOk('neat')).toEqual(Ok('neat'));
      expect(await AsyncErr('boom')).toEqual(Err('boom'));
    });
  });

  describe('fromPromise', () => {
    test('takes on the Ok value of a resolved promise', async () => {
      let result = AsyncResult.fromPromise(() => true, Promise.resolve('good'));
      expect(await result).toEqual(Ok('good'));
    });

    test('takes on the Err value of a rejected promise after getting type information from it', async () => {
      let result = AsyncResult.fromPromise(rejection => String(rejection), Promise.reject(123));
      expect(await result).toEqual(Err('123'));
    });
  });

  describe('toPromise', () => {
    test('returns a resolved promise for an Ok value', async () => {
      expect(await AsyncOk('good').toPromise()).toBe('good');
    });

    test('returns a rejected promise for an Err value', async () => {
      expect.assertions(1);

      try {
        await AsyncErr('boom').toPromise();
      } catch (error) {
        expect(error).toBe('boom');
      }
    });
  });

  describe('caseOf', () => {
    test('returns a promise for the result of the matching arm', async () => {
      let result = AsyncOk('neat').caseOf({
        Ok: value => value.length,
        Err: () => 0
      });

      expect(await result).toBe('neat'.length);
    });

    test('allows arms to themselves be async', async () => {
      let result = AsyncErr('boom').caseOf({
        Ok: () => false,
        Err: async () => true
      });

      expect(await result).toBe(true);
    });
  });

  describe('map', () => {
    test('it runs an Ok value through the mapper and returns a new AsyncResult', async () => {
      let result = AsyncOk('hello').map(async str => str.length);
      expect(await result).toEqual(Ok(5));
    });

    test('it skips the mapper for an Err value', async () => {
      let result = AsyncErr('oh no').map(() => true);
      expect(await result).toEqual(Err('oh no'));
    });
  });

  describe('bimap', () => {
    test('it runs an Ok value through the Ok mapper and returns a new AsyncResult', async () => {
      let result = AsyncOk('hello').bimap(
        () => false,
        async str => str.length
      );

      expect(await result).toEqual(Ok(5));
    });

    test('it runs an Err value through the Err mapper and returns a new AsyncResult', async () => {
      let result = AsyncErr([1, 2, 3]).bimap(
        async err => err.join(''),
        () => false
      );
      expect(await result).toEqual(Err('123'));
    });
  });

  describe('flatMap', () => {
    test('it skips the mapper for an Err value', async () => {
      let result = AsyncErr('hi').flatMap(() => Ok(123));
      expect(await result).toEqual(Err('hi'));
    });

    test('it returns Ok for a mapper that returns an Ok', async () => {
      let result = AsyncOk('hi').flatMap(str => Ok(str.length));
      expect(await result).toEqual(Ok(2));
    });

    test('it returns Err for a mapper that returns an Err', async () => {
      let result = AsyncOk('hi').flatMap(str => Err(str.length));
      expect(await result).toEqual(Err(2));
    });

    test('it returns Ok for a mapper that returns an Ok promise', async () => {
      let result = AsyncOk('hi').flatMap(async str => Ok(str.length));
      expect(await result).toEqual(Ok(2));
    });

    test('it returns Err for a mapper that returns an Err promise', async () => {
      let result = AsyncOk('hi').flatMap(async str => Err(str.length));
      expect(await result).toEqual(Err(2));
    });

    test('it returns Ok for a mapper that returns an Ok AsyncResult', async () => {
      let result = AsyncOk('hi').flatMap(str => AsyncOk(str.length));
      expect(await result).toEqual(Ok(2));
    });

    test('it returns Err for a mapper that returns an Err promise', async () => {
      let result = AsyncOk('hi').flatMap(str => AsyncErr(str.length));
      expect(await result).toEqual(Err(2));
    });
  });
});

import * as Effect from '../src/effect';

describe('Effect', () => {
  describe('#unsafePerform', () => {
    it('runs the thunk', () => {
      expect(Effect.Effect(() => 'thunk-value').unsafePerform()).toBe('thunk-value');
    });
  });

  describe('#map', () => {
    it('maps over the value', () => {
      expect(Effect.Effect(() => 'foo').map(x => x + 'bar').unsafePerform()).toBe('foobar');
    });
  });

  describe('#flatMap', () => {
    it('combines multiple effects', () => {
      expect(
        Effect.Effect(() => 'foo')
          .flatMap(f => 
            Effect.Effect(() => 'bar').map(b => `${f}${b}`)
          ).unsafePerform()
      ).toBe('foobar');
    });
  });

  describe('unsafePerform', () => {
    it('executes the effect', () => {
      const effect = Effect.Effect(() => 'thunk-value');
      expect(Effect.unsafePerform(effect)).toBe('thunk-value');
    });
  });

  describe('none', () => {
    it('returns an effect that does nothing', () => {
      expect(Effect.none().unsafePerform()).toBe(undefined);
    });
  });

  describe('of', () => {
    it('wraps a value in an effect', () => {
      expect(Effect.of('value').unsafePerform()).toBe('value');
    });
  });
});

# Seidr

> In Old Norse, seiðr was a type of sorcery practiced in Norse society during
> the Late Scandinavian Iron Age. The practice of seiðr is believed to be a form
> of magic relating to both the telling and shaping of the future.

A collection of general purpose Sum Types and monads built on top of [hojberg/sums-up](https://github.com/hojberg/sums-up)

## Maybe

```ts
import { Just, Nothing } from 'seidr';

Just("Loki").caseOf({
  Nothing: () => "N/A",
  Just: name => `Hello ${name}`,
}); // => "Hello Loki"

Nothing().caseOf({
  Nothing: () => "N/A",
  Just: name => `Hello ${name}`,
}); // => "N/A"

// Map doesn't run on Nothing
Just("Loki").map(name => name.toUpperCase()); // => Just("LOKI")
Nothing().map(name => name.toUpperCase()); // => Nothing()


// flatMap unnests a layer when the mapper returns a Maybe
Just("Loki").flatMap(name => Just(name.toUpperCase())); // => Just("LOKI")
Nothing().flatMap(name => Just(name.toUpperCase())); // => Nothing()
```

## Result

```ts
import { Ok, Err } from 'seidr';

Ok("Loki").caseOf({
  Err: err => err,
  Ok: name => `Hello ${name}`,
}); // => "Hello Loki"

Err("oops").caseOf({
  Err: err => err
  Just: (name) => `Hello ${name}`,
}); // => "oops"

// Map doesn't run on Err
Ok("Loki").map(name => name.toUpperCase()); // => Just("LOKI")
Err("oops").map(name => name.toUpperCase()); // => Err("oops")

// flatMap unnests a layer when the mapper returns a Result
Ok("Loki").flatMap(name => Ok(name.toUpperCase())); // => Ok("LOKI")
Err("oops").flatMap(name => Ok(name.toUpperCase())); // => Err("oops")

// Result and Maybe are not isomorphic as "oops" is lost when converting Err to Nothing
Ok("Loki").toMaybe(); // => Just("Loki")
Err("oops").toMaybe(); // => Nothing()
```

## AsyncResult

An `AsyncResult<L, R>` is a hybrid of a `Result<L, R>` and a `Promise<R>`,
with the type safety and convenience methods of the former, but the ability
to capture a not-necessarily-evaluated-yet value of the latter.

An `AsyncResult<L, R>` can be constructed from a `Promise<R>` with an
appropriate function to convert the promise's `unknown` error value to an `L`.

There are also `AsyncOk` and `AsyncErr` functions available as shorthand,
though in practice these are less frequently useful.

```ts
import { AsyncResult, AsyncOk, AsyncErr } from 'seidr';

////////////////////////////////////
// Constructing an AsyncResult

const myPromise: Promise<{ name: string }> = /* ... */;

AsyncResult.fromPromise(err => new Error(String(err)), myPromise);
// => AsyncResult<Error, { name: string }>


////////////////////////////////////
// Using an AsyncResult

// `caseOf` always returns a promise
AsyncOk("Loki").caseOf({
  Err: err => err,
  Ok: name => `Hello ${name}`,
}); // => Promise { <resolved>: "Hello Loki" }

AsyncErr("oops").caseOf({
  Err: err => err,
  Ok: (name) => `Hello ${name}`,
}); // => Promise { <resolved>: "oops" }

// `map` doesn't run on Err
AsyncOk("Loki").map(name => name.toUpperCase());  // => AsyncOk("LOKI")
AsyncErr("oops").map(name => name.toUpperCase()); // => AsyncErr("oops")

// `flatMap` unnests a layer when the mapper returns a Result, AsyncResult or Promise<Result>
AsyncOk("Loki").flatMap(name => Ok(name.toUpperCase()));       // => AsyncOk("LOKI")
AsyncOk("Loki").flatMap(name => AsyncOk(name.toUpperCase()));  // => AsyncOk("LOKI")
AsyncOk("Loki").flatMap(async name => Ok(name.toUpperCase())); // => AsyncOk("LOKI")
AsyncErr("oops").flatMap(name => Ok(name.toUpperCase()));      // => AsyncErr("oops")

// `toPromise` returns promise that resolves on Ok or rejects on Err
// A `Promise<R>` and an `AsyncResult<L, R>` are isomorphic at runtime,
// as the error value isn't lost; only the type information is.
AsyncOk("Loki").toPromise();  // Promise { <resolved>: "Loki" }
AsyncErr("oops").toPromise(); // Promise { <rejected>: "oops" }
```

## Effect

```ts
import { Effect } from 'seidr';

const fooEff = Effect(() => "foo") // Effect("foo")

fooEff.unsafePerform() // => 'foo'

// Map doesn't run on Err
fooEff.map(val => val.toUpperCase()); // => Effect("FOO")

// flatMap unnests a layer when the mapper returns an Effect
fooEffect.flatMap(val => Effect(() => val + 'bar'); // => Effect("foobar")
```

## RemoteData

A sums-up implementation of the original pattern described by Kris Jenkins:
http://blog.jenkster.com/2016/06/how-elm-slays-a-ui-antipattern.html

This is a helpful sum type for modelling data being fetched from the network.

```typescript
type RemoteData<E, A> = NotAsked | Loading | Failure<E> | Success<A>
```

```typescript
import { RemoteData, NotAsked, Loading, Failure, Success } from 'seidr';

NotAsked().caseOf({
  NotAsked: () => "not asked",
  _: () => "everything else",
}); // => "not asked"

Loading().caseOf({
  Loading: () => "loading",
  _: () => "everything else",
}); // => "loading"

Failure("oops").caseOf({
  Failure: err => err
  _: () => "everything else",
}); // => "oops"

Success("Yay").caseOf({
  Success: data => data
  _: () => "everything else",
}); // => "yay"

// Map only runs on Success
Succecss("Loki").map(name => name.toUpperCase()); // => Just("LOKI")
Failure("oops").map(name => name.toUpperCase()); // => Failure("oops")
Loading().map(name => name.toUpperCase()); // => Loading()
NotAsked().map(name => name.toUpperCase()); // => NotAsked()

// flatMap unnests a layer when the mapper returns a Result when run on Success
Succecss("Loki").map(name => Success(name.toUpperCase())); // => Just("LOKI")
Failure("oops").map(name => Success(name.toUpperCase())); // => Failure("oops")
Loading().map(name => Success(name.toUpperCase())); // => Loading()
NotAsked().map(name => Success(name.toUpperCase())); // => NotAsked()
```

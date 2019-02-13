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

// flatMap unnests a layer when the mapper returns a Maybe
Ok("Loki").flatMap(name => Ok(name.toUpperCase())); // => Ok("LOKI")
Err("oops").flatMap(name => Ok(name.toUpperCase())); // => Err("oops")

// Result and Maybe are not isomorphic as "oops" is lost when converting Err to Nothing
Ok("Loki").toMaybe(); // => Just("Loki")
Err("oops").toMaybe(); // => Nothing()
```

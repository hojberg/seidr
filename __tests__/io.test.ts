import * as IO from "../src/io";

describe("IO", () => {
  describe("#unsafePerform", () => {
    it("runs the thunk", () => {
      expect(IO.IO(() => "thunk-value").unsafePerform()).toBe("thunk-value");
    });
  });

  describe("#map", () => {
    it("maps over the value", () => {
      expect(
        IO.IO(() => "foo")
          .map((x) => x + "bar")
          .unsafePerform()
      ).toBe("foobar");
    });
  });

  describe("#flatMap", () => {
    it("combines multiple effects", () => {
      expect(
        IO.IO(() => "foo")
          .flatMap((f) => IO.IO(() => "bar").map((b) => `${f}${b}`))
          .unsafePerform()
      ).toBe("foobar");
    });
  });

  describe("unsafePerform", () => {
    it("executes the effect", () => {
      const io = IO.IO(() => "thunk-value");
      expect(IO.unsafePerform(io)).toBe("thunk-value");
    });
  });

  describe("none", () => {
    it("returns an effect that does nothing", () => {
      expect(IO.none().unsafePerform()).toBe(undefined);
    });
  });

  describe("of", () => {
    it("wraps a value in an effect", () => {
      expect(IO.of("value").unsafePerform()).toBe("value");
    });
  });
});

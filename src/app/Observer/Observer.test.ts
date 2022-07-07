import Observer from "./Observer";

const observer = new Observer();

describe("Test Observer", () => {
  describe("Test constructor of Observer", () => {
    test("Constructor properties are created", () => {
      expect(observer.listeners).toBeInstanceOf(Object);
      expect(observer.listeners).toBeDefined();
    });
  });

  describe("Test subscribe method", () => {
    const realBoolean = (data) => data.state;
    observer.subscribe("ReturnBoolean", realBoolean);

    const reverseBoolean = (data) => data.state;
    observer.subscribe("ReturnBoolean", reverseBoolean);

    test("Callback work correctly", () => {
      expect(observer.listeners.ReturnBoolean[0]).toBe(realBoolean);
      expect(observer.listeners.ReturnBoolean[0](false)).toBeFalsy();

      expect(observer.listeners.ReturnBoolean[1]).toBe(reverseBoolean);
    });
  });

  describe("Test broadcast method", () => {
    test("Listeners broadcast method", () => {
      let falseBoolean = false;
      let trueBoolean = true;

      const realBoolean = (data) => {
        falseBoolean = data.state;
      };

      observer.subscribe("ReturnBoolean", realBoolean);

      const reverseBoolean = (data) => {
        trueBoolean = data.state;
      };
      observer.subscribe("ReturnBoolean", reverseBoolean);

      observer.broadcast("ReturnBoolean", { state: true, name: "string" });

      expect(falseBoolean).toBeTruthy();
      expect(trueBoolean).toBeTruthy();
    });
  });
});

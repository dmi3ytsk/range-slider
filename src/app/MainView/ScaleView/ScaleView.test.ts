import ScaleView from "./ScaleView";

const testOptions = {
  width: 1000,
  max: 100,
  min: 0,
  step: 10,
  fromCurrentValue: 50,
  toCurrentValue: 80,
  isRange: false,
  showBar: true,
  showScale: true,
  showTip: true,
  isVertical: false,
};

let scaleView: ScaleView;
const subscribe = jest.spyOn(ScaleView.prototype, "subscribe");
const broadcast = jest.spyOn(ScaleView.prototype, "broadcast");
const init = jest.spyOn(ScaleView.prototype, "init");

describe("Track view", () => {
  beforeEach(() => {
    scaleView = new ScaleView(testOptions);
    subscribe.mockClear();
    init.mockClear();
    broadcast.mockClear();
  });

  describe("Initialization", () => {
    test("Call all necessary methods", () => {
      scaleView = new ScaleView(testOptions);
    });

    test("Set correct data", () => {
      expect(scaleView.options).toBeInstanceOf(Object);
      expect(scaleView.options).toEqual(testOptions);
    });

    test("Can accept all necessary data", () => {
      scaleView.sliderSize = 500;
      scaleView.init();
      expect(scaleView).toBeDefined();

      scaleView.options.isVertical = true;
      scaleView.init();
      expect(scaleView).toBeDefined();

      scaleView.options.min = 15500;
      scaleView.init();
      expect(scaleView).toBeDefined();
    });
  });

  describe("getScale method", () => {
    test("Set correct data", () => {
      const scale = scaleView.getScale();
      expect(scale).toBeInstanceOf(HTMLUListElement);
      expect(scale).toEqual(scaleView.scale);
    });
  });

  describe("reInitScale method", () => {
    test("Delete all li elements if !showScale", () => {
      scaleView.options.showScale = false;

      scaleView.reInitScale();
      expect(scaleView.scale.children.length).toEqual(0);
    });

    test("Update scale list if scale was init", () => {
      scaleView.init();
      scaleView.reInitScale();
      expect(scaleView.scale).toBeInstanceOf(HTMLUListElement);
    });
  });

  describe("reInitScale method", () => {
    test("Delete all li elements if !showScale", () => {
      scaleView.options.showScale = false;

      scaleView.reInitScale();
      expect(scaleView.scale.children.length).toEqual(0);
    });
  });

  describe("handleScaleClick method", () => {
    test("Delete all li elements if !showScale", () => {
      const newEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      scaleView.handleScaleElementClick(newEvent);
    });
  });
});

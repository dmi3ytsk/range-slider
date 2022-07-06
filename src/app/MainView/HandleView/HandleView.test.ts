/**
 * @jest-environment jsdom
 */

import HandleView from "./HandleView";

const testOptions = {
  currentValue: 50,
  isRange: false,
  showTip: true,
  isVertical: false,
  ratio: 0.5,
  step: 1,
};

let handleView: HandleView;
let node: HTMLElement;

const subscribe = jest.spyOn(HandleView.prototype, "subscribe");
const broadcast = jest.spyOn(HandleView.prototype, "broadcast");
const init = jest.spyOn(HandleView.prototype, "init");

describe("Track view", () => {
  beforeEach(() => {
    node = document.createElement("div") as HTMLElement;
    handleView = new HandleView(node, testOptions);
    subscribe.mockClear();
    init.mockClear();
    broadcast.mockClear();
  });

  describe("Initialization", () => {
    test("Call all necessary methods", () => {
      handleView = new HandleView(node, testOptions);

      expect(init).toBeCalledTimes(1);
    });

    test("Set correct data", () => {
      expect(handleView.node).toEqual(node);

      expect(handleView.options).toBeInstanceOf(Object);
      expect(handleView.options).toEqual(testOptions);
    });

    test("Change tip display if !showTip", () => {
      handleView.options.showTip = false;
      handleView.init();
      expect(
        handleView.tip.classList.contains("range-slider__tip_hide")
      ).toBeTruthy();
    });
  });

  describe("init method", () => {
    test("Create all elements", () => {
      handleView.init();

      expect(
        handleView.thumb.classList.contains("range-slider__thumb")
      ).toBeTruthy();
      expect(
        handleView.tip.classList.contains("range-slider__tip_hide")
      ).toBeTruthy();
      expect(
        handleView.handle.classList.contains("range-slider__handle")
      ).toBeTruthy();

      expect(handleView.handle.children.length).toEqual(2);
    });

    test("Call necessary methods", () => {
      const setPosition = jest.spyOn(HandleView.prototype, "setPosition");
      const createHandle = jest.spyOn(
        HandleView.prototype,
        "createHandleElements"
      );

      handleView.init();

      expect(setPosition).toBeCalled();
      expect(createHandle).toBeCalled();
    });
  });

  describe("createHandleElements method", () => {
    test("Create handle elements", () => {
      handleView.createHandleElements();

      expect(handleView.node.firstChild).toBeInstanceOf(HTMLDivElement);
      expect(handleView.node.firstChild).toEqual(handleView.handle);
    });
  });

  describe("setPosition method", () => {
    test("Set thumb and tip parameters", () => {
      handleView.sliderSize = 500;
      handleView.setPosition();

      expect(handleView.tip.innerText).toEqual(
        handleView.options.currentValue.toFixed().toString()
      );
      expect(parseInt(handleView.thumb.style.left, 0)).toBeGreaterThan(0);
      expect(parseInt(handleView.thumb.style.top, 0)).toBeNaN();

      handleView.options.isVertical = true;
      handleView.handleWindowMouseUp();
      handleView.setPosition();

      expect(handleView.tip.innerText).toEqual(
        handleView.options.currentValue.toFixed().toString()
      );
      expect(parseInt(handleView.thumb.style.top, 0)).toBeGreaterThan(0);
      expect(parseInt(handleView.thumb.style.left, 0)).toEqual(250);
    });
  });

  describe("getHandle", () => {
    test("Return handle", () => {
      const newHandle = handleView.getHandle();

      expect(newHandle).toBeInstanceOf(HTMLDivElement);
      expect(newHandle).toEqual(handleView.handle);
    });
  });

  describe("getRunner", () => {
    test("Return handle", () => {
      const newHandle = handleView.getHandle();

      expect(newHandle).toBeInstanceOf(HTMLDivElement);
      expect(newHandle).toEqual(handleView.handle);
    });
  });
});

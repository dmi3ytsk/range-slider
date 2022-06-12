import Model from "../../Model/Model";
import View from "./MainView";
import TrackView from "../TrackView/TrackView";
import ScaleView from "../ScaleView/ScaleView";

let root: HTMLElement;
let model: Model;
let view: View;

const broadcast = jest.spyOn(View.prototype, "broadcast");
const subscribe = jest.spyOn(View.prototype, "subscribe");
const setTrackOptions = jest.spyOn(View.prototype, "setTrackOptions");
const init = jest.spyOn(View.prototype, "init");
const updateSliderSize = jest.spyOn(View.prototype, "updateSliderSize");

describe("Main view", () => {
  beforeEach(() => {
    root = document.createElement("div") as HTMLElement;
    model = new Model();
    view = new View(root, model);
  });

  afterEach(() => {
    broadcast.mockClear();
    subscribe.mockClear();
    setTrackOptions.mockClear();
    init.mockClear();
    updateSliderSize.mockClear();
  });

  describe("Initialization", () => {
    test("Call all necessary methods", () => {
      expect(init).toBeCalledTimes(1);
      expect(setTrackOptions).toBeCalledTimes(1);
    });

    test("Set correct data", () => {
      expect(view.options).toEqual(model.data);
      expect(view.container).toBeInstanceOf(HTMLElement);
      expect(view.model).toEqual(model);
    });

    test("Add vertical class if isVertical", () => {
      view.options.isVertical = true;
      view.init();

      expect(view.container).toBeInstanceOf(HTMLElement);
      expect(view.model).toEqual(model);
      expect(view.slider.classList.contains("range-slider_vertical")).toBeTruthy();
    });
  });

  describe("init method", () => {
    beforeEach(() => {
      view.init();
    });

    test("Call all necessary methods", () => {
      expect(updateSliderSize).toBeCalled();
    });

    test("Append slider to container", () => {
      expect(view.container.firstChild).toEqual(view.slider);
    });

    test("Append to slider necessary elements", () => {
      expect(view.slider.children.length).toBe(2);
      expect(view.slider.children[1]).toBe(view.scale.getScale());
    });

    test("Create track&scale for View", () => {
      expect(view.track).not.toBeUndefined();
      expect(view.scale).not.toBeUndefined();

      expect(view.track).toBeInstanceOf(TrackView);
      expect(view.scale).toBeInstanceOf(ScaleView);
    });
  });

  describe("setTrackOptions method", () => {
    beforeEach(() => {
      view.setTrackOptions();
    });

    test("Write new data to trackOptions", () => {
      expect(view.trackOptions).not.toBeUndefined();
      expect(view.trackOptions).toBeInstanceOf(Object);
    });
  });

  describe("updateOrientation method", () => {
    test("Switch classes when isVertical changes", () => {
      view.options.isVertical = true;
      view.updateOrientation();

      expect(view.slider.classList.contains("range-slider_vertical")).toBeTruthy();

      view.options.isVertical = false;
      view.updateOrientation();

      expect(view.slider.classList.contains("range-slider_vertical")).toBeFalsy();
    });
  });

  describe("updateSliderSize method", () => {
    test("Update sliderSize when isVertical changes", () => {
      view.options.isVertical = true;
      view.updateSliderSize();

      expect(view.sliderSize).toBe(view.slider.offsetHeight);

      view.options.isVertical = false;
      view.updateSliderSize();

      expect(view.sliderSize).toBe(view.slider.offsetWidth);

      view.track.broadcast("dragHandle", { handleNumber: 1, ratio: 0.5 });
    });
  });
});

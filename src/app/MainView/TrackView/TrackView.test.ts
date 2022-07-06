import TrackView from "./TrackView";
import HandleView from "../HandleView/HandleView";

const testOptions = {
  fromCurrentValue: 50,
  toCurrentValue: 80,
  isRange: false,
  showBar: true,
  showScale: true,
  showTip: true,
  isVertical: false,
  ratios: { fromRatio: 0.5, toRatio: 0.8 },
  step: 1,
};

let trackView: TrackView;
const initTrackElements = jest.spyOn(TrackView.prototype, "initTrackElements");
const subscribe = jest.spyOn(HandleView.prototype, "subscribe");
const broadcast = jest.spyOn(HandleView.prototype, "broadcast");

describe("Track view", () => {
  beforeEach(() => {
    initTrackElements.mockClear();
    subscribe.mockClear();
    broadcast.mockClear();
    trackView = new TrackView(testOptions);
  });

  describe("Initialization", () => {
    test("Call all necessary methods", () => {
      expect(initTrackElements).toBeCalledTimes(1);
    });

    test("Set correct data", () => {
      expect(trackView.options).toEqual(testOptions);
    });
  });

  describe("initTrackElements method", () => {
    test("Create correct Runner number", () => {
      expect(trackView.handles).toBeInstanceOf(Array);

      expect(trackView.handles).toEqual(
        expect.arrayContaining([expect.any(HandleView)])
      );

      trackView.options.isRange = true;
      trackView.initTrackElements();

      expect(trackView.handles).toEqual(
        expect.arrayContaining([expect.any(HandleView), expect.any(HandleView)])
      );
    });

    test("Subscribe to handle events", () => {
      expect(subscribe).toBeCalled();
    });
  });

  describe("setElementsPosition method", () => {
    test("Switch bar styles", () => {
      trackView.setElementsPosition(testOptions);
      expect(trackView.bar.style.transform).toBeDefined();
    });
  });

  describe("updateBar method", () => {
    test("Update bar when state changes", () => {
      trackView.updateBar(false);
      expect(trackView.bar.style.display).toBe("none");

      trackView.updateBar(true);
      expect(trackView.bar.style.display).toBe("block");
    });
  });
});

import Observer from "../../Observer/Observer";
import HandleView from "../HandleView/HandleView";
import createElement from "../utils/createElement";
import { TrackOptions } from "../../interfaces/TrackOptions";

class TrackView extends Observer {
  track: HTMLElement;

  bar: HTMLElement;

  handles: HandleView[];

  constructor(public options: TrackOptions) {
    super();

    this.init();
  }

  private init() {
    this.createTrackElements();
    this.initTrackElements();
  }
  private initTrackElements() {
    this.track.innerHTML = "";
    const {
      isVertical,
      isRange,
      showBar,
      showTip,
      fromCurrentValue,
      toCurrentValue,
      ratios: { fromRatio, toRatio },
    } = this.options;

    if (isRange) {
      this.handles = [
        new HandleView(this.track, {
          isVertical,
          isRange,
          showTip,
          currentValue: fromCurrentValue,
          ratio: fromRatio,
        }),
        new HandleView(this.track, {
          isVertical,
          isRange,
          showTip,
          currentValue: toCurrentValue,
          ratio: toRatio,
        }),
      ];
    } else {
      this.handles = [
        new HandleView(this.track, {
          isVertical,
          isRange,
          showTip,
          currentValue: fromCurrentValue,
          ratio: fromRatio,
        }),
      ];
    }
  }
  private createTrackElements() {
    this.track = createElement("div", { className: "range-slider__track" });

    this.bar = createElement("div", { className: "range-slider__bar" });
  }

  public getTrack() {
    return this.track;
  }

  private fromHandleChangeListener = (ratio: number) => {
    this.broadcast("handleMoved", { handleNumber: 1, ratio });
  };
  private toHandleChangeListener = (ratio: number) => {
    this.broadcast("handleMoved", { handleNumber: 2, ratio });
  };
}

export default TrackView;

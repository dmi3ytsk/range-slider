import Observer from "../../Observer/Observer";
import HandleView from "../HandleView/HandleView";
import createElement from "../utils/createElement";
import { TrackOptions } from "../../interfaces/TrackOptions";

class TrackView extends Observer {
  track: HTMLElement;

  bar: HTMLElement;

  sliderSize: number;

  handles: HandleView[];

  constructor(public options: TrackOptions) {
    super();

    this.init();
  };

  public initTrackElements() {
    this.track.innerHTML = "";
    const {
      isVertical,
      isRange,
      showBar,
      showTip,
      fromCurrentValue,
      toCurrentValue,
      ratios: { fromRatio, toRatio },
      step,
    } = this.options;
    if (isRange) {
      this.handles = [
        new HandleView(this.track, {
          isVertical,
          isRange,
          showTip,
          currentValue: fromCurrentValue,
          ratio: fromRatio,
          step,
        }),
        new HandleView(this.track, {
          isVertical,
          isRange,
          showTip,
          currentValue: toCurrentValue,
          ratio: toRatio,
          step,
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
          step,
        }),
      ];
    }

    this.handles.forEach((handle, index) => {
      handle.updateSliderSize(this.sliderSize);

      if (index === 0) {
        handle.subscribe("dragHandle", this.fromHandleChangeListener);
      } else {
        handle.subscribe("dragHandle", this.toHandleChangeListener);
      }
    });
    this.updateBar(showBar);
  };

  public updateSliderSize(size: number) {
    this.sliderSize = size;
  };

  public updateOptions(options: TrackOptions) {
    this.options = options;
  };

  public updateBar(state: boolean) {
    if (state) {
      this.track.appendChild(this.bar);
      this.bar.style.display = "block";
    } else {
      this.bar.style.display = "none";
    }
  };

  public setElementsPosition(options: TrackOptions) {
    const {
      isVertical,
      showTip,
      fromCurrentValue,
      toCurrentValue,
      isRange,
      ratios: { fromRatio, toRatio },
      step,
    } = options;

    this.handles.forEach((handle, index) => {
      const newOptions =
        index === 0
          ? {
              isVertical,
              isRange,
              showTip,
              currentValue: fromCurrentValue,
              ratio: fromRatio,
              step: step,
            }
          : {
              isVertical,
              isRange,
              showTip,
              currentValue: toCurrentValue,
              ratio: toRatio,
              step: step,
            };
      handle.updateSliderSize(this.sliderSize);
      handle.updateOptions(newOptions);
    });
    if (isVertical) {
      this.bar.style.transform = `scaleY(${fromRatio})`;
    } else {
      this.bar.style.transform = `scaleX(${fromRatio})`;
    }

    if (isRange) {
      this.bar.style.transform = `translateX(${
        fromRatio * this.sliderSize
      }px) scaleX(${toRatio - fromRatio})`;

      if (isVertical) {
        this.bar.style.transform = `translateY(${
          fromRatio * -this.sliderSize
        }px) scaleY(${toRatio - fromRatio})`;
      }
    }
  };

  public getTrack() {
    return this.track;
  };

  private init() {
    this.createTrackElements();
    this.initTrackElements();
  };

  private createTrackElements() {
    this.track = createElement("div", { className: "range-slider__track" });

    this.bar = createElement("div", { className: "range-slider__bar" });
  };

  private fromHandleChangeListener = (ratio: number) => {
    this.broadcast("dragHandle", { handleNumber: 1, ratio });
  };

  private toHandleChangeListener = (ratio: number) => {
    this.broadcast("dragHandle", { handleNumber: 2, ratio });
  };
};

export default TrackView;

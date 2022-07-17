import Observer from "../../Observer/Observer";
import HandleView from "../HandleView/HandleView";
import createElement from "../utils/createElement";
import { TrackOptions } from "../../interfaces/TrackOptions";

class TrackView extends Observer {
  track!: HTMLElement;

  bar!: HTMLElement;

  sliderSize!: number;

  handles!: HandleView[];

  constructor(public options: TrackOptions) {
    super();
    this.init();
  }

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
      min,
      max,
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
          min,
          max,
        }),
        new HandleView(this.track, {
          isVertical,
          isRange,
          showTip,
          currentValue: toCurrentValue,
          ratio: toRatio,
          step,
          min,
          max,
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
          min,
          max,
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
  }

  public updateSliderSize(size: number) {
    this.sliderSize = size;
  }

  public updateOptions(options: TrackOptions) {
    this.options = options;
  }

  public updateBar(state: boolean) {
    if (state) {
      this.track.appendChild(this.bar);
      this.bar.style.display = "block";
    } else {
      this.bar.style.display = "none";
    }
  }

  public setElementsPosition(options: TrackOptions) {
    const {
      ratios: { fromRatio, toRatio },
    } = options;

    this.setOptionsForHandle(options);
    this.setHandleDesign(options);
    this.setBarDesign(options, fromRatio, toRatio);
  }

  private setHandleDesign(options: TrackOptions) {
    const {
      isVertical,
    } = options;
    const {
      fromOffset, toOffset, tipSize,
    } = this.handleDimensions(isVertical);

    this.handles.forEach((handle, index) => {
      if (toOffset - fromOffset < tipSize + 3 && !isVertical) {
        if (index === 0) {
          this.fromTipDesign(options, handle);
        } else {
          // hide toHandleTip when fromHandleTip is close
          handle.tip.style.opacity = "0";
        }
      } else if (fromOffset - toOffset < tipSize && isVertical) {
        if (index === 0) {
          this.fromTipDesign(options, handle, tipSize);
        } else {
          // hide toHandleTip when fromHandleTip is close
          handle.tip.style.opacity = "0";
        }
      } else if (index === 0 && isVertical) {
        // reset to default fromHandleTip style
        handle.tip.style.height = "1.5rem";
        handle.tip.style.marginTop = "0px";
        handle.tip.style.paddingBottom = "0px";
      } else {
        // reset opacity toHandleTip
        handle.tip.style.opacity = "1";
      }
    });
  }

  private handleDimensions(isVertical: boolean) {
    const dimensions = {
      fromOffset: 0,
      toOffset: 0,
      tipSize: 0,
    };
    this.handles.forEach((handle, index) => {
      if (index === 0) {
        dimensions.fromOffset = isVertical ? handle.tip.offsetTop : handle.tip.offsetLeft;
      } else {
        dimensions.toOffset = isVertical ? handle.tip.offsetTop : handle.tip.offsetLeft;
        dimensions.tipSize = isVertical ? handle.tip.offsetHeight : handle.tip.offsetWidth;
      }
    });
    return dimensions;
  }

  // eslint-disable-next-line class-methods-use-this
  private fromTipDesign(options: TrackOptions, handle: HandleView, tipSize?: number) {
    const {
      step, fromCurrentValue, toCurrentValue, min, max, isVertical,
    } = options;
    const propList: [number, number, number] = [step, min, max];
    const fractionalProp = propList.find((prop) => !Number.isInteger(Number(prop)));
    if (fractionalProp !== undefined) {
      const fromCorrectValue: string = fromCurrentValue.toFixed(
        (fractionalProp).toString().split("." || ",").pop()?.length,
      );
      const toCorrectValue: string = toCurrentValue.toFixed(
        (fractionalProp).toString().split("." || ",").pop()?.length,
      );
      this.singleTipStyle(handle, fromCorrectValue, toCorrectValue, tipSize, isVertical);
    } else {
      this.singleTipStyle(handle, fromCurrentValue, toCurrentValue, tipSize, isVertical);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private singleTipStyle(
    handle: HandleView,
    fromCurrentValue: number | string,
    toCurrentValue: number | string,
    tipSize?: number,
    isVertical?: boolean,
  ) {
    if (isVertical && tipSize !== undefined) {
      handle.tip.innerHTML = `${fromCurrentValue}<br>${toCurrentValue}`;
      handle.tip.style.height = "inherit";
      handle.tip.style.marginTop = handle.tip.offsetHeight > tipSize ? "-5px" : "0px";
      handle.tip.style.paddingBottom = "4px";
    } else {
      handle.tip.innerHTML = `from ${fromCurrentValue} to ${toCurrentValue}`;
      handle.tip.style.whiteSpace = "nowrap";
    }
  }

  private setOptionsForHandle(options: TrackOptions) {
    const {
      isVertical,
      showTip,
      fromCurrentValue,
      toCurrentValue,
      isRange,
      ratios: { fromRatio, toRatio },
      step,
      min,
      max,
    } = options;
    this.handles.forEach((handle, index) => {
      const newOptions = index === 0
        ? {
          isVertical,
          isRange,
          showTip,
          currentValue: fromCurrentValue,
          ratio: fromRatio,
          step,
          min,
          max,
        }
        : {
          isVertical,
          isRange,
          showTip,
          currentValue: toCurrentValue,
          ratio: toRatio,
          step,
          min,
          max,
        };
      handle.updateSliderSize(this.sliderSize);
      handle.updateOptions(newOptions);
    });
  }

  private setBarDesign(options: TrackOptions, fromRatio:number, toRatio:number) {
    const { isVertical, isRange } = options;
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
  }

  public getTrack() {
    return this.track;
  }

  private init() {
    this.createTrackElements();
    this.initTrackElements();
  }

  private createTrackElements() {
    this.track = createElement("div", { className: "range-slider__track" });

    this.bar = createElement("div", { className: "range-slider__bar" });
  }

  private fromHandleChangeListener = (ratio: number) => {
    this.broadcast("dragHandle", { handleNumber: 1, ratio });
  };

  private toHandleChangeListener = (ratio: number) => {
    this.broadcast("dragHandle", { handleNumber: 2, ratio });
  };
}

export default TrackView;

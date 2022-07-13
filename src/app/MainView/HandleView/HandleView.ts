import Observer from "../../Observer/Observer";
import createElement from "../utils/createElement";
import { HandleOptions } from "../../interfaces/HandleOptions";

class HandleView extends Observer {
  handle!: HTMLElement;

  tip!: HTMLElement;

  thumb!: HTMLElement;

  sliderSize!: number;

  positionOptions!: {
    clientX: number;
    clientY: number;
    offsetLeft: number;
    offsetTop: number;
    offsetHeight: number;
  };

  constructor(public node: HTMLElement, public options: HandleOptions) {
    super();
    this.init();
  }

  public getHandle() {
    return this.handle;
  }

  public updateOptions(options: HandleOptions) {
    this.options = options;
    this.setPosition();
  }

  public updateSliderSize(size: number) {
    this.sliderSize = size;
  }

  public init() {
    this.createHandleElements();
    this.setPosition();
    this.setDragListeners();
    this.setTouchDragListeners();
  }

  public createHandleElements() {
    const tipOn = this.options.showTip ? "" : "_hide";
    this.tip = createElement("div", {
      className: `range-slider__tip${tipOn}`,
    });
    this.thumb = createElement("div", {
      className: "range-slider__thumb",
    });
    this.handle = createElement(
      "div",
      { className: "range-slider__handle" },
      this.thumb,
      this.tip,
    );

    this.node.appendChild(this.handle);
  }

  public setPosition() {
    const { isVertical, currentValue, ratio } = this.options;
    const sliderLength = isVertical ? -this.sliderSize : this.sliderSize;
    const positionVertical = sliderLength * ratio + this.sliderSize;
    const positionHorizontal = sliderLength * ratio;
    const position = isVertical ? positionVertical : positionHorizontal;

    if (isVertical) {
      this.thumb.style.top = `${position - this.thumb.offsetHeight / 2}px`;
      this.tip.style.top = `${
        position - Math.ceil(this.tip.offsetHeight / 2)
      }px`;
    } else {
      this.thumb.style.left = `${position}px`;
      this.tip.style.left = `${position}px`;
    }
    if (!Number.isInteger(Number(this.options.step)) && currentValue) {
      this.tip.innerHTML = currentValue.toFixed(
        this.options.step
          .toString()
          .split("." || ",")
          .pop()?.length,
      );
    } else {
      this.tip.innerHTML = currentValue.toFixed().toString();
    }
  }

  private handleWindowMouseMove = (event: MouseEvent) => {
    const { isVertical } = this.options;
    const {
      clientX, clientY, offsetLeft, offsetTop, offsetHeight,
    } = this.positionOptions;

    const position = isVertical
      ? offsetTop + event.clientY - clientY + offsetHeight / 2
      : offsetLeft + event.clientX - clientX;

    const value = isVertical
      ? (this.sliderSize - position) / this.sliderSize
      : position / this.sliderSize;
    this.broadcast("dragHandle", value);
  };

  public handleWindowMouseUp = () => {
    window.removeEventListener("mousemove", this.handleWindowMouseMove);
    window.removeEventListener("mouseup", this.handleWindowMouseUp);
  };

  private setDragListeners() {
    this.handle.addEventListener("mousedown", this.handleRunnerMouseDown);
  }

  private handleRunnerMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    const { target } = event;
    if (target && target instanceof HTMLElement) {
      const { clientY, clientX } = event;
      const { offsetLeft, offsetTop, offsetHeight } = target;
      this.positionOptions = {
        clientY,
        clientX,
        offsetLeft,
        offsetTop,
        offsetHeight,
      };

      window.addEventListener("mousemove", this.handleWindowMouseMove);
      window.addEventListener("mouseup", this.handleWindowMouseUp);
    }
  };

  private handleWindowTouchMove = (event: TouchEvent) => {
    const { isVertical } = this.options;
    const {
      clientX, clientY, offsetLeft, offsetTop, offsetHeight,
    } = this.positionOptions;

    const position = isVertical
      ? offsetTop + event.touches[0].clientY - clientY + offsetHeight / 2
      : offsetLeft + event.touches[0].clientX - clientX;

    const value = isVertical
      ? (this.sliderSize - position) / this.sliderSize
      : position / this.sliderSize;
    this.broadcast("dragHandle", value);
  };

  private handleWindowTouchEnd = () => {
    document.removeEventListener("touchmove", this.handleWindowTouchMove);
  };

  private setTouchDragListeners() {
    this.handle.addEventListener("touchstart", this.handleRunnerTouchStart, { passive: false });
  }

  private handleRunnerTouchStart = (event: TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const { target } = event;
    if (target && target instanceof HTMLElement) {
      const { clientY, clientX } = event.touches[0];
      const { offsetLeft, offsetTop, offsetHeight } = target;
      this.positionOptions = {
        clientY,
        clientX,
        offsetLeft,
        offsetTop,
        offsetHeight,
      };

      document.addEventListener("touchmove", this.handleWindowTouchMove, { passive: false });
      document.addEventListener("touchend", this.handleWindowTouchEnd, { once: true });
    }
  };
}

export default HandleView;

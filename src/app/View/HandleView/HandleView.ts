import Observer from "../../Observer/Observer";
import createElement from "../utils/createElement";
import { HandleOptions } from "../../interfaces/HandleOptions";

class HandleView extends Observer {
  handle: HTMLElement;

  tip: HTMLElement;

  thumb: HTMLElement;

  sliderSize: number;

  positionOptions: {
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

  private init() {
    this.setDragListeners;
    this.createHandleElements();
    this.setPosition();
  }

  private createHandleElements() {
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
      this.tip
    );

    this.node.appendChild(this.handle);
  }

  private setPosition() {
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

    this.tip.innerText = currentValue.toFixed().toString();
  }

  private handleWindowMouseUp = () => {
    window.removeEventListener("mousemove", this.handleWindowMouseMove);
    window.removeEventListener("mouseup", this.handleWindowMouseUp);
  };

  private handleWindowMouseMove = (event: MouseEvent) => {
    const { isVertical } = this.options;
    const { clientX, clientY, offsetLeft, offsetTop, offsetHeight } =
      this.positionOptions;

    const position = isVertical
      ? offsetTop + event.clientY - clientY + offsetHeight / 2
      : offsetLeft + event.clientX - clientX;

    const value = isVertical
      ? (this.sliderSize - position) / this.sliderSize
      : position / this.sliderSize;

    this.broadcast("dragHandle", value);
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
}

export default HandleView;

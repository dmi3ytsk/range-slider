import Observer from "../../Observer/Observer";
import createElement from "../utils/createElement";
import { GlobalOptions } from "../../interfaces/GlobalOptions";

class ScaleView extends Observer {
  scale: HTMLElement;

  scaleElements: HTMLElement[];

  sliderSize: number;

  constructor(public options: GlobalOptions) {
    super();

    this.scaleElements = [];

    this.createScale();
  }

  public init() {
    this.createAllScaleValues();
    this.setClickListener();
  }

  public reInitScale() {
    this.scaleElements.forEach((element) => {
      element.remove();
    });

    if (this.options.showScale) {
      this.init();
    }
  }

  public getScale() {
    return this.scale;
  }

  public updateSliderSize(size: number) {
    this.sliderSize = size;
  }

  public updateOptions(options: GlobalOptions) {
    this.options = options;
  }

  public handleScaleElementClick = (event: MouseEvent) => {
    const { target } = event;

    if (target && target instanceof HTMLElement) {
      const newValue = Number(target.innerText);
      this.broadcastCorrectHandle(newValue);
    }
  };

  private broadcastCorrectHandle(newValue: number) {
    const { toCurrentValue, fromCurrentValue, isRange, min, max } =
      this.options;
    const proximityCondition =
      Math.abs(toCurrentValue - newValue) >
      Math.abs(fromCurrentValue - newValue);
    const ratio = (newValue - min) / (max - min);

    if (!isRange || proximityCondition) {
      this.broadcast("scaleClick", {
        handleNumber: 1,
        ratio,
      });
    } else {
      this.broadcast("scaleClick", {
        handleNumber: 2,
        ratio,
      });
    }
  }

  private createScale() {
    this.scale = createElement("ul", {
      className: `range-slider__scale`,
    });
  }

  private createAllScaleValues() {
    const { max, min } = this.options;
    const { quantity, scaleStep } = this.calculateNumbersQuantity();
    let value: number = 0;

    for (let i = 0; i <= quantity; i += 1) {
      let currentValue = min + value;
      let position = value;
      const li: HTMLElement = createElement("li", {
        className: "range-slider__scale-number",
      });

      value += scaleStep;

      if (currentValue > max) {
        currentValue = max;
        position = max - min;
      }

      li.innerHTML = Math.round(currentValue).toString();

      this.scaleElements.push(li);
      this.scale.append(li);

      this.setElementIndentation(position, quantity, li);
    }
  }

  private handleScaleClick = (event: MouseEvent) => {
    const { target } = event;

    if (
      target &&
      target instanceof HTMLElement &&
      target.classList.contains("range-slider__scale")
    ) {
      const { isVertical, min, max } = this.options;
      const { offsetY, offsetX } = event;

      const position = isVertical ? this.sliderSize - offsetY : offsetX;

      const ratio = position / this.sliderSize;
      const newValue = ratio * (max - min) + min;

      this.broadcastCorrectHandle(newValue);
    }
  };

  private calculateNumbersQuantity(): { quantity: number; scaleStep: number } {
    const { step, max, min, isVertical } = this.options;

    let quantity = 0;
    let liSize = 0;

    const rateOfVariation = max - min;

    while (liSize <= this.sliderSize) {
      quantity += 1;
      const currentValue = max;

      const li: HTMLElement = createElement("li", {
        className: "range-slider__scale-number",
      });

      li.innerHTML = Math.round(currentValue).toString();
      this.scale.append(li);

      liSize = isVertical
        ? (liSize += li.offsetHeight)
        : (liSize += li.offsetWidth + li.offsetHeight / 2);

      if (liSize === 0) {
        liSize = this.sliderSize + quantity;
      }

      li.remove();
    }

    const scaleStep = Math.ceil(rateOfVariation / quantity / step) * step;

    quantity = Math.ceil(rateOfVariation / scaleStep);

    return {
      quantity,
      scaleStep,
    };
  }

  private setElementIndentation(
    position: number,
    count: number,
    li: HTMLElement
  ) {
    const { isVertical, max, min } = this.options;
    const sliderSize = isVertical ? -this.sliderSize : this.sliderSize;
    let liSize: number;

    if (isVertical) {
      liSize = li.offsetHeight / 2;
      li.style.top = `${
        (-position / (max - min)) * -sliderSize - liSize - sliderSize
      }px`;
    } else {
      liSize = li.offsetWidth / 2;
      li.style.left = `${(position / (max - min)) * sliderSize - liSize}px`;
    }
  }
  private setClickListener() {
    this.scale.addEventListener("click", this.handleScaleClick);

    this.scaleElements.forEach((scaleElement) => {
      scaleElement.addEventListener("click", this.handleScaleElementClick);
    });
  }
}
export default ScaleView;

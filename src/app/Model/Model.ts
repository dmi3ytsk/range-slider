import Observer from "../Observer/Observer";
import defaultAttributes from "../const";
import { GlobalOptions } from "../interfaces/GlobalOptions";
import { Ratios } from "../interfaces/Ratios";
import {
  UpdateBooleanOptions,
  NumberOptions,
  UpdateNumberOptions,
} from "../interfaces/AttributesOptions";

class Model extends Observer {
  data: GlobalOptions;

  ratios!: Ratios;

  static defaultAttributes = defaultAttributes;

  constructor(options: GlobalOptions = Model.defaultAttributes) {
    super();
    this.data = options;
    this.calculateNewRatios();
  }

  public calculateNewRatios() {
    const {
      fromCurrentValue, toCurrentValue, min, max,
    } = this.data;

    this.ratios = {
      fromRatio: (fromCurrentValue - min) / (max - min),
      toRatio: (toCurrentValue - min) / (max - min),
    };

    this.broadcast("changeRatios", this.ratios);
  }

  public setBooleanOptions(newOptions: UpdateBooleanOptions) {
    const newData: Partial<GlobalOptions> = {};
    const { optionName, optionState } = newOptions;

    switch (optionName) {
      case "isRange":
      case "isVertical":
      case "showTip":
      case "showBar":
      case "showScale":
        newData[optionName] = optionState;
        break;
      default:
        throw new Error("Invalid value");
    }

    if (optionName === "showBar") {
      this.changeIntervalDependence();
    }

    this.changeData(newData);
    this.broadcast("updateBooleanOptions", newData);
  }

  public setNumberOptions(newOptions: UpdateNumberOptions) {
    const newData: Partial<GlobalOptions> = {};
    const { optionName, optionState } = newOptions;

    switch (optionName) {
      case "min":
      case "max":
      case "step":
        newData[optionName] = optionState;
        break;
      case "fromCurrentValue":
        this.setCurrentValues({
          fromCurrentValue: this.returnCorrectValue(optionState),
        });
        break;
      case "toCurrentValue":
        this.setCurrentValues({
          toCurrentValue: this.returnCorrectValue(optionState),
        });
        break;
      default:
        throw new Error("Invalid value");
    }

    this.changeData(newData);
    this.causeNecessaryDependence(optionName, optionState);
    this.broadcast("updateNumericOptions", newData);
  }

  public getData = (): GlobalOptions => this.data;

  public getRatios(): Ratios {
    return this.ratios;
  }

  public changeStepDependence(step: number) {
    this.checkRemainder(step);

    const { fromCurrentValue, toCurrentValue } = this.data;

    if (fromCurrentValue === toCurrentValue) {
      this.checkFirstBoundaries(step);
      this.checkSecondBoundaries(step);
    }
  }

  public changeFromCurrentValue = (FromRatio: number) => {
    const { max, min } = this.data;
    const possibleCurrentValue = FromRatio * (max - min) + min;

    const newValue = this.returnCorrectValue(possibleCurrentValue);

    this.setCurrentValues({ fromCurrentValue: newValue });
  };

  public changeToCurrentValue = (ToRatio: number) => {
    const { max, min } = this.data;
    const possibleCurrentValue = ToRatio * (max - min) + min;
    const newValue = this.returnCorrectValue(possibleCurrentValue);
    this.setCurrentValues({ toCurrentValue: newValue });
  };

  public setCurrentValues = (newData: Partial<GlobalOptions>) => {
    const { isRange } = this.data;

    if (isRange) {
      newData = this.returnSelectedValue(newData);
    }

    this.changeData(newData);
  };

  private returnCorrectValue(newValue: number): number {
    const { min, step, max } = this.data;
    const lastValue = Math.floor((max - min) / step) * step + min;

    newValue = newValue <= lastValue + (max - lastValue) / 2
      ? Math.round((newValue - min) / step) * step + min
      : max;
    if (newValue >= max) {
      newValue = max;
    } else if (newValue <= min) {
      newValue = min;
    }

    return newValue;
  }

  private returnSelectedValue(newData: Partial<GlobalOptions>) {
    const {
      step, fromCurrentValue, toCurrentValue, min, max,
    } = this.data;
    let currentValue: number;

    if (newData.fromCurrentValue) {
      currentValue = newData.fromCurrentValue;
      if (currentValue + step >= toCurrentValue && currentValue !== min) {
        if (!Number.isInteger((min + toCurrentValue) / step) && toCurrentValue === max) {
          newData = {
            fromCurrentValue:
              Math.floor((Math.abs(min) + Math.abs(toCurrentValue)) / step)
                * step
                + min,
          };
        } else newData = { fromCurrentValue: toCurrentValue - step };
      } else if (currentValue === min) {
        newData = { fromCurrentValue: currentValue };
      }
    } else if (newData.toCurrentValue) {
      currentValue = newData.toCurrentValue;
      if (currentValue - step <= fromCurrentValue) {
        const correctValue = (fromCurrentValue + step) > max
          ? max
          : fromCurrentValue + step;
        newData = { toCurrentValue: correctValue };
      } else if (currentValue === max) {
        newData = { toCurrentValue: currentValue };
      }
      return newData;
    }

    return newData;
  }

  public changeData <T>(newData: T) : void {
    this.data = {
      ...this.data,
      ...newData,
    };
    this.calculateNewRatios();
    this.broadcast("changeData", this.data);
  }

  private changeIntervalDependence() {
    const {
      toCurrentValue, fromCurrentValue, step, min,
    } = this.data;

    if (fromCurrentValue >= toCurrentValue) {
      let value = toCurrentValue - step;
      if (value < min) {
        value = min;
      }

      const newFirstValue = {
        fromCurrentValue: value,
      };

      this.changeData(newFirstValue);
    }

    if (toCurrentValue === min) {
      const newSecondValue = {
        toCurrentValue: toCurrentValue + step,
      };

      this.changeData(newSecondValue);
    }
  }

  private causeNecessaryDependence(
    optionName: NumberOptions,
    optionState: number,
  ) {
    if (optionName === "step") {
      this.changeStepDependence(optionState);
    }
    if (optionName === "max") {
      this.changeMaxDependence(optionState);
    }
    if (optionName === "min") {
      this.changeMinDependence(optionState);
    }
  }

  private changeMaxDependence(max: number) {
    const { fromCurrentValue, step, toCurrentValue } = this.data;
    if (max <= fromCurrentValue) {
      const newValue = {
        fromCurrentValue: max - step,
      };

      this.changeData(newValue);
    }

    if (max <= toCurrentValue) {
      const newValue = {
        toCurrentValue: max,
      };

      this.changeData(newValue);
    }

    this.setNumberOptions({ optionState: step, optionName: "step" });
  }

  private changeMinDependence(min: number) {
    const { fromCurrentValue, step, toCurrentValue } = this.data;
    if (min >= fromCurrentValue) {
      const newValue = {
        fromCurrentValue: min,
      };

      this.changeData(newValue);
    }

    if (min >= toCurrentValue) {
      const newValue = {
        toCurrentValue: min + step,
      };

      this.changeData(newValue);
    }

    this.changeData({ min });
    this.setNumberOptions({ optionState: step, optionName: "step" });
  }

  private checkRemainder(step: number) {
    const { fromCurrentValue, toCurrentValue, min } = this.data;
    const currentValues = [fromCurrentValue, toCurrentValue];

    currentValues.forEach((current) => {
      if ((current - min) % step) {
        const newCurrentValue = this.returnCorrectValue(current);

        const newModelValue = current === fromCurrentValue
          ? { fromCurrentValue: newCurrentValue }
          : { toCurrentValue: newCurrentValue };

        this.changeData(newModelValue);
      }
    });
  }

  private checkFirstBoundaries(step: number) {
    const { min, max, fromCurrentValue } = this.data;

    if (fromCurrentValue <= min + step) {
      const newSecondValue = {
        toCurrentValue: fromCurrentValue + step,
      };

      if (newSecondValue.toCurrentValue >= max) {
        newSecondValue.toCurrentValue = max;
      }

      this.changeData(newSecondValue);
    }
  }

  private checkSecondBoundaries(step: number) {
    const {
      min, max, fromCurrentValue, toCurrentValue,
    } = this.data;

    if (toCurrentValue >= max - step) {
      const newFirstValue = {
        fromCurrentValue: fromCurrentValue - step,
      };

      if (newFirstValue.fromCurrentValue <= min) {
        newFirstValue.fromCurrentValue = min;
      }

      this.changeData(newFirstValue);
    }
  }
}

export default Model;

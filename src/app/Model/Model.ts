import Observer from "../Observer/Observer";
import defaultAttributes from "../const";
import { GlobalOptions } from "../interfaces/GlobalOptions";
import { Ratios } from "../interfaces/Ratios";
import {
  BooleanOptions,
  UpdateBooleanOptions,
  NumberOptions,
  UpdateNumberOptions,
} from "../interfaces/AttributesOptions";

class Model extends Observer {
  data: GlobalOptions;

  ratios: Ratios;

  static defaultAttributes = defaultAttributes;

  constructor(options: GlobalOptions = Model.defaultAttributes) {
    super();
    this.data = options;
    this.calculateNewRatios();
  }

  public calculateNewRatios() {
    const { fromCurrentValue, toCurrentValue, min, max } = this.data;

    this.ratios = {
      fromRatio: (fromCurrentValue - min) / (max - min),
      toRatio: (toCurrentValue - min) / (max - min),
    };

    this.broadcast("changeRatios", this.ratios);
  }

  public setBooleanOptions(newOptions: UpdateBooleanOptions) {
    const newData: any = {};//newData: Partial<GlobalOptions>
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

    // if (optionName === "showBar") {
    //   this.changeIntervalDependences();
    // }

    this.changeData(newData);

    this.subscribe("UpdateBooleanOptions", newData); //немогу понять почему ошибка, чтото не так с subscribe
  }

  public setNumberOptions(newOptions: UpdateNumberOptions) {
    const newData: any = {};//newData: Partial<GlobalOptions>
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
    // this.causeNecessaryDependence(optionName, optionState);
    this.subscribe("updateNumberOptions", newData);//немогу понять почему ошибка, чтото не так с subscribe
  }

  public getData = (): GlobalOptions => {
    return this.data;
  };

  public getRatios(): Ratios {
    return this.ratios;
  }

  public changeFromCurrentValue = (FromRatio: number) => {
    const { max, min } = this.data;
    const possibleCurrentValue = FromRatio * (max - min) + min;

    const newValue = this.returnCorrectValue(possibleCurrentValue);

    this.setCurrentValues({ FromCurrentValue: newValue });
  };

  public changeToCurrentValue = (ToRatio: number) => {
    const { max, min } = this.data;
    const possibleCurrentValue = ToRatio * (max - min) + min;
    const newValue = this.returnCorrectValue(possibleCurrentValue);

    this.setCurrentValues({ ToCurrentValue: newValue });
  };
  public setCurrentValues = (newData: Partial<GlobalOptions>) => {
    const { hasInterval } = this.data;

    if (hasInterval) {
      newData = this.returnSelectedValue(newData);
    }

    this.changeData(newData);
  };

  private returnCorrectValue(newValue: number): number {
    const { min, step, max } = this.data;
    const lastValue = Math.floor((max - min) / step) * step + min;

    newValue =
      newValue <= lastValue + (max - lastValue) / 2
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
    const { step, fromCurrentValue, toCurrentValue } = this.data;
    let currentValue: number;

    if (newData.fromCurrentValue) {
      currentValue = newData.fromCurrentValue;
      if (currentValue + step >= toCurrentValue) {
        newData = { fromCurrentValue: toCurrentValue - step };
        return newData;
      }
    } else {
      currentValue = newData.toCurrentValue;
      if (currentValue - step <= fromCurrentValue) {
        newData = { toCurrentValue: fromCurrentValue + step };
        return newData;
      }
    }

    return newData;
  }

  public changeData(newData: Partial<GlobalOptions>) {
    this.data = {
      ...this.data,
      ...newData,
    };

    this.calculateNewRatios();
    this.broadcast("changeData", this.data);
  }
}

export default Model;

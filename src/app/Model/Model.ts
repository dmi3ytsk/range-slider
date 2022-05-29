import Observer from "../Observer/Observer";
import defaultAttributes from "../const";
import { GlobalOptions } from "../interfaces/GlobalOptions";
import { Ratios } from "../interfaces/Ratios";

class Model extends Observer {
  data: GlobalOptions;

  ratios: Ratios;

  static defaultAttributes = defaultAttributes;

  constructor(
    options: GlobalOptions = Model.defaultAttributes,
  ) {
    super();
    this.data = options;
    this.calculateNewRatios();
  }

  public calculateNewRatios() {
    const { fromCurrentValue, toCurrentValue, min, max } = this.data;

    this.ratios = {
      fromRatio: (fromCurrentValue - min) / (max - min),
      toRatio: (toCurrentValue - min) / (max - min)
    };

    this.broadcast("changeRatios", this.ratios);
  }

  public getData = (): GlobalOptions => {
    return this.data;
  };

  public getRatios(): Ratios {
    return this.ratios;
  }

}

export default Model;

import Model from "../Model/Model";
import View from "../MainView/View/View";
import { GlobalOptions } from "../interfaces/GlobalOptions";
import {
  UpdateBooleanOptions,
  UpdateNumberOptions,
} from "../interfaces/AttributesOptions";

class Controller {
  constructor(readonly model: Model, readonly view: View) {
    this.subscribeToViewEvents();
    this.subscribeToModelEvents();
  }

  public updateBooleanOptions(newOptions: UpdateBooleanOptions) {
    this.model.setBooleanOptions(newOptions);
  }

  public updateNumericOptions(newOptions: UpdateNumberOptions) {
    this.model.setNumberOptions(newOptions);
  }

  public getOptions(): GlobalOptions {
    return this.model.getData();
  }

  public checkUpdates(callback: Function) {
    this.model.subscribe("changeData", () => callback(this.model.getData()));
  }

  private subscribeToModelEvents() {
    const updateScaleEvents = ["updateBooleanOptions", "updateNumericOptions"];
    updateScaleEvents.forEach((event) => {
      this.model.subscribe(event, this.view.updateScale);
      this.model.subscribe(event, this.view.reInitSlider);
    });

    this.model.subscribe("changeRatios", this.view.updateRatios);
    this.model.subscribe("changeData", this.view.updateOptions);
    this.model.subscribe("changeData", this.view.setPosition);
    this.model.subscribe("changeData", this.view.updateOrientation);
  }

  private subscribeToViewEvents() {
    this.view.subscribe(
      "handleFromHandleDrag",
      this.model.changeFromCurrentValue,
    );
    this.view.subscribe("handleToHandleDrag", this.model.changeToCurrentValue);
  }
}

export default Controller;

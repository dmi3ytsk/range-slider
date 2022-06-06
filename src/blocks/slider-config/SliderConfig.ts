import { GlobalOptions } from "../../app/interfaces/GlobalOptions";
// import jquery from "jquery";
// (<any>window).$ = (<any>window).jQuery = jquery;

class SliderConfig {
  options: GlobalOptions;

  sliderContainer: HTMLElement;

  constructor(public $slider: JQuery<Element>, public root: HTMLFormElement) {
    this.init();
  }

  public init() {
    const index = 0;
    this.options = this.$slider.slider(this.root, "getOptions")[index];

    this.$slider.slider(
      this.sliderContainer,
      "checkUpdates",
      this.updateCurrentValues
    );

    this.initInputs();
    this.initCheckboxes();

    this.setOnInputChangeListener();
    this.setOnCheckboxChangeListener();
  }

  public updateCurrentValues = (data: GlobalOptions) => {
    Array.prototype.forEach.call(
      this.root.elements,
      (input: HTMLInputElement) => {
        const { name } = input;
        let newValue = data[name];

        if (name === "toCurrentValue") {
          newValue = data.toCurrentValue;
          input.value = Math.round(newValue).toString();
        }

        if (name === "fromCurrentValue") {
          newValue = data.fromCurrentValue;
          input.value = Math.round(newValue).toString();
        }
      }
    );
  };

  public initInputs() {
    const inputs = this.root.querySelectorAll(".input__field");

    inputs.forEach((input) => {
      for (const prop in this.options) {
        if (input instanceof HTMLInputElement && input.name === prop) {
          input.value = this.options[prop].toString();
        }
      }
    });
  }

  private setOnInputChangeListener() {
    const inputs = this.root.querySelectorAll(".input__field");

    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement) {
        input.addEventListener("change", this.handleInputChange);
      }
    });
  }

  private handleInputChange = (event: Event) => {
    const { target } = event;
    const index = 0;
    this.options = this.$slider.slider(this.root, "getOptions")[index];
    if (target && target instanceof HTMLInputElement) {
      this.checkMaxData(target);
      this.checkMinData(target);
      this.checkStepData(target);

      this.$slider.slider(this.sliderContainer, "updateNumericOptions", {
        optionState: Number(target.value),
        optionName: target.name,
      });
    }
  };

  private initCheckboxes() {
    const checkboxes = this.root.querySelectorAll(".checkbox__box");

    checkboxes.forEach((checkbox) => {
      for (const prop in this.options) {
        if (checkbox instanceof HTMLInputElement && checkbox.name === prop) {
          if (typeof this.options[prop] === "boolean") {
            checkbox.checked = Boolean(this.options[prop]);
          }
        }
      }
    });
  }

  private checkMaxData(target: HTMLInputElement) {
    const { min, step } = this.options;

    if (target.name === "max") {
      if (Number(target.value) - Number(min) < step) {
        target.value = (Number(min) + step).toString();
      }

      if (Number(target.value) < step) {
        target.value = step.toString();
      }
    }
  }

  private checkMinData(target: HTMLInputElement) {
    const { max, step } = this.options;
    let { value } = target;

    if (target.name === "min") {
      if (Number(max) - Number(value) < step) {
        value = (Number(max) - step).toString();
      }

      if (Number(value) < 0) {
        value = "0";
      }
    }
  }

  private checkStepData(target: HTMLInputElement) {
    const { max, min } = this.options;
    let { value } = target;

    if (target.name === "step") {
      if (Number(value) < 1) {
        value = "1";
      }

      if (Number(value) > Number(max) - Number(min)) {
        value = (Number(max) - Number(min)).toString();
      }
    }
  }

  private setOnCheckboxChangeListener() {
    const checkboxes = this.root.querySelectorAll(".checkbox__box");

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", this.handleCheckboxChange);
    });
  }

  private handleCheckboxChange = (event: Event) => {
    const { target } = event;

    if (target && target instanceof HTMLInputElement) {
      this.$slider.slider(this.sliderContainer, "updateBooleanOptions", {
        optionState: target.checked,
        optionName: target.name,
      });
    }
  };
}

export default SliderConfig;
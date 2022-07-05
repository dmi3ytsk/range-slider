import { GlobalOptions } from "../../app/interfaces/GlobalOptions";

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
          input.value = newValue.toString();
        }

        if (name === "fromCurrentValue") {
          newValue = data.fromCurrentValue;
          input.value = newValue.toString();
        }
      }
    );
  };

  public initInputs() {
    const inputs = this.root.querySelectorAll(".js-input__field");

    inputs.forEach((input) => {
      for (const prop in this.options) {
        if (input instanceof HTMLInputElement && input.name === prop) {
          input.value = this.options[prop].toString();
        }
      }
    });
  }

  private setOnInputChangeListener() {
    const inputs = this.root.querySelectorAll(".js-input__field");

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
    const checkboxes = this.root.querySelectorAll(".js-checkbox__box");

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
      if (Number(target.value) < Number(min)) {
        target.value = (Number(min) + step).toString();
      }
      else if(!Number.isInteger(Number(step))) {
        target.value = Number(target.value).toFixed(
          step
            .toString()
            .split("." || ",")
            .pop().length
        );
      }
    }
  }

  private checkMinData(target: HTMLInputElement) {
    const { max, step } = this.options;

    if (target.name === "min") {
      if (Number(max) < Number(target.value)) {
        target.value = (Number(max) - step).toString();
      }
      else if(!Number.isInteger(Number(step))) {
        target.value = Number(target.value).toFixed(
          step
            .toString()
            .split("." || ",")
            .pop().length
        );
      }
    }
  }

  private checkStepData(target: HTMLInputElement) {
    const { max, min } = this.options;

    if (target.name === "step") {
      if (Number(target.value) > Number(max) - Number(min)) {
        target.value = (Number(max) - Number(min)).toString();
      }
      else if (!Number.isInteger(Number(target.value))) {
        target.value=target.value;
      }
    }
  }

  private setOnCheckboxChangeListener() {
    const checkboxes = this.root.querySelectorAll(".js-checkbox__box");

    checkboxes.forEach((checkbox) => {
      if (checkbox instanceof HTMLInputElement) {
        checkbox.addEventListener("change", this.handleCheckboxChange);
      }
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

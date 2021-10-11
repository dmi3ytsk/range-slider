import Observer from "../../Observer/Observer";
import createElement from "../utils/createElement";
import {HandleOptions} from "../../interfaces/HandleOptions";

class HandleView extends Observer {
  handle: HTMLElement;

  tip: HTMLElement;

  showTip: boolean = true;

  constructor(public node: HTMLElement, public options: HandleOptions) {
    super();

    this.init();
  }
  public getHandle() {
    return this.handle;
  }

  private init() {
    this.createHandleElements();
  }

  private createHandleElements() {
    const tipOn = this.options.showTip ? "" : "_hide";
    this.tip = createElement("div", { className: `range-slider__tip${tipOn}` });

    this.handle = createElement(
      "div",
      { className: "range-slider__handle" },
      this.tip
    );

    this.node.appendChild(this.handle);
  }
}

export default HandleView;

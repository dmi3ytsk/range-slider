import JQuery from "jquery";

import SliderConfig from "../blocks/slider-config/SliderConfig";
import { GlobalOptions } from "../app/interfaces/GlobalOptions";

import "../app/app";

(<any>window).$ = (<any>window).jQuery = JQuery;

class DemoPage {
  $slider: JQuery<Element>;

  sliderConfig: SliderConfig;

  constructor(
    public root: HTMLElement,
    public sliderContainer: HTMLElement,
    options?: GlobalOptions,
  ) {
    this.init(options);
    this.root = root;
    this.sliderContainer = sliderContainer;
  }

  public init(options: GlobalOptions) {
    const sliderConfig: HTMLFormElement = this.root.querySelector(
      ".js-ez-range-slider-config",
    );

    // eslint-disable-next-line no-undef
    this.$slider = $(this.root).slider(this.sliderContainer, options);
    if (sliderConfig) {
      this.sliderConfig = new SliderConfig(this.$slider, sliderConfig);
    }
  }
}

export default DemoPage;

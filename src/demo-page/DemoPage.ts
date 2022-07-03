import "../app/app";
import SliderConfig from "../blocks/slider-config/SliderConfig";
import { GlobalOptions } from "../app/interfaces/GlobalOptions";

class DemoPage {
  $slider: JQuery<Element>;

  sliderConfig: SliderConfig;

  constructor(
    public root: HTMLElement,
    public sliderContainer: HTMLElement,
    options?: GlobalOptions
  ) {
    this.init(options);
  }

  public init(options: GlobalOptions) {
    const sliderConfig: HTMLFormElement = this.root.querySelector(
      ".js-ez-range-slider-config"
    );

    this.$slider = $(this.root).slider(this.sliderContainer, options);
    if (sliderConfig) {
      this.sliderConfig = new SliderConfig(this.$slider, sliderConfig);
    }
  }
}

export default DemoPage;

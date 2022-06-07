import "./demo-page.ts";
import DemoPage from "./DemoPage";

const sliders = document.querySelectorAll(".ez-range-slider");

sliders.forEach((slider: any) => {
  const sliderContainer = slider.querySelector(".slider-container__range-slider");
  if (sliderContainer && sliderContainer instanceof HTMLElement) {
    new DemoPage(slider, sliderContainer);
  }
});

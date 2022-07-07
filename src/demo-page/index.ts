import "./demo-page.ts";
import DemoPage from "./DemoPage";
import defaultAttributes from "../app/const";

const sliders = document.querySelectorAll(".js-ez-range-slider");

sliders.forEach((slider: any) => {
  const sliderContainer = slider.querySelector(".js-slider-container__range-slider");
  if (sliderContainer && sliderContainer instanceof HTMLElement) {
    new DemoPage(slider, sliderContainer, defaultAttributes);
  }
});

import "./demo-page.js";
import View from "../app/View/MainView/MainView";

const rangeSlider = document.querySelectorAll(".ez-range-slider")
rangeSlider.forEach(function (each) {
   new View(each)
})
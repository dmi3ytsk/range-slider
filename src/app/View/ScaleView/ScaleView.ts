import Observer from "../../Observer/Observer";
import createElement from "../utils/createElement";

class ScaleView extends Observer {
   scale: HTMLElement;


  constructor() {
    super();

    this.init();
  }

  private init() {
   this.scale = createElement(
      "div",
      {
         className: "range-slider__scale"
      }
   )
  }
  public getScale(){
     return this.scale;
  }
}
export default ScaleView;
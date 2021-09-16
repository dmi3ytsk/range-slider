import Observer from "../../Observer/Observer";
import createElement from "../utils/createElement";

class HandleView extends Observer {
   handle: HTMLElement;

   tip: HTMLElement;

   
   constructor(public node: HTMLElement) {
      super();

      this.init();
   }

   private init() {
      this.createHandleElements();
   }


   private createHandleElements() {
      this.tip = createElement (
         "div",
         {className: "range-slider__tip"}
      )

      this.handle = createElement(
         "div",
         {className: "range-slider__handle"},
         this.tip
      )

      this.node.append(this.handle);
   }
  

}

export default HandleView
import Observer from "../../Observer/Observer";
import HandleView from "../HandleView/HandleView";
import createElement from "../utils/createElement";

class TrackView extends Observer {
   track: HTMLElement;
   
   bar: HTMLElement;

   handles: HandleView[];


   constructor() {
      super();

      this.init();
   }

   private init() {

      // if(this.isRange=false) {
      //    this.handles = [
      //       new HandleView(this.track),
      //       new HandleView(this.track)
      //    ]
      // }
      // else {
         // this.handles = [new HandleView(this.track)]
      // }
      this.handles = [new HandleView(this.track)]

      this.createTrackElements();
   }

   private createTrackElements() {
      this.track = createElement(
         "div",
         {className: "range-slider__track"}
      )

      this.bar = createElement(
         "div",
         {className: "range-slider__bar"}
      )
   }

   public getTrack() {
      return this.track;
   }
}

export default TrackView;
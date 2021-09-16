import Observer from "../../Observer/Observer";
import createElement from "../utils/createElement";
import TrackView from "../TrackView/TrackView";
import ScaleView from "../ScaleView/ScaleView";

class View extends Observer {
   track: TrackView;

   scale: ScaleView;

   slider: HTMLElement

   constructor(public container: HTMLElement) {
      super();

      this.init();
   }

   private init() {
      this.slider = createElement(
         "div",
         {className: "range-slider"}
      )
      
      this.track = new TrackView;
      this.scale = new ScaleView;
      
      this.container.append(this.slider);
      this.slider.append(this.track.getTrack());
      this.slider.append(this.scale.getScale());
   }
}

export default View;



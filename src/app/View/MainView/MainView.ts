import Observer from "../../Observer/Observer";
import createElement from "../utils/createElement";
import TrackView from "../TrackView/TrackView";
import ScaleView from "../ScaleView/ScaleView";
import { TrackOptions } from "../../interfaces/TrackOptions";

class View extends Observer {
   track: TrackView;

   trackOptions: TrackOptions

   scale: ScaleView;

   slider: HTMLElement;



   constructor(public container: HTMLElement) {
      super();

      this.init();
   }

   private init() {
      this.slider = createElement(
         "div",
         {className: "range-slider"}
      )
      
      this.track = new TrackView(this.trackOptions);
      this.scale = new ScaleView;
      
      this.container.appendChild(this.slider);
      this.slider.appendChild(this.track.getTrack());
      this.slider.appendChild(this.scale.getScale());
   }
}

export default View;



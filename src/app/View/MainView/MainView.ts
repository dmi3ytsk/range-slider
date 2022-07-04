import Observer from "../../Observer/Observer";
import createElement from "../utils/createElement";
import Model from "../../Model/Model";
import TrackView from "../TrackView/TrackView";
import ScaleView from "../ScaleView/ScaleView";
import { TrackOptions } from "../../interfaces/TrackOptions";
import { GlobalOptions } from "../../interfaces/GlobalOptions";
import { Ratios } from "../../interfaces/Ratios";
import { ValueOptions } from "../../interfaces/ValueOptions";

class View extends Observer {
  options: GlobalOptions;

  track: TrackView;

  trackOptions: TrackOptions;

  scale: ScaleView;

  slider: HTMLElement;

  sliderSize: number;

  ratios: Ratios;

  constructor(public container: HTMLElement, readonly model: Model) {
    super();

    this.options = model.getData();
    this.ratios = model.getRatios();

    this.setTrackOptions();

    this.init();
  }

  public init() {
    this.slider = createElement("div", { className: "range-slider" });

    if (this.options.isVertical) {
      this.slider.classList.add("range-slider_vertical");
    }
    this.track = new TrackView(this.trackOptions);
    this.scale = new ScaleView(this.options);

    this.container.appendChild(this.slider);
    this.slider.appendChild(this.track.getTrack());
    this.slider.appendChild(this.scale.getScale());

    this.updateSliderSize();
    if(this.options.showScale){
      this.scale.init();
    }

    this.bindResizeListener();
    this.setPosition();
    this.subscribeToEvents();
  }

  public updateSliderSize() {
    this.sliderSize = this.options.isVertical
      ? this.slider.offsetHeight
      : this.slider.offsetWidth;

    this.track.updateSliderSize(this.sliderSize);
    this.scale.updateSliderSize(this.sliderSize);
  }

  public setPosition = () => {
    const {
      isVertical,
      isRange,
      fromCurrentValue,
      toCurrentValue,
      showBar,
      showTip,
      step,
    } = this.options;
    const { ratios } = this;

    this.track.setElementsPosition({
      isVertical,
      isRange,
      fromCurrentValue,
      toCurrentValue,
      showBar,
      showTip,
      ratios,
      step,
    });
  };

  public setTrackOptions() {
    const {
      isVertical,
      showBar,
      fromCurrentValue,
      toCurrentValue,
      isRange,
      showTip,
      step,
    } = this.options;
    const { ratios } = this;

    this.trackOptions = {
      isVertical,
      isRange,
      fromCurrentValue,
      toCurrentValue,
      showBar,
      showTip,
      ratios,
      step
    };
  }

  public updateScale = () => {
    this.scale.reInitScale();
    this.track.setElementsPosition(this.trackOptions);
  };

  public updateOrientation = () => {
   if (this.options.isVertical) {
     this.slider.classList.add("range-slider_vertical");
   } else {
     this.slider.classList.remove("range-slider_vertical");
   }

   this.updateSliderSize();
 };

 public updateRatios = (newRatios: Ratios) => {
   this.ratios = newRatios;
 };

 public updateOptions = (options: GlobalOptions) => {
   this.options = options;
   this.setTrackOptions();
   this.track.updateOptions(this.trackOptions);
   this.scale.updateOptions(this.options);
 };

  public reInitSlider = () => {
    this.track.initTrackElements();
    this.track.updateBar(this.options.showBar);
    this.track.setElementsPosition(this.trackOptions);
  };

  private bindResizeListener() {
    window.addEventListener("resize", this.handleWindowResize);
  }

  private handleWindowResize = () => {
    const isSliderExist = this.slider && document.contains(this.slider);
    if (isSliderExist) {
      this.updateSliderSize();
      this.updateScale();
      this.reInitSlider();
    } else {
      window.removeEventListener("resize", this.handleWindowResize);
    }
  };

  private subscribeToEvents() {
   this.track.subscribe("dragHandle", this.notifyHandleDrag);
   this.scale.subscribe("scaleClick", this.notifyHandleDrag);
 }

 private notifyHandleDrag = (valueSettings: ValueOptions) => {
   const { handleNumber, ratio } = valueSettings;
   if (handleNumber === 1) {
     this.broadcast("handleFromHandleDrag", ratio);
   } else {
     this.broadcast("handleToHandleDrag", ratio);
   }
 };
}

export default View;

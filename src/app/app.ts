import "../app/app.scss";
import Model from "../app/Model/Model";
import View from "../app/View/MainView/MainView";
import Controller from "../app/Controller/Controller";
import { GlobalOptions } from "../app/interfaces/GlobalOptions";
import { ControllerOptionsMethods } from "../app/interfaces/ControllerOptionsMethods";
import jquery from "jquery";
(<any>window).$ = (<any>window).jQuery = jquery;

declare global {
  interface JQuery {
    slider: (
      sliderContainer?: HTMLElement,
      options?: GlobalOptions | ControllerOptionsMethods,
      rest?:
        | Partial<GlobalOptions>
        | Function
        | { optionState: number | boolean; optionName: string }
    ) => any;
  }
}

(($) => {
  $.fn.slider = function slider(sliderContainer, options, ...args) {
    const init = () => {
      let model: Model;
      const dataOptionsAttributes = $(this).data();
      const { defaultAttributes } = Model;
      const newOptions =
        typeof options === "object"
          ? { ...options, ...dataOptionsAttributes }
          : { ...defaultAttributes, ...dataOptionsAttributes };

      if (Object.keys(newOptions).length > 0 || options) {
        model = new Model(newOptions);
      } else {
        model = new Model(defaultAttributes);
      }

      const view = new View(sliderContainer, model);
      const controller = new Controller(model, view);

      $(this).data("controller", controller);

      return this;
    };

    const executeControllerMethod = (methodName: ControllerOptionsMethods) => {
      return $(this)
        .data("controller")
        [methodName](...args);
    };

    if (typeof options === "string") {
      const methodName = options;

      return $(this).map(() => {
        return executeControllerMethod(methodName);
      });
    }

    return init();
  };
})($);

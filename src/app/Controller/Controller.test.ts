
/**
 * @jest-environment jsdom
 */

import Controller from "./Controller";
import Model from "../Model/Model";
import View from "../MainView/View/View";

document.body.innerHTML = '<div class="js-slider"></div>';

const container = document.querySelector(".js-slider");
const model = new Model();
const view = new View(container as HTMLElement, model);
let controller: Controller;

const modelBroadcast = jest.spyOn(Model.prototype, "broadcast");
const modelSubscribe = jest.spyOn(Model.prototype, "subscribe");
const modelSetBooleanOptions = jest.spyOn(Model.prototype, "setBooleanOptions");
const modelSetNumberOptions = jest.spyOn(Model.prototype, "setNumberOptions");
const viewBroadcast = jest.spyOn(View.prototype, "broadcast");
const viewSubscribe = jest.spyOn(View.prototype, "subscribe");
describe("Test Controller", () => {
  beforeEach(() => {
    controller = new Controller(model, view);
  });

  afterEach(() => {
    modelBroadcast.mockClear();
    modelSubscribe.mockClear();
    viewBroadcast.mockClear();
    viewSubscribe.mockClear();
    modelSetNumberOptions.mockClear();
    modelSetBooleanOptions.mockClear();
  });

  describe("Initialization", () => {
    test("Set correct data", () => {
      expect(controller.model).toBeInstanceOf(Model);
      expect(controller.view).toBeInstanceOf(View);
    });
  });

  describe("updateBooleanOptions method", () => {
    test("Call setBooleanOptions model method with correct data", () => {
      controller.updateBooleanOptions({
        optionState: false,
        optionName: "showBar",
      });

      expect(modelSetBooleanOptions).toBeCalledTimes(1);
      expect(modelSetBooleanOptions).toBeCalledWith({
        optionState: false,
        optionName: "showBar",
      });
    });
  });

  describe("updateNumericOptions method", () => {
    test("Call setNumericOptions model method with correct data", () => {
      controller.updateNumericOptions({ optionState: 10, optionName: "min" });

      expect(modelSetNumberOptions).toBeCalled();
      expect(modelSetNumberOptions).toBeCalledWith({
        optionState: 10,
        optionName: "min",
      });
    });
  });

  describe("checkUpdates method", () => {
    test("Subscribe to changeData model event", () => {
      const callback = jest.fn();

      controller.checkUpdates(callback);

      expect(modelSubscribe).toBeCalled();
      expect(modelSubscribe).toBeCalledWith("changeData", expect.any(Function));
    });
  });

  describe("getOptions method", () => {
    test("Return new model options object", () => {
      const options = controller.getOptions();

      expect(options).toBeInstanceOf(Object);
      expect(options).toEqual(model.data);
    });
  });
});

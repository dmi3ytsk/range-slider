import Model from "./Model";

const testOptions = {
  width: 500,
  fromCurrentValue: 50,
  min: 0,
  max: 1000,
  step: 5,
  showTip: true,
  isRange: true,
  toCurrentValue: 500,
  showBar: true,
  showScale: false,
  isVertical: false,
};

const broadcast = jest.spyOn(Model.prototype, "broadcast");
const changeStepDependence = jest.spyOn(
  Model.prototype,
  "changeStepDependence",
);
const setNumberOptions = jest.spyOn(Model.prototype, "setNumberOptions");
const changeData = jest.spyOn(Model.prototype, "changeData");

let testModel: Model;

describe("Test model", () => {
  afterEach(() => {
    broadcast.mockClear();
    changeStepDependence.mockClear();
    setNumberOptions.mockClear();
    changeData.mockClear();
  });

  beforeEach(() => {
    testModel = new Model(testOptions);
  });

  describe("Constructor parameters", () => {
    test("Init default model", () => {
      const defaultModel = new Model();

      expect(defaultModel.data.min).toEqual(0);
      expect(defaultModel.data.max).toEqual(100);
    });

    test("Init with custom parameters", () => {
      const customModel = new Model({
        width: 500,
        fromCurrentValue: 15,
        min: 10,
        max: 500,
        step: 5,
        showTip: true,
        isRange: true,
        toCurrentValue: 500,
        showBar: true,
        showScale: false,
        isVertical: false,
      });

      const { min, max, fromCurrentValue } = customModel.getData();
      expect(min).toEqual(10);
      expect(max).toEqual(500);
      expect(fromCurrentValue).toEqual(15);
    });
  });

  describe("Initializing new model", () => {
    test("Init test model", () => {
      expect(testModel.data.min).toEqual(testOptions.min);
      expect(testModel.data.max).toEqual(testOptions.max);
    });
  });

  describe("changeData method", () => {
    test("Change numeric data", () => {
      testModel.changeData({
        min: 5,
        step: 15,
      });
      expect(testModel.data.min).toEqual(5);
      expect(testModel.data.step).toEqual(15);
      expect(broadcast).toBeCalled();
      expect(broadcast).toBeCalledWith("changeData", {
        ...testOptions,
        min: 5,
        step: 15,
      });
    });

    test("Change boolean data", () => {
      testModel.changeData({
        showBar: false,
        showTip: false,
      });
      expect(testModel.data.showBar).toBe(false);
      expect(testModel.data.showTip).toBe(false);
      expect(broadcast).toBeCalled();
      expect(broadcast).toBeCalledWith("changeData", {
        ...testOptions,
        showBar: false,
        showTip: false,
      });
    });
  });

  describe("calculateCurrent method", () => {
    test("Change wrong data", () => {
      testModel.changeFromCurrentValue(-15);
      expect(testModel.data.fromCurrentValue).toEqual(testModel.data.min);

      testModel.changeToCurrentValue(50000);
      expect(testModel.data.toCurrentValue).toEqual(testModel.data.max);
    });

    test("Calculate correct newValue", () => {
      testModel.changeFromCurrentValue(0.1);
      expect(testModel.data.fromCurrentValue).toEqual(100);

      testModel.changeToCurrentValue(0.5);
      expect(testModel.data.toCurrentValue).toEqual(500);
    });
  });

  describe("changeToCurrentValue method", () => {
    test("Change ratio to newValue and call setCurrentValues for secondValue", () => {
      const { max, min } = testModel.data;
      const ratio = 1;
      const newValue = ratio * (max - min) + min;

      testModel.changeToCurrentValue(newValue);
      expect(testModel.data.toCurrentValue).toEqual(newValue);
    });
  });

  describe("setCurrentValues method", () => {
    test("Call change data with correct value", () => {
      testModel.setCurrentValues({ fromCurrentValue: 100 });

      expect(changeData).toBeCalled();
      expect(changeData).toBeCalledWith({ fromCurrentValue: 100 });
      expect(testModel.data.fromCurrentValue).toEqual(100);
    });
  });

  describe("setBooleanOptions method", () => {
    test("Set correct data", () => {
      testModel.setBooleanOptions({
        optionState: true,
        optionName: "isRange",
      });
      expect(testModel.data.isRange).toBeTruthy();

      testModel.setBooleanOptions({
        optionState: false,
        optionName: "showScale",
      });
      expect(testModel.data.showScale).toBeFalsy();

      testModel.setBooleanOptions({
        optionState: false,
        optionName: "showTip",
      });
      expect(testModel.data.showTip).toBeFalsy();

      testModel.setBooleanOptions({
        optionState: true,
        optionName: "isVertical",
      });
      expect(testModel.data.isVertical).toBeTruthy();
    });

    test("Call changeIntervalDependence", () => {
      testModel.setBooleanOptions({
        optionState: true,
        optionName: "isRange",
      });
      expect(testModel.data.isRange).toBeTruthy();
    });

    test("Notify updateBooleanOptions with correct data", () => {
      testModel.setBooleanOptions({
        optionState: true,
        optionName: "isRange",
      });
      expect(broadcast).toBeCalled();
      expect(broadcast).toBeCalledWith("updateBooleanOptions", {
        isRange: true,
      });
      expect(broadcast).toBeCalledWith("changeData", {
        ...testOptions,
        isRange: true,
      });
    });
  });

  describe("setNumberOptions method", () => {
    test("Set correct data", () => {
      testModel.setNumberOptions({ optionState: 100, optionName: "min" });
      expect(testModel.data.min).toEqual(100);

      testModel.setNumberOptions({ optionState: 700, optionName: "max" });
      expect(testModel.data.max).toEqual(700);

      testModel.setNumberOptions({ optionState: 5, optionName: "step" });
      expect(testModel.data.step).toEqual(5);

      testModel.setNumberOptions({
        optionState: 0.2,
        optionName: "fromCurrentValue",
      });
      expect(testModel.data.fromCurrentValue).toEqual(100);

      testModel.setNumberOptions({
        optionState: 0.3,
        optionName: "toCurrentValue",
      });
      expect(testModel.data.toCurrentValue).toEqual(105);
    });

    test("Call necessary dependent methods", () => {
      testModel.setNumberOptions({ optionState: 5, optionName: "step" });
      expect(changeStepDependence).toBeCalledTimes(1);

      testModel.setNumberOptions({ optionState: 700, optionName: "max" });
      testModel.setNumberOptions({ optionState: 5, optionName: "min" });
    });

    test("Notify updateNumericOptions with correct data", () => {
      testModel.setNumberOptions({ optionState: 5, optionName: "step" });
      expect(broadcast).toBeCalled();
      expect(broadcast).toBeCalledWith("updateNumericOptions", { step: 5 });
      expect(broadcast).toBeCalledWith("changeData", { ...testOptions, step: 5 });
    });
  });

  describe("changeStepDependence method", () => {
    test("Call changeData with correct condition", () => {
      testModel.changeStepDependence(1);
      expect(broadcast).toBeCalled();

      testModel.changeStepDependence(3);
      expect(broadcast).toBeCalled();

      testModel.data.fromCurrentValue = 0;
      testModel.data.toCurrentValue = 0;

      testModel.changeStepDependence(7);
      expect(broadcast).toBeCalled();

      testModel.data.fromCurrentValue = 500;
      testModel.data.toCurrentValue = 500;

      testModel.changeStepDependence(7);
      expect(broadcast).toBeCalled();
    });
  });
});

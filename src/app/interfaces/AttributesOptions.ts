export type BooleanOptions =
  | "isRange"
  | "isVertical"
  | "showTip"
  | "showBar"
  | "showScale";

export interface UpdateBooleanOptions {
  optionState: boolean;
  optionName: BooleanOptions;
}

export type NumberOptions =
  | "min"
  | "max"
  | "step"
  | "fromCurrentValue"
  | "toCurrentValue";

export interface UpdateNumberOptions {
  optionState: number;
  optionName: NumberOptions;
}

export interface TrackOptions {
  isVertical: boolean,
  isRange: boolean,
  showBar: boolean,
  showTip: boolean,
  fromCurrentValue: number,
  toCurrentValue: number,
  ratios: { fromRatio: number, toRatio: number },
  step: number,
}

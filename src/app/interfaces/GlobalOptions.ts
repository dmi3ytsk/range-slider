export interface GlobalOptions {
   width?: number,
   min?: number,
   max?: number,
   step?: number,
   fromCurrentValue?: number,
   toCurrentValue?: number,
   isRange?: boolean,
   isVertical?: boolean,
   showTip?: boolean,
   showBar?: boolean,
   showScale?: boolean,
   [dataKey: string]: number | boolean;
}
 
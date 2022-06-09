# ez-range-slider

[Demo page](https://dmi3ytsk.github.io/range-slider/public/demo-page/demo-page.html)
 
## Build
```
  npm run build
```
## Development
```
  npm run dev
```
## Test
```
  npm test
```
---
## Usage
```
$(root).slider(sliderContainer);
```
<i>root</i> - init selector, add data-attr here
<i>sliderContainer</i> - slider container
---
example:
pug 
```
.ez-slider-here(data-min=-10, data-max=20, data-is-range="false")
   .ez-slider-container
```
js
```
$(".ez-slider-here").slider($(".ez-slider-container"));
```
---
## Parameters

| Parameter | Type | Default value | Description |
|:------:|:----:|:-------------:|:-------------:|
|width|Number|100|Set slider width(or height)|
|min|Number|0|Minimum value|
|max|Number|100|Maximum value|
|step|Number|1|Step size|
|fromCurrentValue|Number|10|First(single) thumb value|
|toCurrentValue|Number|80|Second thumb value|
|showTip|Boolean|true|Show tip bubble with current value|
|showBar|Boolean|true|Show bar on track|
|showScale|Boolean|true|Show slider scale|
|isVertical|Boolean|false|Vertical slider orientation when parameter is true|
|isRange|Boolean|true|Slider type: range or single|
---
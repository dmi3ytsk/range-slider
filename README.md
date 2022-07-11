# ez-range-slider

[Demo page](https://dmi3ytsk.github.io/range-slider/public/)
 
## Clone
```
  git clone https://github.com/dmi3ytsk/range-slider.git
```
## JQuery first!
```
  npm install jquery
```
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
## Eslint
```
  npm run eslint
```

## Usage
```
$(root).slider(sliderContainer);
```
<i>root</i> - init selector, add data-attr here<br>
<i>sliderContainer</i> - slider container
 
---
example:<br>
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
## Application architecture description
This application is built on MVC(MVP)-like architecture pattern with higher order component(Observer) and split layers.

 #### Model
 This layer is responsible for business logic and independent of other layers. Сan notify other layers about data changes using Observer.

 #### View
 This layer creating all slider elements, display it state, and View also responds to user interaction with slider.
 
 #### Controller
  This layer is responsible for interaction of the View and Model. Takes Model and View as parameters. Layer wait for messages from each other and responds to them through Observer

---
## UML Diagram
  ![UML Diagram](https://github.com/dmi3ytsk/range-slider/blob/main/img/uml-diagram.jpg)

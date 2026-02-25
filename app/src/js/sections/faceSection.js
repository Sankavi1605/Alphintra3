'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Strips = require('../objects3D/StripsObject3D');

var faceSection = new Section('face');

var text = new TextPanel(
  'O  U  R \n W  O  R  K',
  {
    align: 'left',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
text.el.position.set(23, 0, 0);
text.el.rotation.y = -0.4;
faceSection.add(text.el);

var strips = new Strips({
  count: 10,
  colors: ['#444444', '#333333', '#222222'],
  rangeY: [-60, 60]
});
faceSection.add(strips.el);

strips.el.visible = false;

faceSection.onIn(function () {
  strips.in();
  text.in();
});

faceSection.onOut(function (way) {
  strips.out();
  text.out();
});

faceSection.onStart(function () {
  strips.el.visible = true;
});

faceSection.onStop(function () {
  strips.el.visible = false;
});

module.exports = faceSection;

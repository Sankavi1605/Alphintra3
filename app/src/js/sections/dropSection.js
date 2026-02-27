'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Drop = require('../objects3D/DropObject3D');

var dropSection = new Section('drop');

var drop = new Drop({ amplitude: 4 });
drop.el.rotation.x = -1.2;
drop.el.position.y = -10;
dropSection.add(drop.el);

var text = new TextPanel(
  'E  N  G  I  N  E  E  R \n T  H  E    F  U  T  U  R  E',
  {
    align: 'right',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
text.el.position.set(-10, 8, 0);

function updateTextPosition () {
  if (window.innerWidth <= 900) {
    text.el.position.x = -6;
    text.el.position.z = 5;
    text.el.scale.set(0.82, 0.82, 0.82);
    return;
  }

  text.el.position.x = -10;
  text.el.position.z = 0;
  text.el.scale.set(1, 1, 1);
}

updateTextPosition();
window.addEventListener('resize', updateTextPosition);

dropSection.add(text.el);

drop.el.visible = false;

dropSection.onIn(function () {
  drop.in();
  text.in();
});

dropSection.onOut(function (way) {
  drop.out(way);
  text.out(way);
});

dropSection.onStart(function () {
  drop.start();

  drop.el.visible = true;
});

dropSection.onStop(function () {
  drop.stop();

  drop.el.visible = false;
});

module.exports = dropSection;

'use strict';

var Section = require('../classes/SectionClass');

var Beam = require('../objects3D/BeamObject3D');
var TextPanel = require('../objects3D/TextPanelObject3D');

var beamsSection = new Section('beams');

var leftBeam = new Beam({ color: '#808080', delay: 0.2 });
leftBeam.el.position.set(15, 25, -10);
beamsSection.add(leftBeam.el);

var middleBeam = new Beam({ color: '#ffffff', width: 4, cubeSize: 1, delay: 0.1 });
middleBeam.el.position.y = 15;
beamsSection.add(middleBeam.el);

var rightBeam = new Beam({ color: '#4c4c4c', delay: 0.4 });
rightBeam.el.position.set(-20, 30, -20);
beamsSection.add(rightBeam.el);

var text = new TextPanel(
  'E  X  P  E  R  I  E  N  C  E    T  R  U  E \n A  I    A  U  T  O  M  A  T  I  O  N',
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

beamsSection.add(text.el);

leftBeam.el.visible = false;
middleBeam.el.visible = false;
rightBeam.el.visible = false;

beamsSection.onIn(function () {
  leftBeam.in();
  middleBeam.in();
  rightBeam.in();
  text.in();
});

beamsSection.onOut(function (way) {
  leftBeam.out(way);
  middleBeam.out(way);
  rightBeam.out(way);
  text.out(way);
});

beamsSection.onStart(function () {
  leftBeam.start();
  middleBeam.start();
  rightBeam.start();

  leftBeam.el.visible = true;
  middleBeam.el.visible = true;
  rightBeam.el.visible = true;
});

beamsSection.onStop(function () {
  leftBeam.stop();
  middleBeam.stop();
  rightBeam.stop();

  leftBeam.el.visible = false;
  middleBeam.el.visible = false;
  rightBeam.el.visible = false;
});

module.exports = beamsSection;
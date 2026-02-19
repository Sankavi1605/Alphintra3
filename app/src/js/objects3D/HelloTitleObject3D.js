'use strict';

var THREE = require('three');
var TweenLite = require('tweenlite');

/**
 * Hero title
 *
 * @class Title
 * @constructor
 * @requires THREE, TweenLite
 */
function Title () {
  var text = 'A L P H I N T R A';
  var fontSize = 132;
  var font = '400 ' + fontSize + 'px Futura, Trebuchet MS, Arial, sans-serif';

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  context.font = font;
  var textWidth = context.measureText(text).width;
  var paddingX = 110;
  var paddingY = 56;

  canvas.width = Math.ceil(textWidth + (paddingX * 2));
  canvas.height = Math.ceil(fontSize + (paddingY * 2));

  context.font = font;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  context.fillStyle = 'rgba(236, 240, 245, 0.95)';
  context.shadowColor = 'rgba(255, 255, 255, 0.18)';
  context.shadowBlur = 12;
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  var material = new THREE.MeshBasicMaterial({
    map: texture,
    depthWrite: false,
    depthTest: true,
    transparent: true
  });

  var geometry = new THREE.PlaneGeometry(canvas.width / 26, canvas.height / 26);
  var plane = new THREE.Mesh(geometry, material);

  function update () {
    plane.position.y = cache.y;
    material.opacity = cache.opacity;
  }

  var cache = { y: 20, opacity: 0 };
  var inTween = TweenLite.to(cache, 1, { y: 0, opacity: 1, paused: true, onUpdate: update});

  this.el = plane;

  var pulseTween = TweenLite.to(plane.scale, 2.6, {
    x: 1.02,
    y: 1.02,
    repeat: -1,
    yoyo: true,
    ease: window.Sine.easeInOut,
    paused: true
  });

  this.in = function () {
    inTween.play();
  };

  this.out = function () {
    inTween.reverse();
  };

  this.start = function () {
    pulseTween.play();
  };

  this.stop = function () {
    pulseTween.pause(0);
    plane.scale.set(1, 1, 1);
  };
}

module.exports = Title;

/* jshint laxbreak: true */

'use strict';

require('./polyfills/animFramePolyfill');
require('./polyfills/bindPolyfill');
require('./polyfills/indexOfPolyfill');

var jQuery = require('jquery');
var skrollr = require('skrollr');
require('./libs/waypointLib');
  
var HASH = require('./modules/hashModule');

var ImagesLoader = require('./classes/LoaderClass');

var Loader = require('./objects2D/LoaderObject2D');
var Menu = require('./objects2D/menuObject2D');
var Help = require('./objects2D/HelpObject2D');
var Wireframe = require('./objects2D/WireframeObject2D');

function mobile () {
  return navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i);
}

jQuery(function () {
  HASH.replacePlaceholders();

  var loader = new Loader();
  var menu = new Menu();
  var help = new Help();
  var imagesLoader = new ImagesLoader([
    './app/public/img/part-beam.png',
    './app/public/img/part-drop.png',
    './app/public/img/part-sphere.png',
    './app/public/img/part-grid.png',
    './app/public/img/part-field.png',
    './app/public/img/part-stars.png'
  ]);

  imagesLoader.onProgress(function (percent) {
    loader.update(percent);
  });

  imagesLoader.start();

  function getSectionScrollPosition (sectionName) {
    var $section = jQuery('.heads__section--' + sectionName);
    var minValue = Number.POSITIVE_INFINITY;

    if (!$section.length) {
      return null;
    }

    $section.find('*').addBack().each(function () {
      var attributes = this.attributes || [];

      for (var i = 0, j = attributes.length; i < j; i++) {
        var match = /^data-(\d+)$/.exec(attributes[i].name);
        if (match) {
          var value = parseInt(match[1], 10);
          if (value < minValue) {
            minValue = value;
          }
        }
      }
    });

    return minValue === Number.POSITIVE_INFINITY ? null : minValue;
  }

  menu.onClick(function (e) {
    var $el = jQuery(this);
    var sectionName = $el.attr('data-section') || '';
    var buttonName = $el.attr('data-button') || '';
    var tailName = $el.attr('data-tail') || '';

    if (tailName) {
      if (e) {
        e.preventDefault();
      }

      var $tailSection = jQuery('.tails__section--' + tailName);

      if ($tailSection.length) {
        jQuery('html, body').stop().animate({ scrollTop: $tailSection.offset().top }, 800);
      }

      return false;
    }

    if (sectionName) {
      if (e) {
        e.preventDefault();
      }

      var target = getSectionScrollPosition(sectionName);

      if (target !== null) {
        jQuery('html, body').stop().animate({ scrollTop: target }, 800);
      }

      return false;
    }

    if (buttonName === 'help') {
      if (e) {
        e.preventDefault();
      }

      help.in();
      return false;
    }

    if (buttonName === 'sounds' || buttonName === 'quality') {
      if (e) {
        e.preventDefault();
      }

      return false;
    }
  });

  // heads
  skrollr.init({
    skrollrBody: 'mobile-body',
    smoothScrolling: true,
    forceHeight: false,
    mobileDeceleration: 0.004,
    mobileCheck: function () { return false; }
  });

  // tails
  var wireframe = new Wireframe(jQuery('.wireframe'));
  var $tails = jQuery('.tails');
  var $tailsSections = $tails.find('.tails__section');

  // prepare els
  $tailsSections.find('.tails__section__el').animate({ opacity: 0, y: 100 }, 0);

  var waypoint = $tailsSections.waypoint({
    offset: 30,
    startAt: $tails.offset().top - 1000
  });

  waypoint.start();

  $tailsSections.on('active', function () {
    var $el = jQuery(this);
    
    if ($el.attr('data-appeared')) {
      return false;
    }

    jQuery(this).find('.tails__section__el').each(function (i) {
      jQuery(this).stop().delay(i * 100).animate({ opacity: 1, y: 0 }, 500);
    });

    $el.attr('data-appeared', true);
  });

  jQuery('.tails__section--site').on('stateChange', function (e, state) {
    if (state === 'active') {
      wireframe.start();
      wireframe.in();
    } else {
      wireframe.stop();
    }
  });

  imagesLoader.onComplete(function () {
    loader.out();

    setTimeout(function () {
      menu.in();
    }, 1500);
  });
});

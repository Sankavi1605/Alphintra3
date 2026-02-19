(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Preload images. Notify on update/complete
 *
 * @class ImagesLoader
 * @constructor
 * @param {Array} [images=[]] Images sources
 */
function ImagesLoader (images) {
  this.images = images || [];
  this.total = this.images.length;

  var fn = function () {};
  this.progress = fn;
  this.complete = fn;
}

/**
 * Start to preload
 *
 * @method start
 */
ImagesLoader.prototype.start = function () {
  var loaded = 0;

  var updateQueue = function () {
    loaded++;

    var percent = (loaded * 100) / this.total;
    this.progress(percent);

    if (loaded === this.total) {
      this.complete();
    }
  }.bind(this);

  for (var i = 0; i < this.total; i++) {
    var image = new Image();
    image.src = this.images[i];
    image.onload = image.onerror = updateQueue;
  }
};

/**
 * Pass the update handler
 *
 * @method onProgress
 * @param {Function} [progress] 
 */
ImagesLoader.prototype.onProgress = function (progress) {
  this.progress = progress;
};

/**
 * Pass the complete handler
 *
 * @method onComplete
 * @param {Function} [complete] 
 */
ImagesLoader.prototype.onComplete = function (complete) {
  this.complete = complete;
};

module.exports = ImagesLoader;
},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Slider
 *
 * @class Slider
 * @constructor
 * @requires jQuery
 */
function Slider ($el) {
  this.$el = $el;

  // els
  this.$container = this.$el.find('.slider__slides');
  this.$slides = this.$container.find('.slider__slide');
  this.$map = this.$el.find('.slider__map');

  // vars
  this.totalSlides = this.$slides.length;
  this.slideWidth = 100 / this.totalSlides;
  this.current = 0;
  this.interval = null;

  // init container
  this.$container.css('width', (this.totalSlides * 100) + '%');

  // methods
  this.onResize = null;

  // init slides and map
  var $node = jQuery('<div class="slider__map__node">');
  this.$nodes = jQuery();

  this.$slides.each(function (index, el) {
    var $slide = jQuery(el);
    
    $slide.css({
      width: this.slideWidth + '%',
      left: (index * this.slideWidth) + '%'
    });

    var $nodeCopy = $node.clone();
      
    // first slide/node setup
    if (index === 0) {
      $slide.addClass('is-active');
      $nodeCopy.addClass('is-active');
    }

    this.$nodes = this.$nodes.add($nodeCopy);
  }.bind(this));

  this.$map.html(this.$nodes);

  // init resize method
  this.onResize = function () {
    var maxHeight = 0;

    this.$slides.each(function () {
      var height = jQuery(this).height();

      if (height > maxHeight) {
        maxHeight = height;
      }
    });

    maxHeight += 10;

    this.$el.css({ height: maxHeight, marginTop: -(maxHeight / 2) });
  }.bind(this);

  this.onResize();
}

/**
 * Go to next slide
 *
 * @method next
 */
Slider.prototype.next = function () {
  this.current++;

  if (this.current >= this.totalSlides) {
    this.current = 0;
  }

  this.goTo(this.current);
};

/**
 * Go to previous slide
 *
 * @method prev
 */
Slider.prototype.prev = function () {
  this.current--;

  if (this.current <= 0) {
    this.current = this.totalSlides;
  }

  this.goTo(this.current);
};

/**
 * Go to a specific slide
 *
 * @method goTo
 * @param {Number} [index] Slide's index
 */
Slider.prototype.goTo = function (index) {
  var target = -(index * 100) + '%';

  this.updateMap(index);

  this.$container.stop().animate({ left: target }, 500);

  this.$slides.removeClass('is-active');
  jQuery(this.$slides[index]).addClass('is-active');
};

/**
 * Update control nodes
 *
 * @method updateMap
 * @param {Number} [index] Current index
 */
Slider.prototype.updateMap = function (index) {
  this.$nodes.removeClass('is-active');
  jQuery(this.$nodes[index]).addClass('is-active');
};

/**
 * Start the slider
 *
 * @method start
 */
Slider.prototype.start = function () {
  this.$nodes.on('click', function (e) {
    var index = jQuery(e.currentTarget).index();
    this.goTo(index);
  }.bind(this));

  // autoplay with pause on hover
  this.interval = window.setInterval(function () {
    this.next();
  }.bind(this), 10000);

  var _this = this;
  
  this.$el.on({
    mouseenter: function () {
      window.clearInterval(_this.interval);
    },
    mouseleave: function () {
      _this.interval = window.setInterval(function () {
        _this.next();
      }, 10000);
    }
  });

  jQuery(window).on('resize', this.onResize);
  this.onResize();
};

/**
 * Stop the slider
 *
 * @method next
 */
Slider.prototype.stop = function () {
  this.$nodes.off('click');
  this.$el.off('mouseenter mouseleave');
  jQuery(window).off('resize', this.onResize);

  window.clearInterval(this.interval);
};

module.exports = Slider;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
/* jshint laxbreak: true */

'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var debounce = require('../utils/debounceUtil');

module.exports = (function ($) {
  /**
   * Trigger event on element when they enter/leave viewport
   *
   * @class waypoint
   * @constructor
   * @param {Object} [options]
   * @param {jQuery} [options.$viewport=jQuery(window)] Viewport
   * @param {Number} [options.offset=0] Offset
   * @param {Number} [options.startAt=null] Start after certain distance (for performances)
   * @requires jQuery, debounce
   */
  $.fn.waypoint = function (options) {
    var isInContainer = options.$viewport ? true : false;

    var parameters = $.extend({
      $viewport: $(window),
      offset: 0,
      startAt: null
    }, options);

    var $els = $(this);
    var $viewport = parameters.$viewport;

    var viewportHeight = $viewport.height();
    var scrollTop = $viewport.scrollTop();
    var threshold = viewportHeight * (parameters.offset / 100);

    // Store height and top on elements to avoid consecutive computations
    function cacheAttributes () {
      $els.each(function () {
        var $el = $(this);

        var height = parseInt($el.outerHeight());
        var top = isInContainer
          ? parseInt($el.position().top) + scrollTop
          : parseInt($el.offset().top);

        $el.attr({ 'data-height': height, 'data-top': top });
      });
    }

    function onResize () {
      /*jshint validthis: true */

      viewportHeight = $viewport.height();
      threshold = viewportHeight * (parameters.offset / 100);

      cacheAttributes();

      $(this).trigger('scroll');
    }

    var onScroll = debounce(function onScroll () {
      scrollTop = $(this).scrollTop();

      if (parameters.startAt && scrollTop < parameters.startAt) {
        return false;
      }

      var topLimit = scrollTop + threshold;
      var bottomLimit = scrollTop + (viewportHeight - threshold);

      $els.each(function () {
        var $el = $(this);

        var state = $el.attr('data-state');

        var height = parseInt($el.attr('data-height')) || $el.outerHeight();
        var top = isInContainer
          ? parseInt($el.attr('data-top')) + 1 || $el.position().top + 1
          : parseInt($el.attr('data-top')) + 1 || $el.offset().top + 1;
        var bottom = top + height;

        if (top > topLimit && top < bottomLimit
            || bottom > topLimit && bottom < bottomLimit
            || top < topLimit && bottom > bottomLimit) {

          if (!state) {
            $el.attr('data-state', 'visible');
            $el.trigger('active');
            $el.trigger('stateChange', 'active');
          }
        } else {
          if (state) {
            $el.attr('data-state', null);
            $el.trigger('inactive');
            $el.trigger('stateChange', 'inactive');
          }
        }

      });
    }, 20);

    return {
      /**
       * Start waypoint
       *
       * @method start
       */
      start: function () {
        $(window).on('resize', onResize);
        $viewport.on('scroll', onScroll);
        cacheAttributes();
        onScroll();
      },

      /**
       * Stop waypoint
       *
       * @method stop
       */
      stop: function () {
        $(window).off('resize', onResize);
        $viewport.off('scroll', onScroll);
      }
    };
  };

})(jQuery);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/debounceUtil":16}],4:[function(require,module,exports){
(function (global){
/* jshint laxbreak: true */

'use strict';

require('./polyfills/animFramePolyfill');
require('./polyfills/bindPolyfill');
require('./polyfills/indexOfPolyfill');

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var skrollr = (typeof window !== "undefined" ? window['skrollr'] : typeof global !== "undefined" ? global['skrollr'] : null);
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
  skrollr.init({ skrollrBody: 'mobile-body' });

  // tails
  var wireframe = new Wireframe(jQuery('.wireframe'));

  if (!mobile()) {
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
  } else {
    wireframe.in();
  }

  imagesLoader.onComplete(function () {
    loader.out();

    setTimeout(function () {
      menu.in();
    }, 1500);
  });
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./classes/LoaderClass":1,"./libs/waypointLib":3,"./modules/hashModule":5,"./objects2D/HelpObject2D":6,"./objects2D/LoaderObject2D":9,"./objects2D/WireframeObject2D":11,"./objects2D/menuObject2D":12,"./polyfills/animFramePolyfill":13,"./polyfills/bindPolyfill":14,"./polyfills/indexOfPolyfill":15}],5:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Extract the current hash
 * and return the corresponding name
 *
 * @module HASH
 * @requires jQuery
 */
var HASH = HASH || (function () {
  var instance = null;

  function init () {
    var agency = 'Alphintra';

    function getHash () {
      return window.location.hash.split('#')[1];
    }

    var hash = getHash();

    return {
      hash: hash,
      agency: agency,

      /**
       * Replace all the placeholders by correct agency name
       *
       * @method replacePlaceholders
       */
      replacePlaceholders: function () {
        var $placeholders = jQuery('.placeholder--agency');
        
        $placeholders.each(function () {
          var $placeholder = jQuery(this);

          if ($placeholder.hasClass('placeholder--agency--you')) {
            $placeholder.html('your team');
          } else {
            if ($placeholder.hasClass('placeholder--agency--capital')) {
              $placeholder.html(agency.toUpperCase());
            } else {
              $placeholder.html(agency);
            }
          }
        });

        var $email = jQuery('.placeholder--email');
        var subject = '?subject=Project inquiry from website';
        var body = '&body=Hi Alphintra team, I would like to discuss a project.';

        $email.attr('href', [
          'mailto:hello@alphintra.com',
          subject,
          body
        ].join(''));
      }
    };
  }

  return {
    /**
     * Get HASH current instance
     *
     * @method getInstance
     * @return {HASH}
     */
    getInstance: function () {
      if (!instance) {
        instance = init();
      }

      return instance;
    }
  };
})();

module.exports = HASH.getInstance();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var Slider = require('../libs/sliderLib');

var Layout = require('../objects2D/LayoutObject2D');
var Mouse = require('../objects2D/MouseObject2D');
var Keys = require('../objects2D/KeysObject2D');

/**
 * Help overlay
 *
 * @class Help
 * @constructor
 * @requires jQuery, Sider, Layout, Mouse, Keys
 */
function Help () {
  this.$el = jQuery('.help');
  this.slider = new Slider(this.$el.find('.slider'));

  this.keys = new Keys(this.$el.find('.keys'));
  this.mouse = new Mouse(this.$el.find('.mouse'));
  this.layout = new Layout(this.$el.find('.layout'));
}

/**
 * In animation
 *
 * @method in
 */
Help.prototype.in = function () {
  this.$el.css({ display: 'block', opacity: 0 });

  this.slider.start();

  this.slider.$el.delay(100).css({ top: '60%', opacity: 0 })
    .animate({ top: '50%', opacity: 1 }, 500);

  this.$el.stop().animate({ opacity: 0.9 }, 500, function () {
    this.keys.start();
    this.mouse.start();
    this.layout.start();
  }.bind(this));

  this.$el.on('click', function (event) {
    if (event.target === this) {
      this.out();
    }
  }.bind(this));

  this.$el.find('.help__quit').on('click', function () {
    this.out();
  }.bind(this));
};

/**
 * Out animation
 *
 * @method out
 */
Help.prototype.out = function () {
  this.$el.stop().animate({ opacity: 0 }, 500, function () {
    this.$el.css('display', 'none');

    this.slider.stop();

    this.keys.stop();
    this.mouse.stop();
    this.layout.stop();
  }.bind(this));

  this.$el.off('click');
  this.$el.find('.help__quit').off('click');
};

module.exports = Help;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../libs/sliderLib":2,"../objects2D/KeysObject2D":7,"../objects2D/LayoutObject2D":8,"../objects2D/MouseObject2D":10}],7:[function(require,module,exports){
'use strict';

/**
 * Animated keyboard keys
 *
 * @class Keys
 * @constructor
 * @requires jQuery
 */
function Keys ($el) {
  this.$el = $el;

  this.$top = this.$el.find('.key--top');
  this.$bottom = this.$el.find('.key--bottom');

  this.interval = null;
  this.current = 'top';
}

/**
 * Hightlight a key
 *
 * @method highlight
 */
Keys.prototype.highlight = function () {
  this.current = this.current === 'top' ? 'bottom' : 'top';
  var $el = this.current === 'top' ? this.$top : this.$bottom;

  $el.stop().animate({
      opacity: 1
    }, 400, function () {
      $el.stop().animate({
        opacity: 0.2
      }, 300);
  });
};

/**
 * Start animation
 *
 * @method start
 */
Keys.prototype.start = function () {
  this.interval = window.setInterval(function () {
    this.highlight();
  }.bind(this), 1000);
};

/**
 * Stop animation
 *
 * @method stop
 */
Keys.prototype.stop = function () {
  window.clearInterval(this.interval);
};

module.exports = Keys;
},{}],8:[function(require,module,exports){
'use strict';

/**
 * Animated layout
 *
 * @class Layout
 * @constructor
 * @requires jQuery
 */
function Layout ($el) {
  this.$el = $el;

  this.$container = this.$el.find('.layout__parts');
  this.$mouse = this.$el.find('.layout__mouse');
  this.$click = this.$mouse.find('.layout__mouse__click');

  // targets
  this.y = 0;
  this.openY = -15;
  this.mouseY = 90;

  this.interval = null;
}

/**
 * Animation next step
 *
 * @method slide
 */
Layout.prototype.slide = function () {
  // update targets
  if (this.y === 0) {
    this.y = -100;
    this.openY = -15;
    this.mouseY = 83;
  } else {
    this.y = 0;
    this.openY = -85;
    this.mouseY = 3;
  }

  var open = function () {
    this.$container.animate({
      'top': this.openY + '%'
    }, 800, function () {
      click();
    });
  }.bind(this);

  var moveMouse = function () {
    var flag = false;

    this.$mouse.animate({
      'top': this.mouseY + '%'
    }, {
      duration: 500,
      progress: function (animation, progress) {
        if (!flag && progress > 0.5) {
          flag = !flag;
          open();
        }
      }
    });
  }.bind(this);

  var click = function () {
    var flag = false;

    this.$click.delay(500).animate({
      'width': 70,
      'height': 70,
      'margin-left': -35,
      'margin-top': -35,
      'opacity': 0
    }, {
      duration: 400,
      progress: function (animation, progress) {
        if (!flag && progress > 0.7) {
          flag = !flag;
          slide();
        }
      },
      complete: function () {
        this.$click.css({
          'width': 0,
          'height': 0,
          'margin-left': 0,
          'margin-top': 0,
          'opacity': 1
        }.bind(this));
      }
    });
  }.bind(this);

  var slide = function () {
    this.$container.animate({
      'top': this.y + '%'
    }, 500);

    centerMouse();
  }.bind(this);

  var centerMouse = function () {
    this.$mouse.delay(300).animate({
      'top': '45%'
    }, 500);
  }.bind(this);

  moveMouse();
};

/**
 * Start animation
 *
 * @method start
 */
Layout.prototype.start = function () {
  this.slide();

  this.interval = window.setInterval(function () {
    this.slide();
  }.bind(this), 4000);
};

/**
 * Stop animation
 *
 * @method stop
 */
Layout.prototype.stop = function () {
  window.clearInterval(this.interval);
};

module.exports = Layout;
},{}],9:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Preloader
 *
 * @class Loader
 * @constructor
 * @requires jQuery
 */
function Loader () {
  this.$el = jQuery('.loader');
  this.$title = this.$el.find('.loader__title');
  this.$progress = this.$el.find('.loader__progress');
}

/**
 * Out animation
 *
 * @method out
 */
Loader.prototype.out = function () {
  this.$progress.stop().animate({ width: '100%' }, 1000, function () {
    this.$el.animate({ opacity: 0 }, 1000, function () {
      this.$el.css('display', 'none');
    }.bind(this));

    this.$title.animate({ top: '-10%', opacity: 0 }, 500);
    this.$progress.animate({ height: 0 }, 400);
  }.bind(this));
};

/**
 * Update the percent loaded
 *
 * @method update
 * @param {Number} [percent]
 */
Loader.prototype.update = function () {};

module.exports = Loader;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],10:[function(require,module,exports){
'use strict';

/**
 * Animated mouse
 *
 * @class Mouse
 * @constructor
 * @requires jQuery
 */
function Mouse ($el) {
  this.$el = $el;

  this.$wheel = this.$el.find('.mouse__wheel');
  this.$lines = this.$wheel.find('.mouse__wheel__lines');

  this.interval = null;
  this.y = 0;
}

/**
 * Animate wheel
 *
 * @method scroll
 */
Mouse.prototype.scroll = function () {
  this.y = this.y === 0 ? -80 : 0;

  this.$wheel.stop().animate({ opacity: 1 }, 400);

  var y = this.y;

  this.$lines.stop().animate({
      top: y + '%'
    }, 500, function () {
      this.$wheel.stop().animate({
        opacity: 0.2
      }, 300);
  }.bind(this));
};

/**
 * Start animation
 *
 * @method start
 */
Mouse.prototype.start = function () {
  this.interval = window.setInterval(function () {
    this.scroll();
  }.bind(this), 2000);
};

/**
 * Stop animation
 *
 * @method stop
 */
Mouse.prototype.stop = function () {
  window.clearInterval(this.interval);
};

module.exports = Mouse;
},{}],11:[function(require,module,exports){
(function (global){
/* jshint laxbreak: true */

'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Animated wireframe
 *
 * @class Wireframe
 * @constructor
 * @param {jQuery} [$el] DOM element
 * @param {Object} [options]
 * @param {Number} [options.delay] Delay between frames
 * @param {Array} [options.positions] Animated scroll positions
 * @requires jQuery
 */
function Wireframe ($el, options) {
  this.parameters = jQuery.extend({
    delay: 200,
    positions: [-20, -90, -135, -200, -20, 40]
  }, options);

  this.$topLines = $el.find('.wireframe__frame--top');
  this.$bottomLines = $el.find('.wireframe__frame--bottom');
  this.$leftLines = $el.find('.wireframe__frame--left');
  this.$rightLines = $el.find('.wireframe__frame--right');
  this.$leftColumn = $el.find('.wireframe__column--left');
  this.$textLines = $el.find('.wireframe__text__line');
  this.$controlNodes = $el.find('.wireframe__controls__node');

  this.interval = null;
  this.totalPositions = this.parameters.positions.length;
  this.currentPosition = 0;
}

/**
 * In animation
 *
 * @method in
 * @param {Boolean} [out] Out instead of in?
 */
Wireframe.prototype.in = function (out) {
  // targets
  var targetLines;
  var targetTextLines;
  var targetIncompleteTextLines;
  var targetNodes;

  if (out === 0) {
    targetLines = targetTextLines = targetIncompleteTextLines = 0;
    targetNodes = 30;
  } else {
    targetLines = targetTextLines = '100%';
    targetIncompleteTextLines = '60%';
    targetNodes = 0;
  }

  // frames
  var totalFrames = this.$topLines.length;

  var setAnimation = function (index) {
    var $top = jQuery(this.$topLines[index]);
    var $bottom = jQuery(this.$bottomLines[index]);
    var $left = jQuery(this.$leftLines[index]);
    var $right = jQuery(this.$rightLines[index]);

    setTimeout(function () {
      $top.css('width', targetLines);
      $right.css('height', targetLines);
    }, (index * this.parameters.delay) + 400);

    setTimeout(function () {
      $left.css('height', targetLines);
      $bottom.css('width', targetLines);
    }, (index * this.parameters.delay) + 600);
  }.bind(this);

  // set animations for each frame
  for (var i = 0; i < totalFrames; i++) {
    setAnimation(i);
  }

  // text
  var delay = this.parameters.delay;

  this.$textLines.each(function (i) {
    var $line = jQuery(this);

    setTimeout(function () {
      $line.css('width', $line.hasClass('wireframe__text__line--incomplete')
        ? targetIncompleteTextLines
        : targetTextLines);
      
    }, i * delay);
  });

  // control nodes
  this.$controlNodes.each(function (i) {
    var $node = jQuery(this);

    setTimeout(function () {
      $node.css('top', targetNodes);
    }, i * delay);
  });
};

/**
 * Out animation
 *
 * @method out
 */
Wireframe.prototype.out = function () {
  this.$topLines.css('width', 0);
  this.$bottomLines.css('width', 0);
  this.$leftLines.css('height', 0);
  this.$rightLines.css('height', 0);
  this.$textLines.css('width', 0);
  this.$controlNodes.css('top', 30);
};

/**
 * Start animation
 *
 * @method start
 */
Wireframe.prototype.start = function () {
  if (this.interval) {
    return false;
  }

  this.interval = setInterval(function () {
    if (this.currentPosition > this.totalPositions) {
      this.currentPosition = 0;
    }

    this.$leftColumn.css('top', this.parameters.positions[this.currentPosition] + 'px');

    this.currentPosition++;
  }.bind(this), 2000);
};

/**
 * Stop animation
 *
 * @method stop
 */
Wireframe.prototype.stop = function () {
  if (!this.interval) {
    return false;
  }

  window.clearInterval(this.interval);
  this.interval = null;
};

module.exports = Wireframe;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],12:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Menu
 *
 * @class Menu
 * @constructor
 * @requires jQuery
 */
function Menu () {
  var $el = jQuery('.menu');
  var $button = $el.find('.menu__button');
  var $itemsContainer = $el.find('.menu__items');
  var $items = $el.find('.menu__item');

  var _callback = function () {};
  var timeouts = [];
  var isOpen = false;

  function onItemClick (e) {
    if (e) {
      e.stopPropagation();
    }

    _callback.call(this, e);
    closeMenu();
  }

  function clearTimeouts () {
    if (!timeouts || !timeouts.length) {
      return;
    }

    for (var i = 0, j = timeouts.length; i < j; i++) {
      window.clearTimeout(timeouts[i]);
    }
    timeouts = [];
  }

  function showItemsStaggered () {
    $items.stop(true, true).css('opacity', 0);

    $items.each(function (i) {
      var $item = jQuery(this);

      var timeout = window.setTimeout(function () {
        $item.stop().animate({ opacity: 1 }, 260);
      }, i * 90);

      timeouts.push(timeout);
    });
  }

  function openMenu () {
    if (isOpen) {
      return;
    }

    isOpen = true;
    clearTimeouts();
    $items.on('click', onItemClick);
    $itemsContainer.stop(true, true).css('display', 'block');
    $el.addClass('menu--open');

    $el.stop().animate({ left: 0 }, { duration: 400, easing: 'easeOutQuart' });
    $button.stop().animate({ opacity: 0 }, 400);
    showItemsStaggered();
  }

  function closeMenu () {
    if (!isOpen) {
      return;
    }

    isOpen = false;
    clearTimeouts();
    $el.removeClass('menu--open');

    $el.stop().animate({ left: 30 }, { duration: 400, easing: 'easeOutQuart' });
    $button.stop().animate({ opacity: 0.5 }, 400);
    $items.stop().animate({ opacity: 0 }, 220, function () {
      if (!isOpen) {
        $itemsContainer.css('display', 'none');
      }

      $items.off('click', onItemClick);
    });
  }

  $button.on('mouseenter', openMenu);
  $button.on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  $el.on('mouseenter', openMenu);
  $el.on('mouseleave', closeMenu);
  $el.on('click', function (e) {
    e.stopPropagation();
  });

  jQuery(document).on('click', closeMenu);

  return {
    in: function () {
      $el.animate({ top: 0, opacity: 1 }, 500);
    },

    onClick: function (callback) {
      _callback = callback;
    }
  };
}

module.exports = Menu;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(require,module,exports){
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license

'use strict';

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }
 
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
 
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
})();
},{}],14:[function(require,module,exports){
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

'use strict';

(function () {
  if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs   = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP    = function() {},
          fBound  = function() {
            return fToBind.apply(this instanceof fNOP && oThis
                   ? this
                   : oThis,
                   aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();

      return fBound;
    };
  }
})();
},{}],15:[function(require,module,exports){
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

'use strict';

(function () {
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement /*, fromIndex */ ) {"use strict";
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) {// shortcut for verifying if it's NaN
          n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if ( k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    }
  }
})();
},{}],16:[function(require,module,exports){
'use strict';

/**
 * Debounce a function
 * https://github.com/jashkenas/underscore
 *
 * @method debounce
 * @param {Function} [callback]
 * @param {Number} [delay]
 * @param {Boolean} [immediate]
 * @return {Function}
 */
function debounce (callback, delay, immediate) {
  var timeout;

  return function () {
    var context = this;
    var args = arguments;

    var callLater = function () {
      timeout = null;
      if (!immediate) {
        callback.apply(context, args);
      }
    };

    var callNow = immediate && !timeout;
    window.clearTimeout(timeout);
    timeout = window.setTimeout(callLater, delay);
    if (callNow) {
      callback.apply(context, args);
    }
  };
}

module.exports = debounce; 
},{}]},{},[4]);

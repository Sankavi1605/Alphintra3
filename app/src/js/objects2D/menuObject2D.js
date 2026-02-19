'use strict';

var jQuery = require('jquery');

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

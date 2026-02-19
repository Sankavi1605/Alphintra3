'use strict';

var jQuery = require('jquery');

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

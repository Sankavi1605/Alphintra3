'use strict';

/**
 * Silent sounds module.
 *
 * Keeps the same API used across the app, but performs no audio playback.
 */
var muted = true;

function noop () {}

function createSilentChannel () {
  return {
    play: noop,
    stop: noop,
    fadeIn: noop,
    fadeOut: noop
  };
}

module.exports = {
  toggle: function () {
    muted = !muted;
  },

  isMuted: function () {
    return muted;
  },

  background: createSilentChannel(),
  wind: createSilentChannel(),
  whitenoise: createSilentChannel(),
  neon: createSilentChannel()
};

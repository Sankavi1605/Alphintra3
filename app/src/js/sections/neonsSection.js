'use strict';

var Section = require('../classes/SectionClass');

var neonsSection = new Section('neons');

// Neon 3D object animation removed intentionally.
// Keep section API compatible with existing flow.
neonsSection.onStart(function () {});

neonsSection.onStop(function () {});

neonsSection.smokeStart = function () {};

neonsSection.smokeStop = function () {};

module.exports = neonsSection;

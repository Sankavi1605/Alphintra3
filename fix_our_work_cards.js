const fs = require('fs');

let c = fs.readFileSync('app/src/index.html', 'utf8');

// The string replace only works on the first match if not using regex, let's be careful.
// Let's manually replace the data-work-card indices properly using exact strings.
c = c.replace('data-work-card="3"', 'data-work-card="4"');
c = c.replace('<p class="our-work-card__index"> 04 </p>', '<p class="our-work-card__index"> 05 </p>');

c = c.replace('data-work-card="2"', 'data-work-card="3"');
c = c.replace('<p class="our-work-card__index"> 03 </p>', '<p class="our-work-card__index"> 04 </p>');

c = c.replace('data-work-card="1"', 'data-work-card="2"');
c = c.replace('<p class="our-work-card__index"> 02 </p>', '<p class="our-work-card__index"> 03 </p>');

const newCard = `
              <div class="our-work-card" data-work-card="1" aria-hidden="true">
                <div class="our-work-card__media our-work-card__media--freewrite" style="background-image: url('/app/public/img/qubitz/UIUXHero.jpg');"></div>
                <p class="our-work-card__index"> 02 </p>
                <h2> Free Write </h2>
                <p class="our-work-card__subtitle"> Creative Publishing Platform </p>
                <p>
                  Discover Free Write – an all-in-one creative platform where writers, readers, and designers come together to share, explore, and grow.
                </p>
                <div class="tails__tags">
                  <span class="tails__tag"> COMMUNITY </span>
                  <span class="tails__tag"> E-COMMERCE </span>
                  <span class="tails__tag"> PUBLISHING </span>
                </div>
                <div class="our-work-card__actions">
                  <button class="our-work-card__button" type="button" data-work-detail-open> View Detail </button>
                </div>
              </div>
`;

// Insert the new card just before PulseOps's card (which now has data-work-card="2")
c = c.replace('<div class="our-work-card" data-work-card="2" aria-hidden="true">', newCard + '\n              <div class="our-work-card" data-work-card="2" aria-hidden="true">');

fs.writeFileSync('app/src/index.html', c);
console.log('Fixed Our Work cards loop index issue!');

const fs = require('fs');

const original = `            (function (button) {
              button.addEventListener('touchstart', function (event) {
                event.stopPropagation();
              }, { passive: true });

              button.addEventListener('touchend', function (event) {
                if (event.cancelable) event.preventDefault();
                event.stopPropagation();
                var ownerCard = button.closest('.our-work-card');
                if (!ownerCard || ownerCard.getAttribute('aria-hidden') === 'true') return;
                openDetailFromCard(ownerCard);
              }, { passive: false });

              button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var ownerCard = button.closest('.our-work-card');
                if (!ownerCard || ownerCard.getAttribute('aria-hidden') === 'true') return;
                openDetailFromCard(ownerCard);
              });
            })(openButtons[k]);`;

const replacement = `            (function (button) {
              button.addEventListener('pointerdown', function (event) {
                event.stopPropagation();
              });
              
              button.addEventListener('touchstart', function (event) {
                event.stopPropagation();
              }, { passive: true });

              button.addEventListener('touchend', function (event) {
                if (event.cancelable) event.preventDefault();
                event.stopPropagation();
                var ownerCard = button.closest('.our-work-card');
                if (!ownerCard || ownerCard.getAttribute('aria-hidden') === 'true') return;
                openDetailFromCard(ownerCard);
              }, { passive: false });

              button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var ownerCard = button.closest('.our-work-card');
                if (!ownerCard || ownerCard.getAttribute('aria-hidden') === 'true') return;
                openDetailFromCard(ownerCard);
              });
            })(openButtons[k]);`;

['app/src/index.html', 'index.html'].forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(original, replacement);
  fs.writeFileSync(f, content);
  console.log('Replaced in', f);
});
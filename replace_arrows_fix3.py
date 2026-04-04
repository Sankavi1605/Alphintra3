import os

old_str = """        function populateDetailPanel(card) {
          if (!detailPanel || !card) return;

          var data = getDetailDataForCard(card);
          var media = card.querySelector('.our-work-card__media');
          var images = (data && data.images) ? data.images : [];
          detailPanel.__heroImages = images;
          detailPanel.__heroImageIndex = 0;
          if (detailHero) {
            if (images.length && images[0].src) {
              detailHero.style.backgroundImage = 'url("' + images[0].src + '")';
            } else if (media) {
              detailHero.style.backgroundImage = window.getComputedStyle(media).backgroundImage;
            }
          }

          if (detailIndex) {
            detailIndex.textContent = (getCardText(card, '.our-work-card__index') || '01').replace(/\s+/g, '');
          }
          if (detailSidebarTitle) {
            detailSidebarTitle.textContent = getCardText(card, 'h2');
          }
          if (detailTitle) {
            detailTitle.textContent = getCardText(card, 'h2');
          }
          if (detailSubtitle) {
            detailSubtitle.textContent = getCardText(card, '.our-work-card__subtitle');
          }
          if (detailDescription) {
            detailDescription.textContent = data.description || getCardText(card, 'p:not(.our-work-card__index):not(.our-work-card__subtitle)');
          }

          renderDetailTags(card);
          renderDetailPoints(data);
        }"""

new_str = """        function populateDetailPanel(card) {
          if (!detailPanel || !card) return;

          var data = getDetailDataForCard(card);
          var media = card.querySelector('.our-work-card__media');
          var images = (data && data.images) ? data.images : [];
          detailPanel.__heroImages = images;
          detailPanel.__heroImageIndex = 0;
          if (detailHero) {
            if (images.length && images[0].src) {
              detailHero.style.backgroundImage = 'url("' + images[0].src + '")';
            } else if (media) {
              detailHero.style.backgroundImage = window.getComputedStyle(media).backgroundImage;
            }
          }

          if (detailIndex) {
            detailIndex.textContent = (getCardText(card, '.our-work-card__index') || '01').replace(/\s+/g, '');
          }
          if (detailSidebarTitle) {
            detailSidebarTitle.textContent = getCardText(card, 'h2');
          }
          if (detailTitle) {
            detailTitle.textContent = getCardText(card, 'h2');
          }
          if (detailSubtitle) {
            detailSubtitle.textContent = getCardText(card, '.our-work-card__subtitle');
          }
          if (detailDescription) {
            detailDescription.textContent = data.description || getCardText(card, 'p:not(.our-work-card__index):not(.our-work-card__subtitle)');
          }

          var detailLinkBtn = detailPanel.querySelector('[data-work-detail-link]');
          if (detailLinkBtn) {
            if (data && data.url) {
              detailLinkBtn.style.display = '';
              detailLinkBtn.href = data.url;
            } else {
              detailLinkBtn.style.display = 'none';
              detailLinkBtn.href = '#';
            }
          }

          renderDetailTags(card);
          renderDetailPoints(data);
        }"""

for filepath in ['app/src/index.html', 'index.html']:
    content = open(filepath, 'r', encoding='utf-8').read()
    if old_str in content:
        content = content.replace(old_str, new_str)
        open(filepath, 'w', encoding='utf-8').write(content)
        print("Replaced in", filepath)
    else:
        print("Not found in", filepath)

import os

old_str = open('tmp_snippet.txt', 'r', encoding='utf-8').read()

new_str = """        function shouldShowArrow() {
          var activeSection = getActiveSection();
          var defaultRet = { prev: false, next: false };
          if (!activeSection) return defaultRet;
          
          var activeWorkStack = activeSection.querySelector('.our-work-stack');
          
          if (window.innerWidth <= 900) {
            if (activeWorkStack && activeWorkStack.classList.contains('is-detail-open')) return defaultRet;
            
            if (activeSection.id && activeSection.id.indexOf('section-1') > -1 && typeof activeSection.__neonsMobileCanNext === 'function') {
              return { prev: activeSection.__neonsMobileCanPrev(), next: activeSection.__neonsMobileCanNext() };
            }
            if (activeWorkStack && typeof activeWorkStack.__workCardCanNext === 'function') {
              return { prev: activeWorkStack.__workCardCanPrev(), next: activeWorkStack.__workCardCanNext() };
            }
            return { prev: true, next: true };
          }
          
          var activeSlider = activeSection.querySelector('[data-flow-slider]');
          if (activeSlider && typeof activeSlider.__flowSliderCanNext === 'function') {
            return { prev: activeSlider.__flowSliderCanPrev(), next: activeSlider.__flowSliderCanNext() };
          }
          
          if (activeWorkStack && typeof activeWorkStack.__workCardCanNext === 'function') {
            return { prev: activeWorkStack.__workCardCanPrev(), next: activeWorkStack.__workCardCanNext() };
          }
          
          return defaultRet;
        }

        function syncArrowVisibility() {
          var visible = shouldShowArrow();
          nextArrow.style.display = visible.next ? '' : 'none';
          nextArrow.setAttribute('aria-hidden', visible.next ? 'false' : 'true');
          prevArrow.style.display = visible.prev ? '' : 'none';
          prevArrow.setAttribute('aria-hidden', visible.prev ? 'false' : 'true');
        }

"""

for filepath in ['app/src/index.html', 'index.html']:
    content = open(filepath, 'r', encoding='utf-8').read()
    if old_str in content:
        content = content.replace(old_str, new_str)
        open(filepath, 'w', encoding='utf-8').write(content)
        print("Replaced in", filepath)
    else:
        print("Not found in", filepath)

import os

old_str = """        function shouldShowArrow() {
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
        }"""

new_str = """        function shouldShowArrow() {
          var activeSection = getActiveSection();
          var defaultRet = { prev: false, next: false };
          if (!activeSection) return defaultRet;
          
          var activeWorkStack = activeSection.querySelector('.our-work-stack');
          var activeSlider = activeSection.querySelector('[data-flow-slider]');
          
          if (window.innerWidth <= 900) {
            if (activeWorkStack && activeWorkStack.classList.contains('is-detail-open')) return defaultRet;
            
            if (activeSection.classList && activeSection.classList.contains('heads__section--neons') && typeof activeSection.__neonsMobileCanNext === 'function') {
              return { prev: activeSection.__neonsMobileCanPrev(), next: activeSection.__neonsMobileCanNext() };
            }
            if (activeWorkStack && typeof activeWorkStack.__workCardCanNext === 'function') {
              return { prev: activeWorkStack.__workCardCanPrev(), next: activeWorkStack.__workCardCanNext() };
            }
            if (activeSlider && typeof activeSlider.__flowSliderCanNext === 'function') {
              return { prev: activeSlider.__flowSliderCanPrev(), next: activeSlider.__flowSliderCanNext() };
            }
            return defaultRet;
          }
          
          if (activeSlider && typeof activeSlider.__flowSliderCanNext === 'function') {
            return { prev: activeSlider.__flowSliderCanPrev(), next: activeSlider.__flowSliderCanNext() };
          }
          
          if (activeWorkStack && typeof activeWorkStack.__workCardCanNext === 'function') {
            return { prev: activeWorkStack.__workCardCanPrev(), next: activeWorkStack.__workCardCanNext() };
          }
          
          return defaultRet;
        }"""

for filepath in ['app/src/index.html', 'index.html']:
    content = open(filepath, 'r', encoding='utf-8').read()
    if old_str in content:
        content = content.replace(old_str, new_str)
        open(filepath, 'w', encoding='utf-8').write(content)
        print("Replaced in", filepath)
    else:
        print("Not found in", filepath)

import os

old_str = """                      <div class="our-work-detail__actions">
                        <button class="our-work-detail__action" type="button" data-work-detail-image>
                          View Project Images
                        </button>
                        <button class="our-work-detail__action our-work-detail__action--ghost" type="button" data-work-detail-back>
                          Back to Work Section
                        </button>
                      </div>"""

new_str = """                      <div class="our-work-detail__actions">
                        <a href="#" class="our-work-detail__action" data-work-detail-link>
                          Open Project
                        </a>
                        <button class="our-work-detail__action our-work-detail__action--ghost" type="button" data-work-detail-image>
                          View Project Images
                        </button>
                        <button class="our-work-detail__action our-work-detail__action--ghost" type="button" data-work-detail-back>
                          Back to Work Section
                        </button>
                      </div>"""

for filepath in ['app/src/index.html', 'index.html']:
    content = open(filepath, 'r', encoding='utf-8').read()
    if old_str in content:
        content = content.replace(old_str, new_str)
        open(filepath, 'w', encoding='utf-8').write(content)
        print("Replaced in", filepath)
    else:
        print("Not found in", filepath)

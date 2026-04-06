import re
with open('app/src/index.html', encoding='utf8') as f:
    content = f.read()

cards = re.findall(r'<div class="our-work-card".*?data-work-card="\d"', content)
for c in cards:
    print(c)

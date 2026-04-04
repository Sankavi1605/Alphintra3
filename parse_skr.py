import re

with open('app/src/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

sections = re.findall(r'<div class="heads__section(?:.*?)(?:>(.*?)(?:<div class="part part--stars">|</div><!-- tails -->))', text, re.DOTALL)
print(f"Total sections: {len(sections)}")

for i, s in enumerate(sections[:3]):
    if not s:
        continue
    parts = re.findall(r'<div[^>]*class="[^"]*part[^>]*>', s)
    print(f"Section {i}:")
    for p in parts:
        p = re.sub(r'\s+', ' ', p)
        print("  ", p.strip())
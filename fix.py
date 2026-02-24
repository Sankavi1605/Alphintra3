with open("c:/Users/User/OneDrive/Documents/alp/Alphintra3/index.html", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace(".part:not(.part--title):not(.section__card) { display: none !important; } /* We hide the graphical bits that overlap the text */", "/* Keep graphical bits, but rely on z-index */\n        .part { z-index: 1; }\n        .part--title { z-index: 5 !important; }\n        .section__card { z-index: 10 !important; }")

with open("c:/Users/User/OneDrive/Documents/alp/Alphintra3/index.html", "w", encoding="utf-8") as f:
    f.write(text)

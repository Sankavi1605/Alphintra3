import re

file_path = "c:/Users/User/OneDrive/Documents/alp/Alphintra3/index.html"
with open(file_path, "r", encoding="utf-8") as f:
    html = f.read()

# Web and Mobile
html = html.replace(
'''        <div class="heads__section heads__section--ball">
          <div class="part part--title ball__title"
              data-1700="opacity:0"
              data-2000="opacity:1">
            <h1 class="text--white text--noMargin text--left"> WEB AND </h1>
            <h1 class="text--white text--noMargin text--left"> MOBILE </h1>
          </div>''',
'''        <div class="heads__section heads__section--ball">
          <div class="part part--title ball__title"
              data-1700="opacity:0"
              data-2000="opacity:1">
            <h1 class="text--white text--noMargin text--left"> WEB AND </h1>
            <h1 class="text--white text--noMargin text--left"> MOBILE </h1>
          </div>
          <div class="part section__card"
              data-1700="opacity:0"
              data-2000="opacity:1">
            <div class="tails__section__el tails__feature-card">
              <h2> High-Performance Applications </h2>
              <p>
                We craft SEO-optimized web applications with Next.js and stunning cross-platform mobile experiences with Flutter.
                Blazing fast, pixel perfect, and built to scale.
              </p>
              <div class="tails__tags">
                <span class="tails__tag"> NEXT.JS </span>
                <span class="tails__tag"> REACT </span>
                <span class="tails__tag"> FLUTTER </span>
                <span class="tails__tag"> TYPESCRIPT </span>
                <span class="tails__tag"> TAILWIND </span>
              </div>
            </div>
          </div>'''
)

# AI and Automation
html = html.replace(
'''        <div class="heads__section heads__section--flow">
          <div class="part part--field"
              data-2000="transform:translate3d(0px, 200px, 0px); opacity:0"
              data-2700="transform:translate3d(0px, 0px, 0px); opacity:1"></div>''',
'''        <div class="heads__section heads__section--flow">
          <div class="part part--field"
              data-2000="transform:translate3d(0px, 200px, 0px); opacity:0"
              data-2700="transform:translate3d(0px, 0px, 0px); opacity:1"></div>
          <div class="part section__card"
              data-2000="opacity:0"
              data-2700="opacity:1">
            <div class="tails__section__el tails__feature-card">
              <h2> Intelligent Systems </h2>
              <p>
                Moving beyond basic apps with LangChain and RAG workflows. We integrate LLMs into business processes
                to make organizations smarter, faster, and more data-driven.
              </p>
              <div class="tails__tags">
                <span class="tails__tag"> LANGCHAIN </span>
                <span class="tails__tag"> RAG </span>
                <span class="tails__tag"> GPT </span>
                <span class="tails__tag"> PYTHON </span>
                <span class="tails__tag"> VECTOR DB </span>
              </div>
            </div>
          </div>'''
)

# Enterprise Backend
html = html.replace(
'''        <div class="heads__section heads__section--height">
          <div class="part part--title height__title"
              data-3500="opacity:0"
              data-3800="opacity:1">
            <h1 class="text--white text--right text--noMargin"> ENTERPRISE </h1>
            <h1 class="text--white text--right text--noMargin"> BACKEND </h1>
          </div>''',
'''        <div class="heads__section heads__section--height">
          <div class="part part--title height__title"
              data-3500="opacity:0"
              data-3800="opacity:1">
            <h1 class="text--white text--right text--noMargin"> ENTERPRISE </h1>
            <h1 class="text--white text--right text--noMargin"> BACKEND </h1>
          </div>
          <div class="part section__card"
              data-3500="opacity:0"
              data-3800="opacity:1">
            <div class="tails__section__el tails__feature-card">
              <h2> Rock-Solid Infrastructure </h2>
              <p>
                Spring Boot microservices deployed on GCP with Docker. Designed for 99.9% uptime, horizontal scaling,
                and enterprise-grade security.
              </p>
              <div class="tails__tags">
                <span class="tails__tag"> SPRING BOOT </span>
                <span class="tails__tag"> JAVA </span>
                <span class="tails__tag"> DOCKER </span>
                <span class="tails__tag"> GCP </span>
                <span class="tails__tag"> POSTGRESQL </span>
              </div>
            </div>
          </div>'''
)

# UI UX
html = html.replace(
'''        <div class="heads__section heads__section--face">
          <div class="part part--title face__title"
            data-3800="opacity:0"
            data-5000="opacity:1">
              <h1 class="text--white text--left text--noMargin"> UI UX AND </h1>
              <h1 class="text--white text--left text--noMargin"> 3D DESIGN </h1>
          </div>''',
'''        <div class="heads__section heads__section--face">
          <div class="part part--title face__title"
            data-3800="opacity:0"
            data-5000="opacity:1">
              <h1 class="text--white text--left text--noMargin"> UI UX AND </h1>
              <h1 class="text--white text--left text--noMargin"> 3D DESIGN </h1>
          </div>
          <div class="part section__card"
              data-3800="opacity:0"
              data-5000="opacity:1">
            <div class="tails__section__el tails__feature-card">
              <h2> Immersive Experiences </h2>
              <p>
                High-fidelity prototyping in Figma, interactive 3D experiences with Three.js, and interfaces that
                captivate. We bridge creativity and code.
              </p>
              <div class="tails__tags">
                <span class="tails__tag"> FIGMA </span>
                <span class="tails__tag"> THREE.JS </span>
                <span class="tails__tag"> GSAP </span>
                <span class="tails__tag"> FRAMER MOTION </span>
                <span class="tails__tag"> WEBGL </span>
              </div>
            </div>
          </div>'''
)

# Alphintra Way
html = html.replace(
'''        <div class="heads__section heads__section--rocks">
          <div class="part part--title rocks__title"
            data-5200="opacity:0"
            data-5800="opacity:1">
              <h1 class="text--white text--noMargin"> ALPHINTRA </h1>
              <h1 class="text--white text--noMargin"> WAY </h1>
          </div>''',
'''        <div class="heads__section heads__section--rocks">
          <div class="part part--title rocks__title"
            data-5200="opacity:0"
            data-5800="opacity:1">
              <h1 class="text--white text--noMargin"> ALPHINTRA </h1>
              <h1 class="text--white text--noMargin"> WAY </h1>
          </div>
          <div class="part section__card"
              data-5200="opacity:0"
              data-5800="opacity:1">
            <div class="tails__section__el tails__feature-card">
              <h2> The Alphintra Way </h2>
              <p>
                Discovery -> Design -> Sprint Development -> Deploy. Weekly demos, measurable milestones,
                and production-ready releases with continuous monitoring.
              </p>
              <div class="tails__tags">
                <span class="tails__tag"> DISCOVERY </span>
                <span class="tails__tag"> DESIGN </span>
                <span class="tails__tag"> SPRINT DEV </span>
                <span class="tails__tag"> DEPLOY </span>
              </div>
            </div>
          </div>'''
)

# Remove the old capabilities block
html = re.sub(r'<div class="tails__section tails__section--skills">.*?(?=</div>\s*</div>\s*<div class="trigger"></div>)', "", html, flags=re.DOTALL)

# Insert the style block and sync script at the end of head
style_block = """
  <style>
    /* Desktop */
    html, body {
        overflow-x: hidden;
    }
    .section__card {
        z-index: 100;
        width: 100%;
        max-width: 500px;
        left: unset !important;
        right: 10%;
        top: 30%;
        pointer-events: auto;
    }
    .section__card h2 {
        font-family: 'Raleway', sans-serif;
    }
    .section__card p, .section__card span {
        font-family: 'Raleway', sans-serif;
    }

    @media screen and (min-width: 901px) {
        .heads__sections {
            display: block !important;
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            z-index: 100;
        }
        .heads__section {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        }
        /* Ensure cards and other parts are properly visible without display none */
        .section__card {
            pointer-events: none; /* until faded in */
            opacity: 0 !important;
            transition: opacity 0.4s ease;
            bottom: unset;
            left: unset !important;
            right: 15%;
            top: 25%;
            width: 450px;
        }
        .heads__section.active-3d-card .section__card {
            opacity: 1 !important;
            pointer-events: auto;
        }
    }

    /* Mobile */
    @media screen and (max-width: 900px) {
        .section__card {
            top: auto;
            margin: 40px auto 0 !important;
            position: relative;
            transform: none !important;
            width: 90%;
            left: unset !important;
        }
        .heads__section {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
        }
        .part--title {
            position: relative;
            top: 40px !important;
            left: 0 !important;
            transform: none !important;
            margin-bottom: 20px;
            width: 100%;
            text-align: center;
        }
        .part--title h1 {
            text-align: center !important;
        }
        /* Mobile fixes for text alignments */
        .heads__section--hello .hello__title { margin-top: 150px; top: 0 !important; }
        /* Keep graphical bits, but rely on z-index */
        .part { z-index: 1; }
        .part--title { z-index: 5 !important; }
        .section__card { z-index: 10 !important; }
        .heads { background-color: #050508; }
    }
  </style>
  <script>
    // Desktop 3D cards sync
    setInterval(function(){
      if(window.innerWidth > 900 && window.location.hash) {
         var section = window.location.hash.replace('#/', '');
         var headSections = document.querySelectorAll('.heads__section');
         for (var i=0; i<headSections.length; i++) {
             headSections[i].classList.remove('active-3d-card');
         }
         var target = document.querySelector('.heads__section--' + section);
         if (target) { target.classList.add('active-3d-card'); }
      }
    }, 100);
  </script>
"""
html = html.replace('</head>', style_block + '\n</head>')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(html)

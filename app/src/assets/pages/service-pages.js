(function () {
  var canvas = document.querySelector('.service-page__particles');
  if (!canvas) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = canvas.getContext('2d');
  var ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  var particles = [];
  var sections = [];
  var sectionLinks = [];
  var railLinks = [];
  var raf = null;
  var mouse = {
    x: -1000,
    y: -1000,
    active: false
  };

  function resizeCanvas() {
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function seedParticles() {
    particles = [];
    var area = window.innerWidth * window.innerHeight;
    var count = Math.floor(area / 19000);
    count = Math.max(64, Math.min(150, count));

    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() * 0.36) - 0.18,
        vy: (Math.random() * 0.34) - 0.17,
        r: 0.8 + (Math.random() * 1.3)
      });
    }
  }

  function updateParticles() {
    var linkDistance = 130;
    var mouseRadius = 170;
    var mouseForce = 0.009;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      if (mouse.active) {
        var mdx = mouse.x - p.x;
        var mdy = mouse.y - p.y;
        var md = Math.sqrt((mdx * mdx) + (mdy * mdy));
        if (md < mouseRadius && md > 0.0001) {
          p.vx -= (mdx / md) * mouseForce;
          p.vy -= (mdy / md) * mouseForce;
        }
      }

      p.vx *= 0.995;
      p.vy *= 0.995;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -14) p.x = window.innerWidth + 14;
      if (p.x > window.innerWidth + 14) p.x = -14;
      if (p.y < -14) p.y = window.innerHeight + 14;
      if (p.y > window.innerHeight + 14) p.y = -14;

      ctx.beginPath();
      ctx.fillStyle = 'rgba(246, 248, 255, 0.58)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var p1 = particles[a];
        var p2 = particles[b];
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        var dist = Math.sqrt((dx * dx) + (dy * dy));
        if (dist > linkDistance) continue;
        var alpha = (1 - (dist / linkDistance)) * 0.22;
        ctx.strokeStyle = 'rgba(233, 238, 255,' + alpha.toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }

  function frame() {
    updateParticles();
    raf = window.requestAnimationFrame(frame);
  }

  function headingForSection(section) {
    var heading = section.querySelector('h1, h2, h3');
    if (!heading) return section.id;
    var text = heading.textContent || section.id;
    return text.trim().replace(/\s+/g, ' ');
  }

  function railLabelForSection(section, labelById) {
    var text = labelById[section.id] || headingForSection(section);
    text = (text || section.id).trim().replace(/\s+/g, ' ');
    if (text.length > 24) text = text.slice(0, 24).trim() + '...';
    return text;
  }

  function setupRail(sectionsList, labelById) {
    if (!sectionsList.length) return [];
    var rail = document.createElement('nav');
    rail.className = 'service-rail';
    rail.setAttribute('aria-label', 'Section map');

    for (var i = 0; i < sectionsList.length; i++) {
      var section = sectionsList[i];
      var dot = document.createElement('a');
      dot.className = 'service-rail__button';
      dot.href = '#' + section.id;
      dot.setAttribute('data-target-id', section.id);
      dot.textContent = railLabelForSection(section, labelById);
      rail.appendChild(dot);
    }

    document.body.appendChild(rail);
    return Array.prototype.slice.call(rail.querySelectorAll('.service-rail__button'));
  }

  function setActiveLink(link, active) {
    if (!link) return;
    link.classList.toggle('is-active', active);
  }

  function smoothScrollToSection(id) {
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    var topbar = document.querySelector('.service-topbar');
    var offset = topbar ? topbar.offsetHeight + 22 : 98;
    var targetTop = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth'
    });
  }

  function bindSmoothAnchors() {
    var anchors = Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]'));
    if (!anchors.length) return;
    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (event) {
        var href = anchor.getAttribute('href');
        if (!href || href.length < 2) return;
        var targetId = href.slice(1);
        if (!document.getElementById(targetId)) return;
        event.preventDefault();
        smoothScrollToSection(targetId);
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', '#' + targetId);
        } else {
          window.location.hash = targetId;
        }
      });
    });
  }

  function setupSectionTracking() {
    sectionLinks = Array.prototype.slice.call(document.querySelectorAll('.service-sidebar__nav a[href^="#"]'));
    var labelById = {};
    for (var i = 0; i < sectionLinks.length; i++) {
      var key = sectionLinks[i].getAttribute('href').slice(1);
      labelById[key] = (sectionLinks[i].textContent || key).trim();
    }
    sections = Array.prototype.slice.call(document.querySelectorAll('.service-hero[id], .service-section[id]'));
    if (!sections.length) return;

    railLinks = setupRail(sections, labelById);

    function activateByScroll() {
      var activeId = sections[0].id;
      var anchorY = window.scrollY + 170;

      for (var j = 0; j < sections.length; j++) {
        if (sections[j].offsetTop <= anchorY) {
          activeId = sections[j].id;
        }
      }

      for (var k = 0; k < sectionLinks.length; k++) {
        var linkId = sectionLinks[k].getAttribute('href').slice(1);
        setActiveLink(sectionLinks[k], linkId === activeId);
      }

      for (var n = 0; n < railLinks.length; n++) {
        var railId = railLinks[n].getAttribute('data-target-id');
        setActiveLink(railLinks[n], railId === activeId);
      }
    }

    window.addEventListener('scroll', activateByScroll, { passive: true });
    activateByScroll();
  }

  window.addEventListener('mousemove', function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', function () {
    mouse.active = false;
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener('resize', function () {
    resizeCanvas();
    seedParticles();
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (raf) window.cancelAnimationFrame(raf);
      raf = null;
      return;
    }
    if (!reduceMotion && !raf) frame();
  });

  resizeCanvas();
  seedParticles();
  setupSectionTracking();
  bindSmoothAnchors();

  if (!reduceMotion) {
    frame();
  } else {
    updateParticles();
  }
})();

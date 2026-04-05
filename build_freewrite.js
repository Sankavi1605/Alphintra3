const fs = require('fs');

let c = fs.readFileSync('app/src/project-freewrite.html', 'utf8');

c = c.replace(/CipherLux/g, 'Free Write');
c = c.replace(/Institutional AI Operating Engine/g, 'The Ultimate Creative Flow for Writers and Readers');
c = c.replace(/We engineered a deterministic event bus and multi-model inference pipeline\./g, 'We built an intuitive platform where creative writing meets community engagement and e-commerce.');

c = c.replace(/Operating at scale, CipherLux combines sub-millisecond market feeds with predictive compliance flags\./g, 'This video provides a complete walkthrough of the Free Write platform, highlighting its key features and user experience. Explore a wide range of books, read and publish stories, and connect with a vibrant creative community.');
c = c.replace(/Users can model complex derivative scenarios and let the system autonomously route trades through verified liquidity venues while maintaining absolute cryptographic logs\./g, 'Users can participate in writing competitions, browse designer cover pages, and even create spin-offs inspired by existing works. The platform also includes seamless features for managing profiles, orders, shopping carts, and secure payments. Whether you\'re an aspiring writer, an avid reader, or a creative designer, Free Write offers everything you need to create, share, and succeed in one place.');

// Update KPIs
c = c.replace(/<p class="project-kpi__label">Production APIs<\/p>[\s\S]*?<p class="project-kpi__value">120\+<\/p>/, '<p class="project-kpi__label">Writers joined</p>\n              <p class="project-kpi__value">10K+</p>');
c = c.replace(/<p class="project-kpi__label">Daily Events<\/p>[\s\S]*?<p class="project-kpi__value">15M\+<\/p>/, '<p class="project-kpi__label">Original Stories</p>\n              <p class="project-kpi__value">8.5K</p>');
c = c.replace(/<p class="project-kpi__label">Release Cadence<\/p>[\s\S]*?<p class="project-kpi__value">Weekly<\/p>/, '<p class="project-kpi__label">Active Readers</p>\n              <p class="project-kpi__value">Monthly</p>');

// Try to use a better image logic. Let's just point to /app/public/img/qubitz/UIUXHero.jpg
c = c.replace(/src="\/app\/public\/img\/qubitz\/AIHero.jpg"/g, 'src="/app/public/img/qubitz/digitalMarketingHero.jpg"');
c = c.replace(/src="\/app\/public\/img\/qubitz\/ERPCRMhero.jpg"/g, 'src="/app/public/img/qubitz/UIUXHero.jpg"');

fs.writeFileSync('app/src/project-freewrite.html', c);
console.log('Project HTML generated');

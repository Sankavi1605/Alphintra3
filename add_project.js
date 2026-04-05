const fs = require('fs');

let c = fs.readFileSync('app/src/index.html', 'utf8');

// 1. Insert the new project into the our-work-grid at data-index="1"
// Update other data-index values from 1,2,3 to 2,3,4.
c = c.replace('data-index="3"', 'data-index="4"');
c = c.replace('data-index="2"', 'data-index="3"');
c = c.replace('data-index="1"', 'data-index="2"');

const newProjectHTML = `
    <article class="our-work-item" data-index="1">
      <div class="our-work-item__media">
        <!-- Placeholder image, replace with actual Free Write image later if needed -->
        <img src="/app/public/img/qubitz/UIUXHero.jpg" alt="Free Write" />
        <span class="our-work-item__tag">Platform & Community</span>
      </div>
      <div class="our-work-item__content">
        <h3 class="our-work-item__title">Free Write</h3>
        <p class="our-work-item__excerpt">An all-in-one creative platform where writers, readers, and designers come together to share, explore, and grow.</p>
        <span class="our-work-item__link">View Details <i class="icon-arrow-right"></i></span>
      </div>
    </article>
`;

// Insert after the first article (CipherLux)
c = c.replace(/(<\/article>\s*)(<article class="our-work-item" data-index="2">)/, '$1' + newProjectHTML + '$2');

// 2. Update detailData in script
c = c.replace('3:', '4:');
c = c.replace('2:', '3:');
c = c.replace('1:', '2:');

const newDetailData = `
          1: {
            url: '/project-freewrite.html',
            description: 'Discover Free Write – an all-in-one creative platform where writers, readers, and designers come together to share, explore, and grow. From publishing original stories to joining exciting competitions and discovering unique book covers, Free Write brings creativity to life.',
            points: [
              {
                title: 'Story Publishing',
                text: 'Easily write and publish your own original stories or spin-offs inspired by existing works.'
              },
              {
                title: 'Vibrant Community',
                text: 'Connect with a vast network of avid readers, talented writers, and creative designers.'
              },
              {
                title: 'Competitions',
                text: 'Participate in exciting writing competitions to showcase your skills.'
              },
              {
                title: 'E-commerce Integration',
                text: 'Manage profiles, orders, shopping carts, and secure payments directly on the platform.'
              }
            ],
            images: [
              { src: '/app/public/img/qubitz/digitalMarketingHero.jpg', alt: 'Free Write interface', caption: 'Creative platform and reading interface.' },
              { src: '/app/public/img/qubitz/UIUXHero.jpg', alt: 'Free Write book covers', caption: 'Designer book covers and e-commerce flow.' }
            ]
          },
`;

c = c.replace(/(0: \{[\s\S]*?},\s*)(2: {)/, '$1' + newDetailData + '$2');

fs.writeFileSync('app/src/index.html', c);
console.log('index.html updated successfully');

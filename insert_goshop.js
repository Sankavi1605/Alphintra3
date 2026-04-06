const fs = require('fs');
let content = fs.readFileSync('app/src/index.html', 'utf8');

const goShopHtml = `
              <div class="our-work-card" data-work-card="2" aria-hidden="true">
                <div class="our-work-card__media our-work-card__media--goshop" style="background-image: url('/app/public/img/qubitz/UIUXHero.jpg');"></div>
                <p class="our-work-card__index"> 03 </p>
                <h2> GoShop </h2>
                <p class="our-work-card__subtitle"> Modern E-Commerce Platform </p>
                <p>
                  Discover curated apparel across Men, Women, and Kids collections with a fast and seamless shopping flow.
                  Filter, sort, and order your favorite outfits with ease.
                </p>
                <div class="tails__tags">
                  <span class="tails__tag"> REACT </span>
                  <span class="tails__tag"> NODE.JS </span>
                  <span class="tails__tag"> E-COMMERCE </span>
                </div>
                <div class="our-work-card__actions">
                  <button class="our-work-card__button" type="button" data-work-detail-open> View Detail </button>
                </div>
              </div>
`;

// Insert correctly:
const splitPointText = `<div class="our-work-card" data-work-card="2" aria-hidden="true">`;
if (content.includes(splitPointText)) {
    // Modify existing PulsesOps card
    content = content.replace(
        '<div class="our-work-card" data-work-card="2" aria-hidden="true">',
        goShopHtml + '\n' + '              <div class="our-work-card" data-work-card="3" aria-hidden="true">'
    );
    // Also bump PulseOps index from 03 to 04
    content = content.replace(
        '                <div class="our-work-card__media our-work-card__media--nexus"></div>\n                <p class="our-work-card__index"> 03 </p>',
        '                <div class="our-work-card__media our-work-card__media--nexus"></div>\n                <p class="our-work-card__index"> 04 </p>'
    );
}

// Update detailData logic
const goShopDetails = `2: {
            url: '/project-goshop.html',
            description: 'GoShop is a premium e-commerce platform offering a curated selection of apparel. Discover seamless shopping with advanced filtering by category, size, and price. Manage your cart, track processing and paid orders, and find everyday confidence.',
            points: [
              {
                title: 'Curated Collections',
                text: 'Shop across dedicated Men, Women, and Kids categories with over 20+ premium products.'
              },
              {
                title: 'Advanced Filtering',
                text: 'Easily navigate the catalog using size, category, and dynamic price range filters, or sort by newest arrivals.'
              },
              {
                title: 'Product Customization',
                text: 'Detailed product pages with selectable sizes, colors, and live quantity tracking.'
              },
              {
                title: 'Fast Checkout Experience',
                text: 'A streamlined checkout flow keeping track of cart items and customer order history securely.'
              }
            ],
            images: [
              { src: '/app/public/img/qubitz/UIUXHero.jpg', alt: 'GoShop storefront', caption: 'Modern e-commerce landing page with core collections.' },
              { src: '/app/public/img/qubitz/digitalMarketingHero.jpg', alt: 'GoShop products', caption: 'Advanced filtering and sorting product grid.' }
            ]
          },
          3: {`;

content = content.replace(
    '2: {',
    goShopDetails
);


fs.writeFileSync('app/src/index.html', content);
console.log('Update script completed.');

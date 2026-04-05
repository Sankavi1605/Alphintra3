const fs = require('fs');

let c = fs.readFileSync('app/src/index.html', 'utf8');

c = c.replace(
    /\.our-work-detail__inline-back {\s*display: inline-flex;\s*align-items: center;\s*justify-content: center;\s*position: absolute;\s*top: 10px;\s*left: 10px;/g,
    `.our-work-detail__inline-back {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin-bottom: 12px;
      /* top/left removed */`
);

c = c.replace(
    /padding: 12px 14px;\s*border-radius: 0;\s*border: 0;/g,
    `padding: 32px 40px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);`
);

c = c.replace(
    /font-size: 0\.82rem;\s*letter-spacing: 0\.12em;/g,
    `font-size: 0.95rem;
      letter-spacing: 0.1em;
      margin-bottom: 8px;`
);

c = c.replace(
    /font-size: clamp\(30px, 3\.6vw, 58px\);/g,
    `font-size: clamp(40px, 4.5vw, 72px);`
);

c = c.replace(
    /color: rgba\(224, 235, 253, 0\.9\);\s*line-height: 1\.28;\s*font-size: 0\.82rem;/g,
    `color: rgba(224, 235, 253, 0.9);
      line-height: 1.6;
      font-size: 1.1rem;
      margin-bottom: 24px;`
);

c = c.replace(
    /font-size: 0\.8rem;/g,
    `font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 6px;`
);

c = c.replace(
    /color: rgba\(214, 228, 250, 0\.84\);\s*line-height: 1\.22;\s*font-size: 0\.72rem;/g,
    `color: rgba(214, 228, 250, 0.84);
      line-height: 1.5;
      font-size: 1rem;`
);

// Update grid template columns for better space
c = c.replace(
    /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\);\s*gap: 6px;/g,
    `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;`
);

// Actions
c = c.replace(
    /\.our-work-detail__actions {\s*display: flex;\s*flex-wrap: wrap;\s*align-items: center;\s*gap: 6px;\s*margin-top: 0;/g,
    `.our-work-detail__actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
      margin-bottom: 24px;`
);

// Update smaller buttons in detail view so they are readable nicely
c = c.replace(
    /\.our-work-detail__action {\s*display: inline-flex;\s*align-items: center;\s*justify-content: center;\s*min-height: 30px;\s*padding: 0 16px;\s*border-radius: 999px;\s*border: 1px solid rgba\(191, 214, 255, 0\.4\);\s*background: linear-gradient\(180deg, rgba\(255, 255, 255, 0\.12\) 0%, rgba\(255, 255, 255, 0\.02\) 100%\);\s*color: #fff;\s*font-family: inherit;\s*font-size: 9px;\s*letter-spacing: 0\.18em;/g,
    `.our-work-detail__action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 36px;
      padding: 0 20px;
      border-radius: 999px;
      border: 1px solid rgba(191, 214, 255, 0.4);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%);
      color: #fff;
      font-family: inherit;
      font-size: 11px;
      letter-spacing: 0.14em;`
);

fs.writeFileSync('app/src/index.html', c);
console.log('Fonts and alignment completely cleaned up.');

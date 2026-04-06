const fs = require('fs');

let content = fs.readFileSync('app/src/index.html', 'utf8');

const calendlyScript = `
              <!-- Calendly link widget begin -->
              <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
              <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
              <a class="tails__link" href="" onclick="Calendly.initPopupWidget({url: 'https://calendly.com/sankavi-it/30min'});return false;"> Schedule a Call </a>
              <!-- Calendly link widget end -->
`;

content = content.replace(
    '<a class="tails__link" href="mailto:contact@alphintra.com"> Get in Touch </a>',
    '<a class="tails__link" href="mailto:contact@alphintra.com" style="margin-right:10px;"> Get in Touch </a>\n' + calendlyScript
);

fs.writeFileSync('app/src/index.html', content);
console.log('Calendly widget integrated!');

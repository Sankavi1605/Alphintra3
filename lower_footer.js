const fs = require('fs');
let c = fs.readFileSync('app/src/index.html', 'utf8');

let newPadding = 'padding: 15px 40px 10px;';
c = c.replace(/padding: 20px 40px 10px;/g, newPadding);
c = c.replace(/padding: 30px 40px 20px;/g, newPadding);

c = c.replace(/font-size: 24px;/g, 'font-size: 18px;');
c = c.replace(/margin-bottom: 12px;/g, 'margin-bottom: 6px;');
c = c.replace(/margin-bottom: 10px;/g, 'margin-bottom: 0px;');
c = c.replace(/>Empowering digital experiences through advanced AI, Web, Mobile, and 3D engineering.</g, ` style="max-width: 250px;">Empowering digital experiences through advanced AI, Web, Mobile, and 3D engineering.<`);
c = c.replace(/gap: 20px;/g, 'gap: 10px;');
c = c.replace(/font-size: 14px;/g, 'font-size: 12px;');
c = c.replace(/font-size: 16px;/g, 'font-size: 14px;');
c = c.replace(/margin: 30px auto 0;/g, 'margin: 15px auto 0;');
c = c.replace(/padding-top: 25px;/g, 'padding-top: 15px;');

fs.writeFileSync('app/src/index.html', c);

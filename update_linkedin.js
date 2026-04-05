const fs = require('fs');
const glob = require('glob');

const files = glob.sync('{*.html,app/src/*.html}');
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let o = c;

  // Replace LinkedIn link in footer
  c = c.replace(/<a href="#"[^>]*>LinkedIn<\/a>/g, '<a href="https://www.linkedin.com/company/alphintra/posts/?feedView=all" target="_blank" style="color:#aaa; text-decoration:none; font-size: 15px;">LinkedIn</a>');

  if (c !== o) {
    fs.writeFileSync(f, c);
    console.log('Updated LinkedIn URL in: ' + f);
  }
});

const fs = require('fs');
let content = fs.readFileSync('app/src/index.html', 'utf8');

const imageMapping = {
  'About Alphintra': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Why Alphintra': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'High-Performance Web': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Delivery, Security': 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'AI &amp; Intelligent System': 'https://images.unsplash.com/photo-1677442136019-21780ec69eb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'AI Ops': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Startup Launch': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Growth &amp; Enterprise': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Enterprise Backend': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Cloud Infrastructure': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Immersive UI/UX': 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Interactive 3D': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'The Alphintra Way: Discovery': 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'The Alphintra Way: Sprint': 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Built by Makers': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Engineering Partner': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Execution Model': 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Let&apos;s Build': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
};

Object.keys(imageMapping).forEach(key => {
    let replaced = false;
    let occurrences = 0;
    
    // search for the key string
    let idx = 0;
    while((idx = content.indexOf(key, idx)) !== -1) {
        let beforeIdx = content.lastIndexOf('<div class="tails__feature-svg">', idx);
        let divEnd = content.indexOf('</div>', beforeIdx);
        let h2Start = content.lastIndexOf('<h2', idx);

        if (beforeIdx !== -1 && divEnd !== -1 && h2Start !== -1) {
            // ensure they're somewhat close
            if ((idx - beforeIdx) < 800) {
                let replacement = `<img src="${imageMapping[key]}" alt="Feature Image" class="tails__feature-image" />`;
                content = content.substring(0, beforeIdx) + replacement + content.substring(divEnd + 6);
                replaced = true;
                occurrences++;
                idx = beforeIdx + replacement.length;
            } else {
                idx += key.length;
            }
        } else {
            idx += key.length;
        }
    }
    console.log(`Restored image for ${key} - ${replaced} (${occurrences} occurrences)`);
});

fs.writeFileSync('app/src/index.html', content);
console.log('Restoration Done!');

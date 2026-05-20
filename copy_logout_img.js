const fs = require('fs');
const src = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\18180297-ed4e-46e5-8fb1-821c1dbbc504\\media__1772226634069.png';
const dest1 = 'c:\\Users\\HP\\Desktop\\campusflow2\\frontend\\public\\logout-hero.png';
const dest2 = 'c:\\Users\\HP\\Desktop\\campusflow2\\frontend\\src\\assets\\images\\logout-hero.png';

if (!fs.existsSync(src)) {
    console.error('SOURCE NOT FOUND: ' + src);
    process.exit(1);
}
const data = fs.readFileSync(src);
fs.writeFileSync(dest1, data);
fs.writeFileSync(dest2, data);
console.log('SUCCESS: copied ' + data.length + ' bytes to both destinations');

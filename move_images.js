const fs = require('fs');
const path = require('path');

const files = [
    { src: 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\18180297-ed4e-46e5-8fb1-821c1dbbc504\\media__1772224794176.jpg', dest: 'c:\\Users\\HP\\Desktop\\campusflow2\\frontend\\public\\login-bg.jpg' },
    { src: 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\ee12fc47-ff2d-4a58-98fe-bb6087be186e\\media__1772209853659.jpg', dest: 'c:\\Users\\HP\\Desktop\\campusflow2\\frontend\\public\\blue-header.jpg' }
];

files.forEach(f => {
    try {
        if (fs.existsSync(f.src)) {
            const data = fs.readFileSync(f.src);
            fs.writeFileSync(f.dest, data);
            console.log(`Copied ${f.src} to ${f.dest} (${data.length} bytes)`);
        } else {
            console.error(`Source not found: ${f.src}`);
        }
    } catch (e) {
        console.error(`Error copying ${f.src}:`, e);
    }
});

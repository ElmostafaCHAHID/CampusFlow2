const fs = require('fs');
const src = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\18180297-ed4e-46e5-8fb1-821c1dbbc504\\media__1772224794176.jpg';
const dest = 'c:\\Users\\HP\\Desktop\\campusflow2\\frontend\\public\\login-bg.jpg';
try {
    fs.copyFileSync(src, dest);
    console.log('SUCCESS');
} catch (e) {
    console.error('FAILURE: ' + e.message);
}

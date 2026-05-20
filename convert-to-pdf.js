const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const marked = require('marked');

async function convertMarkdownToPDF() {
  try {
    // Read the markdown file
    const markdownPath = path.join(__dirname, 'PFE_REPORT_CAMPUSFLOW.md');
    const markdown = fs.readFileSync(markdownPath, 'utf8');
    
    // Convert markdown to HTML
    const html = marked.parse(markdown);
    
    // Create a styled HTML document
    const styledHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CampusFlow PFE Report</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: white;
            padding: 20px;
            max-width: 900px;
            margin: 0 auto;
          }
          
          h1 {
            font-size: 2.5em;
            margin: 40px 0 20px 0;
            color: #1a5490;
            border-bottom: 3px solid #1a5490;
            padding-bottom: 10px;
            page-break-after: avoid;
          }
          
          h2 {
            font-size: 2em;
            margin: 30px 0 15px 0;
            color: #2a73b4;
            page-break-after: avoid;
          }
          
          h3 {
            font-size: 1.5em;
            margin: 20px 0 10px 0;
            color: #3a83c4;
            page-break-after: avoid;
          }
          
          h4 {
            font-size: 1.2em;
            margin: 15px 0 8px 0;
            color: #4a93d4;
            page-break-after: avoid;
          }
          
          p {
            margin-bottom: 15px;
            text-align: justify;
          }
          
          ul, ol {
            margin-left: 30px;
            margin-bottom: 15px;
          }
          
          li {
            margin-bottom: 8px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            page-break-inside: avoid;
          }
          
          table th {
            background-color: #1a5490;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
          }
          
          table td {
            border: 1px solid #ddd;
            padding: 12px;
          }
          
          table tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          
          table tr:hover {
            background-color: #f0f0f0;
          }
          
          code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.95em;
          }
          
          pre {
            background-color: #f4f4f4;
            border-left: 4px solid #1a5490;
            padding: 15px;
            margin: 20px 0;
            overflow-x: auto;
            border-radius: 4px;
            page-break-inside: avoid;
          }
          
          pre code {
            background-color: transparent;
            padding: 0;
            border-radius: 0;
          }
          
          blockquote {
            border-left: 4px solid #1a5490;
            margin-left: 0;
            padding-left: 20px;
            color: #666;
            font-style: italic;
            margin: 20px 0;
          }
          
          img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 20px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            page-break-inside: avoid;
          }
          
          a {
            color: #1a5490;
            text-decoration: none;
          }
          
          a:hover {
            text-decoration: underline;
          }
          
          hr {
            border: none;
            border-top: 2px solid #1a5490;
            margin: 40px 0;
            page-break-after: avoid;
          }
          
          strong {
            font-weight: 600;
            color: #1a5490;
          }
          
          em {
            font-style: italic;
            color: #555;
          }
          
          .page-break {
            page-break-after: always;
          }
          
          @media print {
            body {
              padding: 0;
            }
            
            h1, h2, h3 {
              page-break-after: avoid;
            }
            
            p, li {
              page-break-inside: avoid;
            }
            
            table {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;
    
    // Save intermediate HTML for debugging if needed
    fs.writeFileSync(path.join(__dirname, 'report-temp.html'), styledHtml);
    
    console.log('Converting markdown to PDF...');
    console.log('This may take a minute...');
    
    // Try to use puppeteer if available, otherwise use a different approach
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setContent(styledHtml, { waitUntil: 'networkidle0' });
      
      const pdfPath = path.join(__dirname, 'PFE_REPORT_CAMPUSFLOW.pdf');
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        },
        printBackground: true,
        scale: 0.9
      });
      
      await browser.close();
      
      console.log(`✅ PDF created successfully: ${pdfPath}`);
      console.log(`📄 File size: ${(fs.statSync(pdfPath).size / 1024).toFixed(2)} KB`);
      
      // Clean up temp file
      fs.unlinkSync(path.join(__dirname, 'report-temp.html'));
      
    } catch (puppeteerError) {
      console.log('⚠️  Puppeteer not available, trying alternative method...');
      console.log('Please install puppeteer or use an online PDF converter.');
      console.log('Command: npm install puppeteer');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error during conversion:', error.message);
    process.exit(1);
  }
}

convertMarkdownToPDF();

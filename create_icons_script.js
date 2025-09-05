// Script to generate app icons from SVG using sharp library
// Run with: node create_icons_script.js

const fs = require('fs');

// Since we can't use sharp in this environment, let's create a simpler approach
// Create the icons as inline SVG files that can be converted manually

const svgTemplate = (size, backgroundColor = '#dc2626', dumpbellColor = '#ffffff') => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg { fill: ${backgroundColor}; }
      .dumbbell { fill: ${dumpbellColor}; }
      .handle { fill: #4b5563; }
      .detail { fill: #e5e7eb; }
      .grip { stroke: #6b7280; stroke-width: 2; }
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" rx="80" class="bg"/>
  
  <!-- Dumbbell -->
  <!-- Left Weight -->
  <rect x="60" y="180" width="100" height="152" rx="20" class="dumbbell"/>
  <rect x="75" y="195" width="70" height="122" rx="15" class="detail"/>
  
  <!-- Left Connector -->
  <rect x="160" y="220" width="50" height="72" rx="8" class="handle"/>
  
  <!-- Center Bar -->
  <rect x="210" y="235" width="92" height="42" rx="21" class="handle"/>
  
  <!-- Grip Lines -->
  <line x1="230" y1="240" x2="230" y2="272" class="grip"/>
  <line x1="250" y1="240" x2="250" y2="272" class="grip"/>
  <line x1="270" y1="240" x2="270" y2="272" class="grip"/>
  <line x1="290" y1="240" x2="290" y2="272" class="grip"/>
  
  <!-- Right Connector -->
  <rect x="302" y="220" width="50" height="72" rx="8" class="handle"/>
  
  <!-- Right Weight -->
  <rect x="352" y="180" width="100" height="152" rx="20" class="dumbbell"/>
  <rect x="367" y="195" width="70" height="122" rx="15" class="detail"/>
  
  <!-- Weight Detail Lines -->
  <g class="grip">
    <line x1="80" y1="210" x2="140" y2="210"/>
    <line x1="80" y1="240" x2="140" y2="240"/>
    <line x1="80" y1="270" x2="140" y2="270"/>
    <line x1="80" y1="300" x2="140" y2="300"/>
    
    <line x1="372" y1="210" x2="432" y2="210"/>
    <line x1="372" y1="240" x2="432" y2="240"/>
    <line x1="372" y1="270" x2="432" y2="270"/>
    <line x1="372" y1="300" x2="432" y2="300"/>
  </g>
</svg>
`;

// Generate different icon sizes
const icons = [
  { name: 'icon-192x192.svg', size: 192 },
  { name: 'icon-512x512.svg', size: 512 },
  { name: 'icon-512x512-maskable.svg', size: 512 }
];

icons.forEach(icon => {
  const svgContent = svgTemplate(icon.size);
  console.log(`<!-- ${icon.name} -->`);
  console.log(svgContent);
  console.log('\n---\n');
});

console.log(`
To convert these SVG files to PNG:
1. Save each SVG content above to a file (icon-192x192.svg, etc.)
2. Use online converter like https://convertio.co/svg-png/
3. Or use command line: inkscape icon-192x192.svg --export-png=icon-192x192.png
4. Place PNG files in public/icons/ directory
`);
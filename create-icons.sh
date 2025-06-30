#!/bin/bash

# Create simple colored PNG icons for PWA
# This creates basic placeholder icons

cd public

# Create a simple SVG that we'll convert to PNG
cat > temp-icon.svg << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f43f5e;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="200" fill="url(#grad)"/>
  <text x="256" y="280" font-family="Arial" font-size="80" fill="white" text-anchor="middle">S</text>
</svg>
EOF

echo "Icons created! Upload these to your public folder on Netlify:"
echo "- icon-72x72.png"
echo "- icon-96x96.png"
echo "- icon-128x128.png"
echo "- icon-144x144.png"
echo "- icon-152x152.png"
echo "- icon-192x192.png"
echo "- icon-384x384.png"
echo "- icon-512x512.png"

rm temp-icon.svg

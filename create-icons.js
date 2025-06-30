const fs = require('fs');
const { createCanvas } = require('canvas');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Creating default PWA icons...');

sizes.forEach(size => {
    try {
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, '#ec4899'); // Pink theme color
        gradient.addColorStop(1, '#f472b6');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.floor(size/6)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SS', size/2, size/2);
        
        // Save to file
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(`public/icon-${size}x${size}.png`, buffer);
        console.log(`Created icon-${size}x${size}.png`);
    } catch (error) {
        console.log(`Skipping canvas approach for size ${size}, will use alternative method`);
    }
});

console.log('Icon creation complete!');

const { generateFractal, parseParams } = require('./_utils');
const PImage = require('pureimage');

module.exports = async (req, res) => {
    try {
        const params = parseParams(req.query);
        const img = generateFractal(params);
        
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'no-cache');
        
        // Encode to PNG buffer
        const chunks = [];
        const stream = PImage.encodePNGToStream(img);
        
        stream.on('data', (chunk) => {
            chunks.push(chunk);
        });
        
        stream.on('end', () => {
            const buffer = Buffer.concat(chunks);
            res.status(200).send(buffer);
        });
        
        stream.on('error', (error) => {
            console.error('Error encoding PNG:', error);
            res.status(500).send('Failed to encode image');
        });
    } catch (error) {
        console.error('Error generating fractal:', error);
        res.status(500).send('Failed to generate fractal');
    }
};

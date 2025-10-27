const { generateFractal, parseParams } = require('./_utils');
const PImage = require('pureimage');

module.exports = async (req, res) => {
    try {
        const params = parseParams(req.query);
        const img = generateFractal(params);
        
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'no-cache');
        
        // Create a promise-based PNG encoder
        const encodePNG = (image) => {
            return new Promise((resolve, reject) => {
                const chunks = [];
                const stream = PImage.encodePNGToStream(image);
                
                stream.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                
                stream.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
                
                stream.on('error', (error) => {
                    reject(error);
                });
            });
        };
        
        const buffer = await encodePNG(img);
        return res.status(200).send(buffer);
        
    } catch (error) {
        console.error('Error generating fractal:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({ 
            error: 'Failed to generate fractal',
            message: error.message 
        });
    }
};

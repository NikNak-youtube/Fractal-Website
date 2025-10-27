const { generateFractal, parseParams } = require('./_utils');

module.exports = async (req, res) => {
    try {
        const params = parseParams(req.query);
        const canvas = generateFractal(params);
        
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'no-cache');
        
        const buffer = canvas.toBuffer('image/png');
        res.status(200).send(buffer);
    } catch (error) {
        console.error('Error generating fractal:', error);
        res.status(500).send('Failed to generate fractal');
    }
};

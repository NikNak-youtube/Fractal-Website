module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    return res.status(200).json({
        message: 'Fractal Generator API is running!',
        status: 'healthy'
    });
};

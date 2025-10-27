const PImage = require('pureimage');

// Complex number operations
class Complex {
    constructor(real, imag) {
        this.real = real;
        this.imag = imag;
    }

    multiply(other) {
        return new Complex(
            this.real * other.real - this.imag * other.imag,
            this.real * other.imag + this.imag * other.real
        );
    }

    add(other) {
        return new Complex(
            this.real + other.real,
            this.imag + other.imag
        );
    }

    normSquared() {
        return this.real * this.real + this.imag * this.imag;
    }
}

// Mandelbrot iterations
function mandelbrotIterations(c, maxIter) {
    let z = new Complex(0, 0);
    for (let i = 0; i < maxIter; i++) {
        if (z.normSquared() > 4.0) {
            return i;
        }
        z = z.multiply(z).add(c);
    }
    return maxIter;
}

// Julia iterations
function juliaIterations(z, c, maxIter) {
    for (let i = 0; i < maxIter; i++) {
        if (z.normSquared() > 4.0) {
            return i;
        }
        z = z.multiply(z).add(c);
    }
    return maxIter;
}

// Color scheme functions
function colorFromIterations(iterations, maxIter, colorScheme) {
    if (iterations === maxIter) {
        return { r: 0, g: 0, b: 0 };
    }

    const t = iterations / maxIter;

    switch (colorScheme) {
        case 'classic':
            return {
                r: Math.floor(255 * (0.5 * (1 + Math.cos(t * 6.28)))),
                g: Math.floor(255 * t),
                b: Math.floor(255 * (0.5 * (1 + Math.sin(t * 6.28))))
            };
        case 'fire':
            return {
                r: Math.floor(255 * t),
                g: Math.floor(255 * t * t),
                b: Math.floor(255 * t * t * t)
            };
        case 'ocean':
            return {
                r: Math.floor(255 * t * t),
                g: Math.floor(255 * t),
                b: Math.floor(255 * (0.5 * (1 + t)))
            };
        default:
            const intensity = Math.floor(255 * t);
            return { r: intensity, g: intensity, b: intensity };
    }
}

// L-System presets
function getLSystemPresets() {
    return {
        tree: {
            axiom: 'F',
            rules: { 'F': 'F[+F]F[-F]F' },
            angle: 25.0
        },
        dragon: {
            axiom: 'FX',
            rules: { 'X': 'X+YF+', 'Y': '-FX-Y' },
            angle: 90.0
        },
        sierpinski: {
            axiom: 'F-G-G',
            rules: { 'F': 'F-G+F+G-F', 'G': 'GG' },
            angle: 120.0
        },
        koch: {
            axiom: 'F',
            rules: { 'F': 'F+F-F-F+F' },
            angle: 90.0
        },
        plant: {
            axiom: 'X',
            rules: { 'X': 'F+[[X]-X]-F[-FX]+X', 'F': 'FF' },
            angle: 25.0
        },
        fractal_plant: {
            axiom: 'F',
            rules: { 'F': 'F[+F]F[-F][F]' },
            angle: 20.0
        }
    };
}

// Generate L-system string
function generateLSystemString(lsystem, iterations) {
    let current = lsystem.axiom;

    for (let iter = 0; iter < iterations; iter++) {
        let next = '';
        for (const c of current) {
            if (lsystem.rules[c]) {
                next += lsystem.rules[c];
            } else {
                next += c;
            }
        }
        current = next;
    }

    return current;
}

// Turtle graphics class
class TurtleGraphics {
    constructor(stepSize) {
        this.lines = [];
        this.stateStack = [];
        this.currentState = { x: 0, y: 0, angle: 90 };
        this.stepSize = stepSize;
    }

    forward() {
        const rad = this.currentState.angle * Math.PI / 180;
        const newX = this.currentState.x + this.stepSize * Math.cos(rad);
        const newY = this.currentState.y + this.stepSize * Math.sin(rad);

        this.lines.push({
            x1: this.currentState.x,
            y1: this.currentState.y,
            x2: newX,
            y2: newY
        });

        this.currentState.x = newX;
        this.currentState.y = newY;
    }

    turnLeft(angle) {
        this.currentState.angle += angle;
    }

    turnRight(angle) {
        this.currentState.angle -= angle;
    }

    pushState() {
        this.stateStack.push({ ...this.currentState });
    }

    popState() {
        if (this.stateStack.length > 0) {
            this.currentState = this.stateStack.pop();
        }
    }

    interpretLSystem(lsystemString, angle) {
        for (const c of lsystemString) {
            switch (c) {
                case 'F':
                case 'G':
                    this.forward();
                    break;
                case '+':
                    this.turnLeft(angle);
                    break;
                case '-':
                    this.turnRight(angle);
                    break;
                case '[':
                    this.pushState();
                    break;
                case ']':
                    this.popState();
                    break;
            }
        }
    }

    getBounds() {
        if (this.lines.length === 0) {
            return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        }

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        for (const line of this.lines) {
            minX = Math.min(minX, line.x1, line.x2);
            maxX = Math.max(maxX, line.x1, line.x2);
            minY = Math.min(minY, line.y1, line.y2);
            maxY = Math.max(maxY, line.y1, line.y2);
        }

        return { minX, minY, maxX, maxY };
    }
}

// Parse custom L-system rules
function parseCustomRules(rulesString) {
    const rules = {};
    for (const line of rulesString.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const parts = trimmed.split('=');
        if (parts.length === 2) {
            const left = parts[0].trim();
            const right = parts[1].trim();
            if (left.length > 0) {
                rules[left[0]] = right;
            }
        }
    }
    return rules;
}

// Generate L-system fractal
function generateLSystemFractal(params) {
    const { width, height, zoom, centerX, centerY, colorScheme, 
            lsystemPreset, lsystemIterations, lsystemAngle,
            customAxiom, customRules } = params;

    const presets = getLSystemPresets();
    let lsystem;

    if (lsystemPreset === 'custom' && customRules) {
        lsystem = {
            axiom: customAxiom || 'F',
            rules: parseCustomRules(customRules),
            angle: lsystemAngle
        };
    } else {
        lsystem = presets[lsystemPreset] || presets.tree;
    }

    const angle = lsystemAngle !== 25 ? lsystemAngle : lsystem.angle;
    const lsystemString = generateLSystemString(lsystem, lsystemIterations);

    const turtle = new TurtleGraphics(10.0);
    turtle.interpretLSystem(lsystemString, angle);

    const bounds = turtle.getBounds();
    const boundsWidth = bounds.maxX - bounds.minX;
    const boundsHeight = bounds.maxY - bounds.minY;

    if (boundsWidth === 0 || boundsHeight === 0) {
        const img = PImage.make(width, height);
        const ctx = img.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        return img;
    }

    const scaleX = (width - 40) / boundsWidth * zoom;
    const scaleY = (height - 40) / boundsHeight * zoom;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (width / 2) - (boundsWidth * scale / 2) - (bounds.minX * scale) + centerX * 50;
    const offsetY = (height / 2) - (boundsHeight * scale / 2) - (bounds.minY * scale) + centerY * 50;

    const img = PImage.make(width, height);
    const ctx = img.getContext('2d');
    
    // Fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Determine line color
    let lineColor;
    switch (colorScheme) {
        case 'fire':
            lineColor = 'rgb(255, 100, 0)';
            break;
        case 'ocean':
            lineColor = 'rgb(0, 100, 255)';
            break;
        case 'classic':
            lineColor = 'rgb(0, 150, 0)';
            break;
        default:
            lineColor = 'black';
    }

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;

    // Draw lines
    ctx.beginPath();
    for (let i = 0; i < turtle.lines.length; i++) {
        const line = turtle.lines[i];
        const screenX1 = line.x1 * scale + offsetX;
        const screenY1 = line.y1 * scale + offsetY;
        const screenX2 = line.x2 * scale + offsetX;
        const screenY2 = line.y2 * scale + offsetY;

        ctx.moveTo(screenX1, screenY1);
        ctx.lineTo(screenX2, screenY2);
    }
    ctx.stroke();

    return img;
}

// Generate mathematical fractal (Mandelbrot or Julia)
function generateMathematicalFractal(params) {
    const { width, height, zoom, centerX, centerY, maxIter, 
            fractalType, juliaCReal, juliaCImag, colorScheme } = params;

    const scale = 4.0 / (zoom * Math.min(width, height));
    
    const img = PImage.make(width, height);
    const ctx = img.getContext('2d');
    
    // Get direct pixel access for performance
    const imageData = ctx.bitmap.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const real = centerX + (x - width / 2) * scale;
            const imag = centerY + (y - height / 2) * scale;

            let iterations;
            if (fractalType === 'julia') {
                const z = new Complex(real, imag);
                const c = new Complex(juliaCReal, juliaCImag);
                iterations = juliaIterations(z, c, maxIter);
            } else {
                const c = new Complex(real, imag);
                iterations = mandelbrotIterations(c, maxIter);
            }

            const color = colorFromIterations(iterations, maxIter, colorScheme);
            
            // Direct pixel manipulation for better performance
            const idx = (y * width + x) * 4;
            imageData[idx] = color.r;
            imageData[idx + 1] = color.g;
            imageData[idx + 2] = color.b;
            imageData[idx + 3] = 255;
        }
    }

    return img;
}

// Generate fractal based on type
function generateFractal(params) {
    console.log('Generating fractal with params:', params);
    try {
        if (params.fractalType === 'lsystem') {
            const result = generateLSystemFractal(params);
            console.log('L-system fractal generated');
            return result;
        } else {
            const result = generateMathematicalFractal(params);
            console.log('Mathematical fractal generated');
            return result;
        }
    } catch (error) {
        console.error('Error in generateFractal:', error);
        throw error;
    }
}

// Parse query parameters with defaults
function parseParams(query) {
    return {
        width: parseInt(query.width) || 800,
        height: parseInt(query.height) || 600,
        zoom: parseFloat(query.zoom) || 1.0,
        centerX: parseFloat(query.center_x) || 0.0,
        centerY: parseFloat(query.center_y) || 0.0,
        maxIter: parseInt(query.max_iter) || 100,
        fractalType: query.fractal_type || 'mandelbrot',
        juliaCReal: parseFloat(query.julia_c_real) || -0.7,
        juliaCImag: parseFloat(query.julia_c_imag) || 0.27015,
        colorScheme: query.color_scheme || 'classic',
        lsystemPreset: query.lsystem_preset || 'tree',
        lsystemIterations: parseInt(query.lsystem_iterations) || 4,
        lsystemAngle: parseFloat(query.lsystem_angle) || 25.0,
        customAxiom: query.custom_axiom || 'F',
        customRules: query.custom_rules || ''
    };
}

module.exports = {
    generateFractal,
    parseParams
};

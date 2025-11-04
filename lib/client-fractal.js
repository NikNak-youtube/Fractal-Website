// Client-side fractal generation using Canvas API

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

function mandelbrotIterations(c, maxIter) {
  let z = new Complex(0, 0);
  for (let i = 0; i < maxIter; i++) {
    if (z.normSquared() > 4.0) return i;
    z = z.multiply(z).add(c);
  }
  return maxIter;
}

function juliaIterations(z, c, maxIter) {
  for (let i = 0; i < maxIter; i++) {
    if (z.normSquared() > 4.0) return i;
    z = z.multiply(z).add(c);
  }
  return maxIter;
}

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

export function generateMandelbrot(canvas, params) {
  const { width, height, zoom, centerX, centerY, maxIter, colorScheme } = params;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const scale = 4.0 / (zoom * Math.min(width, height));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const real = centerX + (x - width / 2) * scale;
      const imag = centerY + (y - height / 2) * scale;
      const c = new Complex(real, imag);
      
      const iterations = mandelbrotIterations(c, maxIter);
      const color = colorFromIterations(iterations, maxIter, colorScheme);
      
      const idx = (y * width + x) * 4;
      data[idx] = color.r;
      data[idx + 1] = color.g;
      data[idx + 2] = color.b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

export function generateJulia(canvas, params) {
  const { width, height, zoom, centerX, centerY, maxIter, juliaCReal, juliaCImag, colorScheme } = params;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const scale = 4.0 / (zoom * Math.min(width, height));
  const c = new Complex(juliaCReal, juliaCImag);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const real = centerX + (x - width / 2) * scale;
      const imag = centerY + (y - height / 2) * scale;
      const z = new Complex(real, imag);
      
      const iterations = juliaIterations(z, c, maxIter);
      const color = colorFromIterations(iterations, maxIter, colorScheme);
      
      const idx = (y * width + x) * 4;
      data[idx] = color.r;
      data[idx + 1] = color.g;
      data[idx + 2] = color.b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// L-System implementation
class TurtleGraphics {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.angle = -90;
    this.stack = [];
    this.path = [];
  }

  forward(distance) {
    const newX = this.x + distance * Math.cos((this.angle * Math.PI) / 180);
    const newY = this.y + distance * Math.sin((this.angle * Math.PI) / 180);
    this.path.push({ x1: this.x, y1: this.y, x2: newX, y2: newY });
    this.x = newX;
    this.y = newY;
  }

  turnLeft(angle) {
    this.angle -= angle;
  }

  turnRight(angle) {
    this.angle += angle;
  }

  push() {
    this.stack.push({ x: this.x, y: this.y, angle: this.angle });
  }

  pop() {
    const state = this.stack.pop();
    if (state) {
      this.x = state.x;
      this.y = state.y;
      this.angle = state.angle;
    }
  }
}

function getLSystemRules(preset) {
  const presets = {
    tree: { axiom: 'F', rules: { 'F': 'F[+F]F[-F]F' }, angle: 25.0 },
    dragon: { axiom: 'FX', rules: { 'X': 'X+YF+', 'Y': '-FX-Y' }, angle: 90.0 },
    plant: { axiom: 'X', rules: { 'X': 'F+[[X]-X]-F[-FX]+X', 'F': 'FF' }, angle: 25.0 },
    koch: { axiom: 'F', rules: { 'F': 'F+F-F-F+F' }, angle: 90.0 }
  };
  return presets[preset] || presets.tree;
}

function generateLSystemString(lsystem, iterations) {
  let current = lsystem.axiom;
  for (let iter = 0; iter < iterations; iter++) {
    let next = '';
    for (const c of current) {
      next += lsystem.rules[c] || c;
    }
    current = next;
  }
  return current;
}

export function generateLSystem(canvas, params) {
  const { width, height, zoom, centerX, centerY, lsystemPreset, lsystemIterations, lsystemAngle } = params;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  const lsystem = getLSystemRules(lsystemPreset);
  const lsystemString = generateLSystemString(lsystem, lsystemIterations);
  
  const turtle = new TurtleGraphics(width / 2, height);
  const stepSize = 10;
  const angle = lsystemAngle || lsystem.angle;

  for (const c of lsystemString) {
    switch (c) {
      case 'F':
      case 'G':
        turtle.forward(stepSize);
        break;
      case '+':
        turtle.turnLeft(angle);
        break;
      case '-':
        turtle.turnRight(angle);
        break;
      case '[':
        turtle.push();
        break;
      case ']':
        turtle.pop();
        break;
    }
  }

  // Draw all paths
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 1;
  ctx.beginPath();
  
  for (const segment of turtle.path) {
    ctx.moveTo(segment.x1, segment.y1);
    ctx.lineTo(segment.x2, segment.y2);
  }
  
  ctx.stroke();
}

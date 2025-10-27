# 🌟 Fractal Generator

A beautiful web application for generating and exploring mathematical fractals with a Node.js backend and an interactive modern frontend.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Web Technologies](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

- **🎨 Multiple Fractal Types**: Generate Mandelbrot sets, Julia sets, and L-systems
- **🔍 Interactive Controls**: Real-time zoom, pan, and parameter adjustment
- **🌈 Color Schemes**: Choose from classic, fire, ocean, and grayscale palettes
- **⚡ High Performance**: Efficient Node.js backend with Canvas API
- **📱 Responsive Design**: Works beautifully on desktop and mobile devices
- **🎯 Preset Configurations**: Quick access to interesting fractal views
- **💾 Download Support**: Save your favorite fractals as PNG images
- **🖱️ Mouse Controls**: Click and drag to pan, scroll to zoom
- **🌳 L-System Fractals**: Generate procedural tree-like and geometric patterns

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14.0.0 or higher)
- npm (comes with Node.js)
- A modern web browser

### Installation & Running

1. **Clone or download the project**
2. **Navigate to the project directory**
3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Run the server**:

   ```bash
   npm start
   ```

   Or for development with auto-reload:

   ```bash
   npm run dev
   ```

5. **Open your browser** and visit: `http://127.0.0.1:3001`

The server will automatically serve the web interface and handle fractal generation requests.

## ☁️ Deploy to Vercel

This project is configured for easy deployment to Vercel:

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   - Push your code to GitHub
   - Import the project in [Vercel Dashboard](https://vercel.com/new)
   - Vercel will automatically detect the configuration
   - Click "Deploy"

   Or use the CLI:
   ```bash
   vercel
   ```

3. **Environment Variables** (if needed):
   - No environment variables required for basic deployment

The project includes:
- `vercel.json` - Routing and build configuration
- `.vercelignore` - Files to exclude from deployment
- Serverless API functions in `/api` directory
- Static files served from `/static` directory

**Note**: Vercel automatically handles the `canvas` package dependencies in their Node.js runtime.

## 🏗️ Architecture

### Backend (Node.js)

- **Web Framework**: [Express](https://expressjs.com/) - Fast, minimalist web framework
- **Image Processing**: [node-canvas](https://github.com/Automattic/node-canvas) - PNG generation using Cairo
- **Custom Math**: Complex number operations for fractal calculations
- **L-System Generation**: Turtle graphics for procedural fractals

### Frontend

- **Vanilla JavaScript** - Modern ES6+ features
- **CSS Grid & Flexbox** - Responsive layout
- **Canvas API** - Image display and interaction
- **Fetch API** - Communication with Node.js backend

## 🎮 Usage

### Basic Controls

1. **Fractal Type**: Choose between Mandelbrot sets, Julia sets, and L-systems
2. **Image Settings**: Adjust width, height, and iteration count
3. **View Controls**: Zoom and pan to explore different areas
4. **Color Schemes**: Select visual style for the fractal
5. **Julia Parameters**: When using Julia sets, adjust the complex constant
6. **L-System Controls**: Select presets or create custom L-systems with rules and angles

### Interactive Features

- **Mouse Drag**: Pan around the fractal
- **Mouse Wheel**: Zoom in and out
- **Presets**: Quick access to interesting fractal configurations
- **Real-time Updates**: Some parameters update the fractal automatically
- **Keyboard Shortcut**: `Ctrl+Enter` to regenerate

### API Endpoints

- `GET /` - Serve the main web interface
- `GET /api/health` - Health check endpoint
- `GET /api/fractal` - Generate fractal with parameters:
  - `width`, `height` - Image dimensions
  - `zoom` - Zoom level
  - `center_x`, `center_y` - Center coordinates
  - `max_iter` - Maximum iterations
  - `fractal_type` - "mandelbrot", "julia", or "lsystem"
  - `julia_c_real`, `julia_c_imag` - Julia set parameters
  - `lsystem_preset` - L-system preset name
  - `lsystem_iterations` - Number of L-system iterations
  - `lsystem_angle` - Angle for L-system turns
  - `custom_axiom`, `custom_rules` - Custom L-system definition
  - `color_scheme` - Color palette selection

## 🛠️ Development

### Project Structure

```text
fractal-generator/
├── server.js            # Node.js backend server
├── static/
│   ├── index.html       # Main web interface
│   ├── style.css        # Styling and responsive design
│   └── script.js        # Frontend functionality
├── .github/
│   └── copilot-instructions.md
├── package.json         # Node.js dependencies
└── README.md
```

### Key Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",    // Web framework
    "canvas": "^2.11.2",     // Image processing
    "cors": "^2.8.5"         // CORS middleware
  }
}
```

### Building for Production

The application is ready to run without a build step. For production deployment:

```bash
# Install production dependencies only
npm install --production

# Run with Node.js
node server.js
```

## 🎯 Fractal Mathematics

### Mandelbrot Set

The Mandelbrot set is defined as the set of complex numbers `c` for which the iteration:

```text
z_{n+1} = z_n^2 + c
```

starting with `z_0 = 0`, remains bounded.

### Julia Set

Julia sets are defined similarly, but with a fixed complex parameter `c` and varying starting points:

```text
z_{n+1} = z_n^2 + c
```

where `c` is constant and `z_0` varies across the complex plane.

## 🎨 Color Schemes

- **Classic**: Traditional rainbow coloring with smooth gradients
- **Fire**: Warm colors ranging from red to yellow
- **Ocean**: Cool blues and teals
- **Grayscale**: Monochrome intensity mapping

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Additional fractal types (Burning Ship, Newton fractals, etc.)
- More color schemes and gradient options
- Performance optimizations
- UI/UX enhancements
- Mobile-specific features

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Node.js and Express communities for excellent tools
- node-canvas library for server-side image generation
- Mathematical beauty of fractal geometry and L-systems

---

Explore the infinite complexity of mathematics with beautiful, interactive fractals! 🌟

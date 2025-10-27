# 🌟 Fractal Generator

A beautiful web application for generating and exploring mathematical fractals with a Next.js and React frontend and serverless API backend.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
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

- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- npm (comes with Node.js)
- A modern web browser

### Installation & Running

1. **Clone or download the project**
2. **Navigate to the project directory**
3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Open your browser** and visit: `http://localhost:3000`

The Next.js development server will automatically serve the web interface and handle fractal generation requests with hot reloading.

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

### Frontend (Next.js + React)

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router - React framework with server-side rendering
- **UI Library**: [React 18](https://react.dev/) - Component-based UI
- **Styling**: CSS Modules with global styles - Responsive design
- **Canvas API**: HTML5 Canvas for fractal display and interaction

### Backend (Next.js API Routes)

- **API Routes**: Next.js serverless functions - Automatic API endpoints
- **Image Processing**: [pureimage](https://github.com/joshmarinacci/node-pureimage) - Pure JavaScript PNG generation (serverless-compatible)
- **Custom Math**: Complex number operations for fractal calculations
- **L-System Generation**: Turtle graphics for procedural fractals

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
├── app/                 # Next.js App Router
│   ├── api/            # API Routes (serverless functions)
│   │   ├── fractal/    
│   │   │   └── route.js # Fractal generation endpoint
│   │   └── health/
│   │       └── route.js # Health check endpoint
│   ├── layout.js       # Root layout with global CSS
│   ├── page.js         # Main page (React component)
│   └── globals.css     # Global styling
├── lib/                # Utilities and helpers
│   └── fractal-utils.js # Fractal generation logic
├── public/             # Static assets (served at root)
├── next.config.js      # Next.js configuration
├── package.json        # Dependencies
└── README.md
```

### Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.4",       // React framework
    "react": "^18.2.0",      // UI library
    "react-dom": "^18.2.0",  // React DOM renderer
    "pureimage": "^0.3.5"    // Image processing (serverless-compatible)
  }
}
```

### Building for Production

```bash
# Build the production version
npm run build

# Run the production build locally
npm start

# Or deploy to Vercel (recommended)
vercel --prod
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

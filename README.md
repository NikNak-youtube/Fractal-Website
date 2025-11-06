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
- **🚀 WebGPU Acceleration**: GPU-powered rendering for 10-100x faster generation
- **⚡ High Performance**: Client-side rendering with automatic WebGPU/Canvas fallback
- **📱 Responsive Design**: Works beautifully on desktop and mobile devices
- **🎯 Preset Configurations**: Quick access to interesting fractal views
- **💾 Download Support**: Save your favorite fractals as PNG images
- **🖱️ Advanced Controls**: Click-to-zoom, scroll wheel zoom, pinch-to-zoom on mobile
- **🌳 L-System Fractals**: Generate procedural tree-like and geometric patterns
- **🌐 Fullscreen Mode**: Immersive fractal exploration

## ⚡ WebGPU Acceleration

**NEW!** This app now includes GPU-accelerated fractal generation using WebGPU! 

- 🚀 **10-100x faster** rendering
- 🖥️ Works on desktop and mobile
- 🐧 **Linux users (Arch/Ubuntu/etc)**: See [WEBGPU_SETUP.md](./WEBGPU_SETUP.md) for setup instructions
- 📱 **Mobile users**: Update to Chrome 121+ (Android) or iOS 18+ (iPhone/iPad)
- ♻️ Automatic fallback to Canvas API if WebGPU unavailable

👉 **[Complete WebGPU Setup Guide](./WEBGPU_SETUP.md)** - Step-by-step instructions for all platforms

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- npm (comes with Node.js)
- A modern web browser
- (Optional) WebGPU support for GPU acceleration

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

## 🎮 WebGPU Acceleration

This application uses **WebGPU** for GPU-accelerated fractal generation, providing massive performance improvements!

### Browser Support

| Browser | Platform | Support | Instructions |
|---------|----------|---------|--------------|
| **Chrome/Chromium** | Linux | ✅ Supported | Requires flags (see below) |
| **Chrome** | Windows | ✅ Supported | Chrome 113+ |
| **Chrome** | macOS | ✅ Supported | Chrome 113+ |
| **Chrome** | Android | ✅ Supported | Chrome 121+ |
| **Edge** | Windows | ✅ Supported | Edge 113+ |
| **Safari** | iOS | ✅ Supported | iOS 18+ / Safari 18+ |
| **Safari** | macOS | ✅ Supported | Safari 18+ |
| **Firefox** | All | ⚠️ Experimental | Requires flag (see below) |

### Enabling WebGPU on Chromium/Chrome (Linux/Arch)

WebGPU requires manual enabling on Linux:

1. **Open Chrome/Chromium Flags**:
   - Navigate to: `chrome://flags`

2. **Enable WebGPU**:
   - Search for: `#enable-unsafe-webgpu`
   - Set to: **Enabled**

3. **Enable Vulkan** (required for Linux):
   - Search for: `#enable-vulkan`
   - Set to: **Enabled**

4. **Restart your browser**

5. **Verify Vulkan Support**:
   ```bash
   # Install Vulkan tools if needed
   sudo pacman -S vulkan-tools  # Arch Linux
   
   # Check Vulkan support
   vulkaninfo
   ```

6. **Install Vulkan Drivers** (if needed):
   ```bash
   # For NVIDIA
   sudo pacman -S nvidia vulkan-icd-loader
   
   # For AMD
   sudo pacman -S vulkan-radeon vulkan-icd-loader
   
   # For Intel
   sudo pacman -S vulkan-intel vulkan-icd-loader
   ```

### Enabling WebGPU on Firefox

1. Navigate to: `about:config`
2. Search for: `dom.webgpu.enabled`
3. Set to: `true`
4. Restart Firefox

### Mobile Support

- **Android**: Update Chrome to version 121 or higher
- **iOS**: Update to iOS 18 or higher with Safari 18+

### Performance Benefits

With WebGPU enabled:
- **10-100x faster** fractal generation
- **Real-time rendering** at high resolutions
- **Smooth zooming** even at 1000+ iterations
- **GPU-parallel computation** using compute shaders

### Fallback

If WebGPU is not available, the app automatically falls back to Canvas API (CPU rendering). You'll see a helpful message in the UI with instructions for enabling WebGPU.

## 🛠️ Development

### Project Structure

```text
fractal-generator/
├── app/                    # Next.js App Router
│   ├── layout.js          # Root layout with global CSS
│   ├── page.js            # Main page (React component with all controls)
│   └── globals.css        # Global styling
├── lib/                   # Utilities and helpers
│   ├── client-fractal.js  # Canvas API fractal generation (CPU)
│   └── webgpu-fractal.js  # WebGPU fractal generation (GPU)
├── static/                # Legacy static files
│   ├── index.html
│   ├── script.js
│   └── style.css
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies
├── vercel.json           # Vercel deployment config
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

## � Troubleshooting

### 404 Error on API Routes

If you see "404" errors when trying to generate fractals:

1. **Remove old API folder**: Make sure the old `/api` folder is deleted
   ```bash
   rm -rf api server.js
   ```

2. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   ```

3. **Reinstall dependencies**:
   ```bash
   npm install
   ```

4. **Restart dev server**:
   ```bash
   npm run dev
   ```

### Images Not Displaying

If fractals aren't showing:
- Check browser console for errors
- Verify the API route is working: visit `http://localhost:3000/api/health`
- Ensure pureimage is installed: `npm install pureimage`

### Build Errors

If you encounter build errors:
- Ensure Node.js version is 18.0.0 or higher: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check that all files in `app/api/*/route.js` use Next.js format (export GET/POST functions)

## �📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Next.js and React communities for excellent frameworks
- pureimage library for pure JavaScript image generation (serverless-compatible)
- Mathematical beauty of fractal geometry and L-systems

---

Explore the infinite complexity of mathematics with beautiful, interactive fractals! 🌟

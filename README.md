# 🌟 Fractal Generator

A beautiful web application for generating and exploring mathematical fractals with a high-performance Rust backend and an interactive modern frontend.

![Fractal Generator Preview](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)
![Web Technologies](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

- **🎨 Multiple Fractal Types**: Generate Mandelbrot and Julia sets
- **🔍 Interactive Controls**: Real-time zoom, pan, and parameter adjustment
- **🌈 Color Schemes**: Choose from classic, fire, ocean, and grayscale palettes
- **⚡ High Performance**: Rust backend with parallel processing using Rayon
- **📱 Responsive Design**: Works beautifully on desktop and mobile devices
- **🎯 Preset Configurations**: Quick access to interesting fractal views
- **💾 Download Support**: Save your favorite fractals as PNG images
- **🖱️ Mouse Controls**: Click and drag to pan, scroll to zoom

## 🚀 Quick Start

### Prerequisites

- [Rust](https://rustup.rs/) (latest stable version)
- A modern web browser

### Installation & Running

1. **Clone or download the project**
2. **Navigate to the project directory**
3. **Install dependencies and run**:

   ```bash
   cargo run
   ```

4. **Open your browser** and visit: `http://127.0.0.1:3000`

The server will automatically serve the web interface and handle fractal generation requests.

## 🏗️ Architecture

### Backend (Rust)

- **Web Framework**: [Axum](https://github.com/tokio-rs/axum) - Fast, ergonomic web framework
- **Image Processing**: [image crate](https://github.com/image-rs/image) - PNG generation
- **Math**: [num-complex](https://github.com/rust-num/num-complex) - Complex number operations
- **Parallelization**: [Rayon](https://github.com/rayon-rs/rayon) - Data parallelism for faster rendering
- **Async Runtime**: [Tokio](https://tokio.rs/) - Asynchronous runtime

### Frontend

- **Vanilla JavaScript** - Modern ES6+ features
- **CSS Grid & Flexbox** - Responsive layout
- **Canvas API** - Image display and interaction
- **Fetch API** - Communication with Rust backend

## 🎮 Usage

### Basic Controls

1. **Fractal Type**: Choose between Mandelbrot and Julia sets
2. **Image Settings**: Adjust width, height, and iteration count
3. **View Controls**: Zoom and pan to explore different areas
4. **Color Schemes**: Select visual style for the fractal
5. **Julia Parameters**: When using Julia sets, adjust the complex constant

### Interactive Features

- **Mouse Drag**: Pan around the fractal
- **Mouse Wheel**: Zoom in and out
- **Presets**: Quick access to interesting fractal configurations
- **Real-time Updates**: Some parameters update the fractal automatically
- **Keyboard Shortcut**: `Ctrl+Enter` to regenerate

### API Endpoints

- `GET /api/fractal` - Generate fractal with parameters:
  - `width`, `height` - Image dimensions
  - `zoom` - Zoom level
  - `center_x`, `center_y` - Center coordinates
  - `max_iter` - Maximum iterations
  - `fractal_type` - "mandelbrot" or "julia"
  - `julia_c_real`, `julia_c_imag` - Julia set parameters
  - `color_scheme` - Color palette selection

## 🛠️ Development

### Project Structure

```text
fractal-generator/
├── src/
│   └── main.rs          # Rust backend server
├── static/
│   ├── index.html       # Main web interface
│   ├── style.css        # Styling and responsive design
│   └── script.js        # Frontend functionality
├── .github/
│   └── copilot-instructions.md
├── Cargo.toml           # Rust dependencies
└── README.md
```

### Key Dependencies

```toml
[dependencies]
axum = "0.7"              # Web framework
tokio = { version = "1.0", features = ["full"] }
tower-http = { version = "0.5", features = ["cors", "fs"] }
image = "0.24"            # Image processing
num-complex = "0.4"       # Complex numbers
rayon = "1.7"             # Parallel processing
serde = { version = "1.0", features = ["derive"] }
```

### Building for Production

```bash
# Build optimized release version
cargo build --release

# Run the release version
cargo run --release
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

- Rust community for excellent mathematical libraries
- Axum team for the fantastic web framework
- Mathematical beauty of fractal geometry

---

Explore the infinite complexity of mathematics with beautiful, interactive fractals! 🌟

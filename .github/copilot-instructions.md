<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Fractal Generator Project

This is a fractal generation website with a Rust backend using Axum web framework and a modern HTML/CSS/JavaScript frontend.

## Project Structure
- **Rust Backend**: Uses Axum for web server, image processing for PNG generation, num-complex for complex number operations, and rayon for parallel processing
- **Frontend**: Modern responsive web interface with interactive controls for fractal parameters
- **Fractals Supported**: Mandelbrot set and Julia set with customizable parameters

## Key Features
- Real-time fractal generation with customizable parameters
- Interactive zoom and pan controls
- Multiple color schemes (classic, fire, ocean, grayscale)
- Preset configurations for common interesting fractal views
- Responsive design that works on desktop and mobile
- Download functionality for generated fractal images

## Development Guidelines
- Follow Rust best practices for the backend
- Use modern JavaScript (ES6+) for frontend functionality
- Maintain responsive design principles
- Optimize performance for fractal generation (use parallel processing)
- Keep the UI intuitive and accessible

## API Endpoints
- `GET /api/fractal` - Generate fractal image with query parameters
- `GET /api/health` - Health check endpoint
- `GET /` - Serve the main HTML page
- `/static/*` - Serve static assets

When making changes, ensure backwards compatibility with existing API endpoints and maintain the clean separation between frontend and backend concerns.

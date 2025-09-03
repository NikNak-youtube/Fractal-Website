use axum::{
    extract::Query,
    http::{header, StatusCode},
    response::{Html, IntoResponse},
    routing::get,
    Json, Router,
};
use image::{ImageBuffer, Rgb, RgbImage};
use num_complex::Complex;
use serde::{Deserialize, Serialize};
use std::io::Cursor;
use tower_http::{cors::CorsLayer, services::ServeDir};

#[derive(Deserialize)]
struct FractalParams {
    #[serde(default = "default_width")]
    width: u32,
    #[serde(default = "default_height")]
    height: u32,
    #[serde(default = "default_zoom")]
    zoom: f64,
    #[serde(default = "default_center_x")]
    center_x: f64,
    #[serde(default = "default_center_y")]
    center_y: f64,
    #[serde(default = "default_max_iter")]
    max_iter: u32,
    #[serde(default = "default_fractal_type")]
    fractal_type: String,
    #[serde(default = "default_julia_c_real")]
    julia_c_real: f64,
    #[serde(default = "default_julia_c_imag")]
    julia_c_imag: f64,
    #[serde(default = "default_color_scheme")]
    color_scheme: String,
}

fn default_width() -> u32 { 800 }
fn default_height() -> u32 { 600 }
fn default_zoom() -> f64 { 1.0 }
fn default_center_x() -> f64 { 0.0 }
fn default_center_y() -> f64 { 0.0 }
fn default_max_iter() -> u32 { 100 }
fn default_fractal_type() -> String { "mandelbrot".to_string() }
fn default_julia_c_real() -> f64 { -0.7 }
fn default_julia_c_imag() -> f64 { 0.27015 }
fn default_color_scheme() -> String { "classic".to_string() }

#[derive(Serialize)]
struct ApiResponse {
    message: String,
    status: String,
}

fn mandelbrot_iterations(c: Complex<f64>, max_iter: u32) -> u32 {
    let mut z = Complex::new(0.0, 0.0);
    for i in 0..max_iter {
        if z.norm_sqr() > 4.0 {
            return i;
        }
        z = z * z + c;
    }
    max_iter
}

fn julia_iterations(z: Complex<f64>, c: Complex<f64>, max_iter: u32) -> u32 {
    let mut z = z;
    for i in 0..max_iter {
        if z.norm_sqr() > 4.0 {
            return i;
        }
        z = z * z + c;
    }
    max_iter
}

fn color_from_iterations(iterations: u32, max_iter: u32, color_scheme: &str) -> Rgb<u8> {
    if iterations == max_iter {
        return Rgb([0, 0, 0]); // Black for points in the set
    }

    let t = iterations as f64 / max_iter as f64;
    
    match color_scheme {
        "classic" => {
            let r = (255.0 * (0.5 * (1.0 + (t * 6.28).cos()))) as u8;
            let g = (255.0 * t) as u8;
            let b = (255.0 * (0.5 * (1.0 + (t * 6.28).sin()))) as u8;
            Rgb([r, g, b])
        },
        "fire" => {
            let r = (255.0 * t) as u8;
            let g = (255.0 * t * t) as u8;
            let b = (255.0 * t * t * t) as u8;
            Rgb([r, g, b])
        },
        "ocean" => {
            let r = (255.0 * t * t) as u8;
            let g = (255.0 * t) as u8;
            let b = (255.0 * (0.5 * (1.0 + t))) as u8;
            Rgb([r, g, b])
        },
        _ => {
            let intensity = (255.0 * t) as u8;
            Rgb([intensity, intensity, intensity])
        }
    }
}

fn generate_fractal(params: &FractalParams) -> RgbImage {
    let width = params.width;
    let height = params.height;
    let zoom = params.zoom;
    let center_x = params.center_x;
    let center_y = params.center_y;
    let max_iter = params.max_iter;

    let scale = 4.0 / (zoom * width.min(height) as f64);
    
    let img: RgbImage = ImageBuffer::from_fn(width, height, |x, y| {
        let real = center_x + (x as f64 - width as f64 / 2.0) * scale;
        let imag = center_y + (y as f64 - height as f64 / 2.0) * scale;
        
        let iterations = match params.fractal_type.as_str() {
            "julia" => {
                let z = Complex::new(real, imag);
                let c = Complex::new(params.julia_c_real, params.julia_c_imag);
                julia_iterations(z, c, max_iter)
            },
            _ => {
                let c = Complex::new(real, imag);
                mandelbrot_iterations(c, max_iter)
            }
        };
        
        color_from_iterations(iterations, max_iter, &params.color_scheme)
    });
    
    img
}

async fn generate_fractal_image(Query(params): Query<FractalParams>) -> impl IntoResponse {
    let img = generate_fractal(&params);
    
    let mut buffer = Vec::new();
    {
        let mut cursor = Cursor::new(&mut buffer);
        if let Err(_) = img.write_to(&mut cursor, image::ImageOutputFormat::Png) {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to generate image"
            ).into_response();
        }
    }
    
    (
        [(header::CONTENT_TYPE, "image/png"), (header::CACHE_CONTROL, "no-cache")],
        buffer
    ).into_response()
}

async fn health_check() -> Json<ApiResponse> {
    Json(ApiResponse {
        message: "Fractal Generator API is running!".to_string(),
        status: "healthy".to_string(),
    })
}

async fn serve_index() -> Html<&'static str> {
    Html(include_str!("../static/index.html"))
}

#[tokio::main]
async fn main() {
    println!("Starting Fractal Generator Server...");
    
    let app = Router::new()
        .route("/", get(serve_index))
        .route("/api/health", get(health_check))
        .route("/api/fractal", get(generate_fractal_image))
        .nest_service("/static", ServeDir::new("static"))
        .layer(CorsLayer::permissive());

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3001")
        .await
        .unwrap();
    
    println!("🚀 Server running on http://127.0.0.1:3001");
    println!("📊 Fractal API available at http://127.0.0.1:3001/api/fractal");
    
    axum::serve(listener, app).await.unwrap();
}

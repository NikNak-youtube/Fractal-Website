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
use std::collections::HashMap;
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
    #[serde(default = "default_lsystem_preset")]
    lsystem_preset: String,
    #[serde(default = "default_lsystem_iterations")]
    lsystem_iterations: u32,
    #[serde(default = "default_lsystem_angle")]
    lsystem_angle: f64,
    #[serde(default = "default_custom_axiom")]
    custom_axiom: String,
    #[serde(default = "default_custom_rules")]
    custom_rules: String,
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
fn default_lsystem_preset() -> String { "tree".to_string() }
fn default_lsystem_iterations() -> u32 { 4 }
fn default_lsystem_angle() -> f64 { 25.0 }
fn default_custom_axiom() -> String { "F".to_string() }
fn default_custom_rules() -> String { "".to_string() }

#[derive(Serialize)]
struct ApiResponse {
    message: String,
    status: String,
}

#[derive(Clone)]
struct LSystemRule {
    axiom: String,
    rules: HashMap<char, String>,
    angle: f64,
}

#[derive(Clone)]
struct TurtleState {
    x: f64,
    y: f64,
    angle: f64,
}

struct TurtleGraphics {
    lines: Vec<((f64, f64), (f64, f64))>,
    state_stack: Vec<TurtleState>,
    current_state: TurtleState,
    step_size: f64,
}

fn get_lsystem_presets() -> HashMap<String, LSystemRule> {
    let mut presets = HashMap::new();
    
    // Tree (Binary Tree)
    let mut tree_rules = HashMap::new();
    tree_rules.insert('F', "F[+F]F[-F]F".to_string());
    presets.insert("tree".to_string(), LSystemRule {
        axiom: "F".to_string(),
        rules: tree_rules,
        angle: 25.0,
    });
    
    // Dragon Curve
    let mut dragon_rules = HashMap::new();
    dragon_rules.insert('X', "X+YF+".to_string());
    dragon_rules.insert('Y', "-FX-Y".to_string());
    presets.insert("dragon".to_string(), LSystemRule {
        axiom: "FX".to_string(),
        rules: dragon_rules,
        angle: 90.0,
    });
    
    // Sierpinski Triangle
    let mut sierpinski_rules = HashMap::new();
    sierpinski_rules.insert('F', "F-G+F+G-F".to_string());
    sierpinski_rules.insert('G', "GG".to_string());
    presets.insert("sierpinski".to_string(), LSystemRule {
        axiom: "F-G-G".to_string(),
        rules: sierpinski_rules,
        angle: 120.0,
    });
    
    // Koch Curve
    let mut koch_rules = HashMap::new();
    koch_rules.insert('F', "F+F-F-F+F".to_string());
    presets.insert("koch".to_string(), LSystemRule {
        axiom: "F".to_string(),
        rules: koch_rules,
        angle: 90.0,
    });
    
    // Plant
    let mut plant_rules = HashMap::new();
    plant_rules.insert('X', "F+[[X]-X]-F[-FX]+X".to_string());
    plant_rules.insert('F', "FF".to_string());
    presets.insert("plant".to_string(), LSystemRule {
        axiom: "X".to_string(),
        rules: plant_rules,
        angle: 25.0,
    });
    
    // Fractal Plant
    let mut fractal_plant_rules = HashMap::new();
    fractal_plant_rules.insert('F', "F[+F]F[-F][F]".to_string());
    presets.insert("fractal_plant".to_string(), LSystemRule {
        axiom: "F".to_string(),
        rules: fractal_plant_rules,
        angle: 20.0,
    });
    
    presets
}

fn generate_lsystem_string(lsystem: &LSystemRule, iterations: u32) -> String {
    let mut current = lsystem.axiom.clone();
    
    for _ in 0..iterations {
        let mut next = String::new();
        for c in current.chars() {
            if let Some(rule) = lsystem.rules.get(&c) {
                next.push_str(rule);
            } else {
                next.push(c);
            }
        }
        current = next;
    }
    
    current
}

impl TurtleGraphics {
    fn new(step_size: f64) -> Self {
        TurtleGraphics {
            lines: Vec::new(),
            state_stack: Vec::new(),
            current_state: TurtleState { x: 0.0, y: 0.0, angle: 90.0 },
            step_size,
        }
    }
    
    fn forward(&mut self) {
        let rad = self.current_state.angle.to_radians();
        let new_x = self.current_state.x + self.step_size * rad.cos();
        let new_y = self.current_state.y + self.step_size * rad.sin();
        
        self.lines.push(((self.current_state.x, self.current_state.y), (new_x, new_y)));
        
        self.current_state.x = new_x;
        self.current_state.y = new_y;
    }
    
    fn turn_left(&mut self, angle: f64) {
        self.current_state.angle += angle;
    }
    
    fn turn_right(&mut self, angle: f64) {
        self.current_state.angle -= angle;
    }
    
    fn push_state(&mut self) {
        self.state_stack.push(self.current_state.clone());
    }
    
    fn pop_state(&mut self) {
        if let Some(state) = self.state_stack.pop() {
            self.current_state = state;
        }
    }
    
    fn interpret_lsystem(&mut self, lsystem_string: &str, angle: f64) {
        for c in lsystem_string.chars() {
            match c {
                'F' | 'G' => self.forward(),
                '+' => self.turn_left(angle),
                '-' => self.turn_right(angle),
                '[' => self.push_state(),
                ']' => self.pop_state(),
                _ => {} // Ignore other characters
            }
        }
    }
    
    fn get_bounds(&self) -> (f64, f64, f64, f64) {
        if self.lines.is_empty() {
            return (0.0, 0.0, 0.0, 0.0);
        }
        
        let mut min_x = f64::INFINITY;
        let mut max_x = f64::NEG_INFINITY;
        let mut min_y = f64::INFINITY;
        let mut max_y = f64::NEG_INFINITY;
        
        for ((x1, y1), (x2, y2)) in &self.lines {
            min_x = min_x.min(*x1).min(*x2);
            max_x = max_x.max(*x1).max(*x2);
            min_y = min_y.min(*y1).min(*y2);
            max_y = max_y.max(*y1).max(*y2);
        }
        
        (min_x, min_y, max_x, max_y)
    }
}

fn parse_custom_rules(rules_string: &str) -> HashMap<char, String> {
    let mut rules = HashMap::new();
    
    for line in rules_string.lines() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        
        if let Some((left, right)) = line.split_once('=') {
            let left = left.trim();
            let right = right.trim();
            
            if let Some(first_char) = left.chars().next() {
                rules.insert(first_char, right.to_string());
            }
        }
    }
    
    rules
}

fn generate_lsystem_fractal(params: &FractalParams) -> RgbImage {
    let width = params.width;
    let height = params.height;
    let presets = get_lsystem_presets();
    
    let lsystem = if params.lsystem_preset == "custom" && !params.custom_rules.is_empty() {
        // Use custom L-system
        let custom_rules = parse_custom_rules(&params.custom_rules);
        LSystemRule {
            axiom: params.custom_axiom.clone(),
            rules: custom_rules,
            angle: params.lsystem_angle,
        }
    } else {
        // Use preset L-system
        presets.get(&params.lsystem_preset)
            .unwrap_or_else(|| presets.get("tree").unwrap())
            .clone()
    };
    
    let angle = if params.lsystem_angle != 25.0 { params.lsystem_angle } else { lsystem.angle };
    let lsystem_string = generate_lsystem_string(&lsystem, params.lsystem_iterations);
    
    let mut turtle = TurtleGraphics::new(10.0);
    turtle.interpret_lsystem(&lsystem_string, angle);
    
    let (min_x, min_y, max_x, max_y) = turtle.get_bounds();
    let bounds_width = max_x - min_x;
    let bounds_height = max_y - min_y;
    
    if bounds_width == 0.0 || bounds_height == 0.0 {
        return ImageBuffer::from_pixel(width, height, Rgb([0, 0, 0]));
    }
    
    let scale_x = (width as f64 - 40.0) / bounds_width * params.zoom;
    let scale_y = (height as f64 - 40.0) / bounds_height * params.zoom;
    let scale = scale_x.min(scale_y);
    
    let offset_x = (width as f64 / 2.0) - (bounds_width * scale / 2.0) - (min_x * scale) + params.center_x * 50.0;
    let offset_y = (height as f64 / 2.0) - (bounds_height * scale / 2.0) - (min_y * scale) + params.center_y * 50.0;
    
    let mut img = ImageBuffer::from_pixel(width, height, Rgb([255, 255, 255]));
    
    let line_color = match params.color_scheme.as_str() {
        "fire" => Rgb([255, 100, 0]),
        "ocean" => Rgb([0, 100, 255]),
        "classic" => Rgb([0, 150, 0]),
        _ => Rgb([0, 0, 0]),
    };
    
    for ((x1, y1), (x2, y2)) in turtle.lines {
        let screen_x1 = (x1 * scale + offset_x) as i32;
        let screen_y1 = (y1 * scale + offset_y) as i32;
        let screen_x2 = (x2 * scale + offset_x) as i32;
        let screen_y2 = (y2 * scale + offset_y) as i32;
        
        draw_line(&mut img, screen_x1, screen_y1, screen_x2, screen_y2, line_color);
    }
    
    img
}

fn draw_line(img: &mut RgbImage, x1: i32, y1: i32, x2: i32, y2: i32, color: Rgb<u8>) {
    let width = img.width() as i32;
    let height = img.height() as i32;
    
    let dx = (x2 - x1).abs();
    let dy = (y2 - y1).abs();
    let mut x = x1;
    let mut y = y1;
    let x_inc = if x1 < x2 { 1 } else { -1 };
    let y_inc = if y1 < y2 { 1 } else { -1 };
    let mut error = dx - dy;
    
    loop {
        if x >= 0 && x < width && y >= 0 && y < height {
            img.put_pixel(x as u32, y as u32, color);
        }
        
        if x == x2 && y == y2 {
            break;
        }
        
        let e2 = 2 * error;
        if e2 > -dy {
            error -= dy;
            x += x_inc;
        }
        if e2 < dx {
            error += dx;
            y += y_inc;
        }
    }
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
    match params.fractal_type.as_str() {
        "lsystem" => generate_lsystem_fractal(params),
        _ => generate_mathematical_fractal(params),
    }
}

fn generate_mathematical_fractal(params: &FractalParams) -> RgbImage {
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

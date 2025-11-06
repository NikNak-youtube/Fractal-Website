// WebGPU-accelerated fractal generation

let gpuDevice = null;
let gpuSupported = null;

// Initialize WebGPU
export async function initWebGPU() {
  if (gpuSupported !== null) {
    return gpuSupported;
  }

  if (!navigator.gpu) {
    console.log('WebGPU not supported');
    gpuSupported = false;
    return false;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      console.log('No WebGPU adapter found');
      gpuSupported = false;
      return false;
    }

    gpuDevice = await adapter.requestDevice();
    gpuSupported = true;
    console.log('WebGPU initialized successfully');
    return true;
  } catch (error) {
    console.error('WebGPU initialization failed:', error);
    gpuSupported = false;
    return false;
  }
}

// Check if WebGPU is available
export function isWebGPUSupported() {
  return gpuSupported === true;
}

// Mandelbrot compute shader in WGSL
const mandelbrotShader = `
struct Params {
  width: u32,
  height: u32,
  maxIter: u32,
  colorScheme: u32,
  centerX: f32,
  centerY: f32,
  zoom: f32,
  padding: f32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read_write> output: array<u32>;

fn hsv2rgb(h: f32, s: f32, v: f32) -> vec3<f32> {
  let c = v * s;
  let x = c * (1.0 - abs((h * 6.0) % 2.0 - 1.0));
  let m = v - c;
  
  var rgb = vec3<f32>(0.0);
  let h6 = h * 6.0;
  
  if (h6 < 1.0) {
    rgb = vec3<f32>(c, x, 0.0);
  } else if (h6 < 2.0) {
    rgb = vec3<f32>(x, c, 0.0);
  } else if (h6 < 3.0) {
    rgb = vec3<f32>(0.0, c, x);
  } else if (h6 < 4.0) {
    rgb = vec3<f32>(0.0, x, c);
  } else if (h6 < 5.0) {
    rgb = vec3<f32>(x, 0.0, c);
  } else {
    rgb = vec3<f32>(c, 0.0, x);
  }
  
  return rgb + vec3<f32>(m);
}

fn getColor(iter: u32, maxIter: u32, colorScheme: u32) -> vec3<f32> {
  if (iter >= maxIter) {
    return vec3<f32>(0.0, 0.0, 0.0);
  }
  
  let t = f32(iter) / f32(maxIter);
  
  // Classic rainbow
  if (colorScheme == 0u) {
    return hsv2rgb(t, 1.0, 1.0);
  }
  // Fire
  else if (colorScheme == 1u) {
    let r = min(t * 2.0, 1.0);
    let g = max((t - 0.5) * 2.0, 0.0);
    let b = max((t - 0.75) * 4.0, 0.0);
    return vec3<f32>(r, g, b);
  }
  // Ocean
  else if (colorScheme == 2u) {
    let r = t * 0.3;
    let g = t * 0.5 + 0.3;
    let b = t * 0.8 + 0.2;
    return vec3<f32>(r, g, b);
  }
  // Grayscale
  else {
    return vec3<f32>(t, t, t);
  }
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let x = global_id.x;
  let y = global_id.y;
  
  if (x >= params.width || y >= params.height) {
    return;
  }
  
  // Map pixel to complex plane
  let scale = 4.0 / (params.zoom * f32(min(params.width, params.height)));
  let real = params.centerX + (f32(x) - f32(params.width) / 2.0) * scale;
  let imag = params.centerY + (f32(y) - f32(params.height) / 2.0) * scale;
  
  // Mandelbrot iteration
  var zr = 0.0;
  var zi = 0.0;
  var iter = 0u;
  
  for (var i = 0u; i < params.maxIter; i = i + 1u) {
    if (zr * zr + zi * zi > 4.0) {
      break;
    }
    
    let temp = zr * zr - zi * zi + real;
    zi = 2.0 * zr * zi + imag;
    zr = temp;
    iter = i + 1u;
  }
  
  // Get color
  let color = getColor(iter, params.maxIter, params.colorScheme);
  
  // Pack RGB into u32 (RGBA format)
  let r = u32(color.r * 255.0);
  let g = u32(color.g * 255.0);
  let b = u32(color.b * 255.0);
  let a = 255u;
  
  let pixelIndex = y * params.width + x;
  output[pixelIndex] = (a << 24u) | (b << 16u) | (g << 8u) | r;
}
`;

// Julia set compute shader
const juliaShader = `
struct Params {
  width: u32,
  height: u32,
  maxIter: u32,
  colorScheme: u32,
  centerX: f32,
  centerY: f32,
  zoom: f32,
  cReal: f32,
  cImag: f32,
  padding: array<f32, 3>,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read_write> output: array<u32>;

fn hsv2rgb(h: f32, s: f32, v: f32) -> vec3<f32> {
  let c = v * s;
  let x = c * (1.0 - abs((h * 6.0) % 2.0 - 1.0));
  let m = v - c;
  
  var rgb = vec3<f32>(0.0);
  let h6 = h * 6.0;
  
  if (h6 < 1.0) {
    rgb = vec3<f32>(c, x, 0.0);
  } else if (h6 < 2.0) {
    rgb = vec3<f32>(x, c, 0.0);
  } else if (h6 < 3.0) {
    rgb = vec3<f32>(0.0, c, x);
  } else if (h6 < 4.0) {
    rgb = vec3<f32>(0.0, x, c);
  } else if (h6 < 5.0) {
    rgb = vec3<f32>(x, 0.0, c);
  } else {
    rgb = vec3<f32>(c, 0.0, x);
  }
  
  return rgb + vec3<f32>(m);
}

fn getColor(iter: u32, maxIter: u32, colorScheme: u32) -> vec3<f32> {
  if (iter >= maxIter) {
    return vec3<f32>(0.0, 0.0, 0.0);
  }
  
  let t = f32(iter) / f32(maxIter);
  
  if (colorScheme == 0u) {
    return hsv2rgb(t, 1.0, 1.0);
  } else if (colorScheme == 1u) {
    let r = min(t * 2.0, 1.0);
    let g = max((t - 0.5) * 2.0, 0.0);
    let b = max((t - 0.75) * 4.0, 0.0);
    return vec3<f32>(r, g, b);
  } else if (colorScheme == 2u) {
    let r = t * 0.3;
    let g = t * 0.5 + 0.3;
    let b = t * 0.8 + 0.2;
    return vec3<f32>(r, g, b);
  } else {
    return vec3<f32>(t, t, t);
  }
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let x = global_id.x;
  let y = global_id.y;
  
  if (x >= params.width || y >= params.height) {
    return;
  }
  
  let scale = 4.0 / (params.zoom * f32(min(params.width, params.height)));
  let zr = params.centerX + (f32(x) - f32(params.width) / 2.0) * scale;
  let zi = params.centerY + (f32(y) - f32(params.height) / 2.0) * scale;
  
  var real = zr;
  var imag = zi;
  var iter = 0u;
  
  for (var i = 0u; i < params.maxIter; i = i + 1u) {
    if (real * real + imag * imag > 4.0) {
      break;
    }
    
    let temp = real * real - imag * imag + params.cReal;
    imag = 2.0 * real * imag + params.cImag;
    real = temp;
    iter = i + 1u;
  }
  
  let color = getColor(iter, params.maxIter, params.colorScheme);
  
  let r = u32(color.r * 255.0);
  let g = u32(color.g * 255.0);
  let b = u32(color.b * 255.0);
  let a = 255u;
  
  let pixelIndex = y * params.width + x;
  output[pixelIndex] = (a << 24u) | (b << 16u) | (g << 8u) | r;
}
`;

// Generate Mandelbrot using WebGPU
export async function generateMandelbrotGPU(canvas, params) {
  if (!gpuDevice) {
    throw new Error('WebGPU not initialized');
  }

  const { width, height, zoom, centerX, centerY, maxIter, colorScheme } = params;

  // Map color scheme to number
  const colorSchemeMap = { classic: 0, fire: 1, ocean: 2, grayscale: 3 };
  const colorSchemeNum = colorSchemeMap[colorScheme] || 0;

  // Create shader module
  const shaderModule = gpuDevice.createShaderModule({
    code: mandelbrotShader,
  });

  // Create uniform buffer for parameters
  const paramsBuffer = gpuDevice.createBuffer({
    size: 32, // 8 floats * 4 bytes
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const paramsData = new ArrayBuffer(32);
  const paramsView = new DataView(paramsData);
  paramsView.setUint32(0, width, true);
  paramsView.setUint32(4, height, true);
  paramsView.setUint32(8, maxIter, true);
  paramsView.setUint32(12, colorSchemeNum, true);
  paramsView.setFloat32(16, centerX, true);
  paramsView.setFloat32(20, centerY, true);
  paramsView.setFloat32(24, zoom, true);

  gpuDevice.queue.writeBuffer(paramsBuffer, 0, paramsData);

  // Create output buffer
  const outputSize = width * height * 4; // RGBA
  const outputBuffer = gpuDevice.createBuffer({
    size: outputSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  // Create bind group layout
  const bindGroupLayout = gpuDevice.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
    ],
  });

  // Create bind group
  const bindGroup = gpuDevice.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      { binding: 0, resource: { buffer: paramsBuffer } },
      { binding: 1, resource: { buffer: outputBuffer } },
    ],
  });

  // Create compute pipeline
  const pipeline = gpuDevice.createComputePipeline({
    layout: gpuDevice.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
    compute: { module: shaderModule, entryPoint: 'main' },
  });

  // Create command encoder
  const commandEncoder = gpuDevice.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);
  
  const workgroupsX = Math.ceil(width / 8);
  const workgroupsY = Math.ceil(height / 8);
  passEncoder.dispatchWorkgroups(workgroupsX, workgroupsY);
  passEncoder.end();

  // Copy to staging buffer
  const stagingBuffer = gpuDevice.createBuffer({
    size: outputSize,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  });

  commandEncoder.copyBufferToBuffer(outputBuffer, 0, stagingBuffer, 0, outputSize);
  gpuDevice.queue.submit([commandEncoder.finish()]);

  // Read results
  await stagingBuffer.mapAsync(GPUMapMode.READ);
  const resultData = new Uint8Array(stagingBuffer.getMappedRange());

  // Draw to canvas
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(resultData);
  ctx.putImageData(imageData, 0, 0);

  stagingBuffer.unmap();
}

// Generate Julia using WebGPU
export async function generateJuliaGPU(canvas, params) {
  if (!gpuDevice) {
    throw new Error('WebGPU not initialized');
  }

  const { width, height, zoom, centerX, centerY, maxIter, colorScheme, juliaCReal, juliaCImag } = params;

  const colorSchemeMap = { classic: 0, fire: 1, ocean: 2, grayscale: 3 };
  const colorSchemeNum = colorSchemeMap[colorScheme] || 0;

  const shaderModule = gpuDevice.createShaderModule({
    code: juliaShader,
  });

  const paramsBuffer = gpuDevice.createBuffer({
    size: 48, // 12 floats * 4 bytes
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const paramsData = new ArrayBuffer(48);
  const paramsView = new DataView(paramsData);
  paramsView.setUint32(0, width, true);
  paramsView.setUint32(4, height, true);
  paramsView.setUint32(8, maxIter, true);
  paramsView.setUint32(12, colorSchemeNum, true);
  paramsView.setFloat32(16, centerX, true);
  paramsView.setFloat32(20, centerY, true);
  paramsView.setFloat32(24, zoom, true);
  paramsView.setFloat32(28, juliaCReal, true);
  paramsView.setFloat32(32, juliaCImag, true);

  gpuDevice.queue.writeBuffer(paramsBuffer, 0, paramsData);

  const outputSize = width * height * 4;
  const outputBuffer = gpuDevice.createBuffer({
    size: outputSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const bindGroupLayout = gpuDevice.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
    ],
  });

  const bindGroup = gpuDevice.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      { binding: 0, resource: { buffer: paramsBuffer } },
      { binding: 1, resource: { buffer: outputBuffer } },
    ],
  });

  const pipeline = gpuDevice.createComputePipeline({
    layout: gpuDevice.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
    compute: { module: shaderModule, entryPoint: 'main' },
  });

  const commandEncoder = gpuDevice.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);
  
  const workgroupsX = Math.ceil(width / 8);
  const workgroupsY = Math.ceil(height / 8);
  passEncoder.dispatchWorkgroups(workgroupsX, workgroupsY);
  passEncoder.end();

  const stagingBuffer = gpuDevice.createBuffer({
    size: outputSize,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  });

  commandEncoder.copyBufferToBuffer(outputBuffer, 0, stagingBuffer, 0, outputSize);
  gpuDevice.queue.submit([commandEncoder.finish()]);

  await stagingBuffer.mapAsync(GPUMapMode.READ);
  const resultData = new Uint8Array(stagingBuffer.getMappedRange());

  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(resultData);
  ctx.putImageData(imageData, 0, 0);

  stagingBuffer.unmap();
}

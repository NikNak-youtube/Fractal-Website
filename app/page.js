'use client';

import { useState, useEffect, useRef } from 'react';
import { generateMandelbrot, generateJulia, generateLSystem } from '@/lib/client-fractal';
import { initWebGPU, isWebGPUSupported, generateMandelbrotGPU, generateJuliaGPU } from '@/lib/webgpu-fractal';

export default function FractalGenerator() {
  // State for form controls
  const [fractalType, setFractalType] = useState('mandelbrot');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maxIter, setMaxIter] = useState(100);
  const [zoom, setZoom] = useState(1);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [colorScheme, setColorScheme] = useState('classic');
  
  // Julia set parameters
  const [juliaCReal, setJuliaCReal] = useState(-0.7);
  const [juliaCImag, setJuliaCImag] = useState(0.27015);
  
  // L-system parameters
  const [lsystemPreset, setLsystemPreset] = useState('tree');
  const [lsystemIterations, setLsystemIterations] = useState(4);
  const [lsystemAngle, setLsystemAngle] = useState(25);
  const [customAxiom, setCustomAxiom] = useState('F');
  const [customRules, setCustomRules] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [generationTime, setGenerationTime] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [canvasTransform, setCanvasTransform] = useState({ scale: 1, translateX: 0, translateY: 0 });
  const [useWebGPU, setUseWebGPU] = useState(false);
  const [webGPUInitialized, setWebGPUInitialized] = useState(false);
  
  // Initialize WebGPU on mount
  useEffect(() => {
    const init = async () => {
      const supported = await initWebGPU();
      setWebGPUInitialized(true);
      setUseWebGPU(supported);
      if (supported) {
        console.log('WebGPU enabled - fractal generation will be GPU-accelerated! 🚀');
      } else {
        console.log('WebGPU not available - using Canvas API fallback');
      }
    };
    init();
  }, []);

  // Generate fractal (client-side with WebGPU acceleration)
  const generateFractal = async () => {
    const startTime = performance.now();
    setLoading(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error('Canvas not found');
      }

      canvas.width = width;
      canvas.height = height;

      const params = {
        width,
        height,
        zoom,
        centerX,
        centerY,
        maxIter,
        colorScheme,
        juliaCReal,
        juliaCImag,
        lsystemPreset,
        lsystemIterations,
        lsystemAngle
      };

      // Generate based on fractal type
      if (fractalType === 'mandelbrot') {
        if (useWebGPU && isWebGPUSupported()) {
          await generateMandelbrotGPU(canvas, params);
        } else {
          generateMandelbrot(canvas, params);
        }
      } else if (fractalType === 'julia') {
        if (useWebGPU && isWebGPUSupported()) {
          await generateJuliaGPU(canvas, params);
        } else {
          generateJulia(canvas, params);
        }
      } else if (fractalType === 'lsystem') {
        // L-systems use Canvas API (geometric rendering, not suitable for GPU compute)
        generateLSystem(canvas, params);
      }

      const endTime = performance.now();
      const time = ((endTime - startTime) / 1000).toFixed(2);
      const method = (useWebGPU && isWebGPUSupported() && fractalType !== 'lsystem') ? ' (WebGPU)' : ' (Canvas)';
      setGenerationTime(`Generated in ${time}s${method}`);
      setLoading(false);
      
      // Reset transform after generation
      setCanvasTransform({ scale: 1, translateX: 0, translateY: 0 });
      
    } catch (error) {
      console.error('Error generating fractal:', error);
      setGenerationTime(`Error: ${error.message}`);
      setLoading(false);
      setCanvasTransform({ scale: 1, translateX: 0, translateY: 0 });
    }
  };
  
  // Generate fractal on mount and when fractal type changes
  useEffect(() => {
    generateFractal();
  }, []); // Only on mount
  
  // Reset view
  const resetView = () => {
    setZoom(1);
    setCenterX(0);
    setCenterY(0);
    generateFractal();
  };
  
  // Apply preset
  const applyPreset = (preset) => {
    const presets = {
      'mandelbrot-default': { fractalType: 'mandelbrot', zoom: 1, centerX: 0, centerY: 0, colorScheme: 'classic' },
      'mandelbrot-zoom': { fractalType: 'mandelbrot', zoom: 50, centerX: -0.7269, centerY: 0.1889, colorScheme: 'fire' },
      'julia-spiral': { fractalType: 'julia', zoom: 1, centerX: 0, centerY: 0, juliaCReal: -0.8, juliaCImag: 0.156, colorScheme: 'ocean' },
      'julia-dendrite': { fractalType: 'julia', zoom: 1, centerX: 0, centerY: 0, juliaCReal: 0, juliaCImag: 1, colorScheme: 'classic' },
      'lsystem-tree': { fractalType: 'lsystem', zoom: 1, centerX: 0, centerY: 0, lsystemPreset: 'tree', lsystemIterations: 5, lsystemAngle: 25, colorScheme: 'classic' },
      'lsystem-dragon': { fractalType: 'lsystem', zoom: 1, centerX: 0, centerY: 0, lsystemPreset: 'dragon', lsystemIterations: 10, lsystemAngle: 90, colorScheme: 'fire' },
      'lsystem-plant': { fractalType: 'lsystem', zoom: 1, centerX: 0, centerY: 0, lsystemPreset: 'plant', lsystemIterations: 4, lsystemAngle: 25, colorScheme: 'classic' },
      'lsystem-koch': { fractalType: 'lsystem', zoom: 1, centerX: 0, centerY: 0, lsystemPreset: 'koch', lsystemIterations: 4, lsystemAngle: 90, colorScheme: 'ocean' }
    };
    
    const config = presets[preset];
    if (!config) return;
    
    setFractalType(config.fractalType);
    setZoom(config.zoom);
    setCenterX(config.centerX);
    setCenterY(config.centerY);
    setColorScheme(config.colorScheme);
    
    if (config.juliaCReal !== undefined) setJuliaCReal(config.juliaCReal);
    if (config.juliaCImag !== undefined) setJuliaCImag(config.juliaCImag);
    if (config.lsystemPreset !== undefined) setLsystemPreset(config.lsystemPreset);
    if (config.lsystemIterations !== undefined) setLsystemIterations(config.lsystemIterations);
    if (config.lsystemAngle !== undefined) setLsystemAngle(config.lsystemAngle);
    
    setTimeout(() => generateFractal(), 100);
  };
  
  // Download canvas
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'fractal.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Handle click to zoom
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate zoom factor
    const zoomFactor = 2;
    const newZoom = zoom * zoomFactor;

    // Convert mouse position to fractal coordinates
    const scale = 4.0 / (zoom * Math.min(width, height));
    const fractalMouseX = centerX + (mouseX - width / 2) * scale;
    const fractalMouseY = centerY + (mouseY - height / 2) * scale;

    // Calculate new center to zoom towards clicked point
    const newCenterX = fractalMouseX - (fractalMouseX - centerX) * (zoom / newZoom);
    const newCenterY = fractalMouseY - (fractalMouseY - centerY) * (zoom / newZoom);

    // Apply instant visual zoom
    const translateX = (width / 2 - mouseX) * (zoomFactor - 1);
    const translateY = (height / 2 - mouseY) * (zoomFactor - 1);
    setCanvasTransform({
      scale: zoomFactor,
      translateX,
      translateY
    });

    // Update state and regenerate
    setZoom(newZoom);
    setCenterX(newCenterX);
    setCenterY(newCenterY);

    setTimeout(() => generateFractal(), 0);
  };  // Handle scroll wheel zoom with linear interpolation
  const wheelTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  const targetZoomRef = useRef(zoom);
  const targetCenterRef = useRef({ x: centerX, y: centerY });
  const currentVisualZoomRef = useRef(1);
  
  const handleWheel = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate zoom direction and factor (more responsive)
    const zoomDelta = e.deltaY < 0 ? 1.15 : 0.87;
    const newZoom = zoom * zoomDelta;

    // Convert mouse position to fractal coordinates
    const scale = 4.0 / (zoom * Math.min(width, height));
    const fractalMouseX = centerX + (mouseX - width / 2) * scale;
    const fractalMouseY = centerY + (mouseY - height / 2) * scale;

    // Calculate new center to zoom towards mouse position
    const newCenterX = fractalMouseX - (fractalMouseX - centerX) * (zoom / newZoom);
    const newCenterY = fractalMouseY - (fractalMouseY - centerY) * (zoom / newZoom);

    // Update state immediately
    setZoom(newZoom);
    setCenterX(newCenterX);
    setCenterY(newCenterY);

    // Update targets for interpolation
    targetZoomRef.current = newZoom;
    targetCenterRef.current = { x: newCenterX, y: newCenterY };

    // Apply smooth visual transform
    const visualScale = zoomDelta;
    currentVisualZoomRef.current *= visualScale;
    const translateX = (width / 2 - mouseX) * (visualScale - 1);
    const translateY = (height / 2 - mouseY) * (visualScale - 1);
    
    setCanvasTransform(prev => ({
      scale: prev.scale * visualScale,
      translateX: prev.translateX + translateX,
      translateY: prev.translateY + translateY
    }));

    // Debounce regeneration
    if (wheelTimeoutRef.current) {
      clearTimeout(wheelTimeoutRef.current);
    }
    wheelTimeoutRef.current = setTimeout(() => {
      currentVisualZoomRef.current = 1;
      generateFractal();
    }, 200);
  };

  // Handle touch events for pinch zoom
  const [touchDistance, setTouchDistance] = useState(null);
  const [touchCenter, setTouchCenter] = useState(null);
  const touchTimeoutRef = useRef(null);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      // Calculate center point between fingers
      const centerX = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left;
      const centerY = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top;
      
      setTouchDistance(dist);
      setTouchCenter({ x: centerX, y: centerY });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchDistance && touchCenter) {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      
      // Calculate current distance and center between fingers
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      // Get current center point between fingers (it may have moved!)
      const currentTouchCenterX = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left;
      const currentTouchCenterY = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top;
      
      // Calculate zoom factor
      const zoomFactor = newDist / touchDistance;
      const newZoom = zoom * zoomFactor;
      
      // Convert the CURRENT touch center to fractal coordinates
      const scale = 4.0 / (zoom * Math.min(width, height));
      const fractalTouchX = centerX + (currentTouchCenterX - width / 2) * scale;
      const fractalTouchY = centerY + (currentTouchCenterY - height / 2) * scale;
      
      // Calculate new center to zoom towards the current touch point
      const newCenterX = fractalTouchX - (fractalTouchX - centerX) * (zoom / newZoom);
      const newCenterY = fractalTouchY - (fractalTouchY - centerY) * (zoom / newZoom);
      
      // Apply instant visual zoom relative to current touch position
      const translateX = (width / 2 - currentTouchCenterX) * (zoomFactor - 1);
      const translateY = (height / 2 - currentTouchCenterY) * (zoomFactor - 1);
      
      setCanvasTransform(prev => ({
        scale: prev.scale * zoomFactor,
        translateX: prev.translateX + translateX,
        translateY: prev.translateY + translateY
      }));
      
      setZoom(newZoom);
      setCenterX(newCenterX);
      setCenterY(newCenterY);
      setTouchDistance(newDist);
      
      // Update the touch center for next frame
      setTouchCenter({ x: currentTouchCenterX, y: currentTouchCenterY });
      
      // Debounce regeneration
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
      touchTimeoutRef.current = setTimeout(() => {
        generateFractal();
      }, 200);
    }
  };

  const handleTouchEnd = () => {
    setTouchDistance(null);
    setTouchCenter(null);
    // Trigger final regeneration
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
    generateFractal();
  };

  // Toggle fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!isFullscreen) {
      if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
      } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
      } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Track when dimensions change to trigger regeneration
  const prevDimensionsRef = useRef({ width, height });
  
  useEffect(() => {
    // Check if dimensions actually changed
    if (prevDimensionsRef.current.width !== width || prevDimensionsRef.current.height !== height) {
      // Dimensions changed, regenerate fractal
      const timer = setTimeout(() => {
        generateFractal();
      }, 50);
      
      prevDimensionsRef.current = { width, height };
      return () => clearTimeout(timer);
    }
  }, [width, height]);

  // Listen for fullscreen change and update dimensions
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      
      if (isNowFullscreen) {
        // Update to screen dimensions
        setWidth(window.screen.width);
        setHeight(window.screen.height);
      } else {
        // Revert to default dimensions
        setWidth(800);
        setHeight(600);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  return (
    <div className="container">
      <header>
        <h1>🌟 Fractal Generator</h1>
        <p>Explore the infinite beauty of mathematical fractals</p>
      </header>
      
      <div className="main-content">
        <div className="controls-panel">
          {/* Fractal Type */}
          <div className="control-group">
            <h3>Fractal Type</h3>
            <select value={fractalType} onChange={(e) => setFractalType(e.target.value)}>
              <option value="mandelbrot">Mandelbrot Set</option>
              <option value="julia">Julia Set</option>
              <option value="lsystem">L-System Fractals</option>
            </select>
          </div>
          
          {/* Image Settings */}
          <div className="control-group">
            <h3>Image Settings</h3>
            <label>
              Width:
              <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min="100" max="2000" />
            </label>
            <label>
              Height:
              <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min="100" max="2000" />
            </label>
            <label>
              Max Iterations:
              <input type="number" value={maxIter} onChange={(e) => setMaxIter(Number(e.target.value))} min="10" max="1000" />
            </label>
          </div>
          
          {/* View Controls */}
          <div className="control-group">
            <h3>View Controls</h3>
            <label>
              Zoom:
              <input type="range" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} min="0.1" max="100" step="0.1" />
              <span>{zoom.toFixed(1)}</span>
            </label>
            <label>
              Center X:
              <input type="number" value={centerX} onChange={(e) => setCenterX(Number(e.target.value))} step="0.01" />
            </label>
            <label>
              Center Y:
              <input type="number" value={centerY} onChange={(e) => setCenterY(Number(e.target.value))} step="0.01" />
            </label>
          </div>
          
          {/* Julia Set Parameters */}
          {fractalType === 'julia' && (
            <div className="control-group julia-controls">
              <h3>Julia Set Parameters</h3>
              <label>
                C Real:
                <input type="number" value={juliaCReal} onChange={(e) => setJuliaCReal(Number(e.target.value))} step="0.01" />
              </label>
              <label>
                C Imaginary:
                <input type="number" value={juliaCImag} onChange={(e) => setJuliaCImag(Number(e.target.value))} step="0.01" />
              </label>
            </div>
          )}
          
          {/* L-System Parameters */}
          {fractalType === 'lsystem' && (
            <div className="control-group lsystem-controls">
              <h3>L-System Parameters</h3>
              <label>
                Preset:
                <select value={lsystemPreset} onChange={(e) => setLsystemPreset(e.target.value)}>
                  <option value="tree">Tree</option>
                  <option value="plant">Plant</option>
                  <option value="fractal_plant">Fractal Plant</option>
                  <option value="dragon">Dragon Curve</option>
                  <option value="sierpinski">Sierpinski Triangle</option>
                  <option value="koch">Koch Curve</option>
                  <option value="custom">Custom L-System</option>
                </select>
              </label>
              <label>
                Iterations:
                <input type="number" value={lsystemIterations} onChange={(e) => setLsystemIterations(Number(e.target.value))} min="1" max="8" />
              </label>
              <label>
                Angle:
                <input type="number" value={lsystemAngle} onChange={(e) => setLsystemAngle(Number(e.target.value))} min="5" max="120" step="5" />
              </label>
              
              {lsystemPreset === 'custom' && (
                <div className="custom-lsystem">
                  <h4>Custom L-System Editor</h4>
                  <label>
                    Axiom (Starting String):
                    <input type="text" value={customAxiom} onChange={(e) => setCustomAxiom(e.target.value)} placeholder="e.g., F or X" />
                  </label>
                  <label>
                    Rules (one per line):
                    <textarea value={customRules} onChange={(e) => setCustomRules(e.target.value)} placeholder="F=F[+F]F[-F]F" rows="4" />
                  </label>
                </div>
              )}
            </div>
          )}
          
          {/* Color Scheme */}
          <div className="control-group">
            <h3>Color Scheme</h3>
            <select value={colorScheme} onChange={(e) => setColorScheme(e.target.value)}>
              <option value="classic">Classic</option>
              <option value="fire">Fire</option>
              <option value="ocean">Ocean</option>
              <option value="grayscale">Grayscale</option>
            </select>
          </div>
          
          {/* Performance Settings */}
          {webGPUInitialized && (
            <div className="control-group">
              <h3>⚡ Performance</h3>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={useWebGPU} 
                  onChange={(e) => setUseWebGPU(e.target.checked)}
                  disabled={!isWebGPUSupported()}
                />
                <span>
                  Use WebGPU Acceleration
                  {!isWebGPUSupported() && ' (Not Available)'}
                  {isWebGPUSupported() && ' 🚀'}
                </span>
              </label>
              {isWebGPUSupported() && (
                <p className="info-text">
                  ✨ GPU acceleration provides 10-100x faster rendering!
                </p>
              )}
              {!isWebGPUSupported() && (
                <div className="warning-text">
                  <p><strong>WebGPU Not Available</strong></p>
                  <details>
                    <summary>How to enable WebGPU</summary>
                    <ul>
                      <li><strong>Chromium/Chrome (Linux/Arch):</strong>
                        <ol>
                          <li>Go to <code>chrome://flags</code></li>
                          <li>Enable <code>#enable-unsafe-webgpu</code></li>
                          <li>Enable <code>#enable-vulkan</code></li>
                          <li>Restart browser</li>
                          <li>Install Vulkan: <code>sudo pacman -S vulkan-tools vulkan-icd-loader</code></li>
                          <li>Install GPU drivers (vulkan-intel/vulkan-radeon/nvidia)</li>
                        </ol>
                      </li>
                      <li><strong>Chrome (Android):</strong> Update to Chrome 121+</li>
                      <li><strong>Safari (iOS):</strong> Update to iOS 18+ / Safari 18+</li>
                      <li><strong>Chrome/Edge (Windows/Mac):</strong> Should work automatically (v113+)</li>
                      <li><strong>Firefox:</strong> Enable <code>dom.webgpu.enabled</code> in <code>about:config</code></li>
                    </ul>
                    <p style={{marginTop: '10px', fontSize: '0.85em'}}>
                      📖 See <a href="https://github.com/NikNak-youtube/Fractal-Website/blob/node.js/WEBGPU_SETUP.md" target="_blank" rel="noopener noreferrer" style={{color: '#856404', textDecoration: 'underline'}}>WEBGPU_SETUP.md</a> for detailed instructions.
                      <br />
                      Check browser console (F12) for more details.
                    </p>
                  </details>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="control-group">
            <button onClick={generateFractal} className="generate-button">Generate Fractal</button>
            <button onClick={resetView} className="reset-button">Reset View</button>
          </div>
          
          {/* Presets */}
          <div className="control-group">
            <h3>Presets</h3>
            <div className="preset-buttons">
              <button className="preset-btn" onClick={() => applyPreset('mandelbrot-default')}>Mandelbrot Classic</button>
              <button className="preset-btn" onClick={() => applyPreset('mandelbrot-zoom')}>Mandelbrot Detail</button>
              <button className="preset-btn" onClick={() => applyPreset('julia-spiral')}>Julia Spiral</button>
              <button className="preset-btn" onClick={() => applyPreset('julia-dendrite')}>Julia Dendrite</button>
              <button className="preset-btn" onClick={() => applyPreset('lsystem-tree')}>L-Tree</button>
              <button className="preset-btn" onClick={() => applyPreset('lsystem-dragon')}>L-Dragon</button>
              <button className="preset-btn" onClick={() => applyPreset('lsystem-plant')}>L-Plant</button>
              <button className="preset-btn" onClick={() => applyPreset('lsystem-koch')}>L-Koch</button>
            </div>
          </div>
        </div>
        
        <div className="fractal-display">
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Generating fractal...</p>
            </div>
          )}
          
          <canvas 
            ref={canvasRef} 
            id="fractal-canvas" 
            width={width} 
            height={height}
            onClick={handleCanvasClick}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ 
              cursor: 'pointer', 
              touchAction: 'none',
              transform: `translate(${canvasTransform.translateX}px, ${canvasTransform.translateY}px) scale(${canvasTransform.scale})`,
              transformOrigin: 'center center',
              transition: 'none'
            }}
          />
          
          <div className="fractal-info">
            <span className="generation-time">{generationTime}</span>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={toggleFullscreen} className="download-button">
                {isFullscreen ? '🔲 Exit Fullscreen' : '⛶ Fullscreen'}
              </button>
              <button onClick={downloadCanvas} className="download-button">💾 Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

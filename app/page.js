'use client';

import { useState, useEffect, useRef } from 'react';

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
  
  // Generate fractal
  const generateFractal = async () => {
    const startTime = performance.now();
    setLoading(true);
    
    try {
      const params = {
        width,
        height,
        zoom,
        center_x: centerX,
        center_y: centerY,
        max_iter: maxIter,
        fractal_type: fractalType,
        julia_c_real: juliaCReal,
        julia_c_imag: juliaCImag,
        color_scheme: colorScheme,
        lsystem_preset: lsystemPreset,
        lsystem_iterations: lsystemIterations,
        lsystem_angle: lsystemAngle,
        custom_axiom: customAxiom,
        custom_rules: customRules
      };
      
      const queryString = new URLSearchParams(params).toString();
      console.log('Fetching fractal with params:', params);
      
      const response = await fetch(`/api/fractal?${queryString}`);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      console.log('Blob received:', blob.type, blob.size);
      
      const imageUrl = URL.createObjectURL(blob);
      const img = new Image();
      
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0);
        }
        
        setCurrentImage(img);
        URL.revokeObjectURL(imageUrl);
        
        const endTime = performance.now();
        const time = ((endTime - startTime) / 1000).toFixed(2);
        setGenerationTime(`Generated in ${time}s`);
        setLoading(false);
      };
      
      img.onerror = (e) => {
        console.error('Failed to load generated image', e);
        setGenerationTime('Error loading image');
        setLoading(false);
      };
      
      img.src = imageUrl;
      
    } catch (error) {
      console.error('Error generating fractal:', error);
      setGenerationTime(`Error: ${error.message}`);
      setLoading(false);
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
          
          <canvas ref={canvasRef} id="fractal-canvas" width={width} height={height} />
          
          <div className="fractal-info">
            <span className="generation-time">{generationTime}</span>
            <button onClick={downloadCanvas} className="download-button">💾 Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}

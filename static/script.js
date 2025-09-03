class FractalGenerator {
    constructor() {
        this.canvas = document.getElementById('fractal-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.loadingElement = document.getElementById('loading');
        this.generationTimeElement = document.getElementById('generation-time');
        this.zoomIndicator = document.getElementById('zoom-indicator');
        
        this.isDragging = false;
        this.lastMousePos = { x: 0, y: 0 };
        
        // Animation properties
        this.currentImage = null;
        this.previousImage = null;
        this.animationId = null;
        this.animationStartTime = 0;
        this.animationDuration = 300; // milliseconds
        this.isAnimating = false;
        this.pendingZoom = null;
        this.zoomThrottle = null;
        
        this.initializeControls();
        this.setupEventListeners();
        this.generateFractal();
    }

    initializeControls() {
        // Update zoom display
        const zoomSlider = document.getElementById('zoom');
        const zoomValue = document.getElementById('zoom-value');
        zoomSlider.addEventListener('input', () => {
            zoomValue.textContent = parseFloat(zoomSlider.value).toFixed(1);
        });

        // Show/hide Julia controls
        const fractalType = document.getElementById('fractal-type');
        const juliaControls = document.querySelector('.julia-controls');
        
        fractalType.addEventListener('change', () => {
            if (fractalType.value === 'julia') {
                juliaControls.style.display = 'block';
            } else {
                juliaControls.style.display = 'none';
            }
        });
    }

    setupEventListeners() {
        // Generate button
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.generateFractal();
        });

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetView();
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.applyPreset(btn.dataset.preset);
            });
        });

        // Canvas mouse events for panning
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMousePos = this.getMousePos(e);
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const currentPos = this.getMousePos(e);
                const deltaX = currentPos.x - this.lastMousePos.x;
                const deltaY = currentPos.y - this.lastMousePos.y;
                
                this.pan(deltaX, deltaY);
                this.lastMousePos = currentPos;
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                // Store current image before generating new one
                if (this.currentImage) {
                    this.previousImage = this.currentImage;
                }
                this.generateFractal();
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });

        // Canvas wheel event for zooming with smooth animation
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const mousePos = this.getMousePos(e);
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            
            // Throttle zoom events to prevent overwhelming the server
            if (this.zoomThrottle) {
                clearTimeout(this.zoomThrottle);
            }
            
            this.zoomThrottle = setTimeout(() => {
                this.smoothZoom(zoomFactor, mousePos);
            }, 50);
        });

        // Auto-generate on control changes
        const autoGenerateControls = ['fractal-type', 'color-scheme'];
        autoGenerateControls.forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.generateFractal();
            });
        });
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    pan(deltaX, deltaY) {
        const centerX = document.getElementById('center-x');
        const centerY = document.getElementById('center-y');
        const zoom = parseFloat(document.getElementById('zoom').value);
        const width = parseInt(document.getElementById('width').value);
        const height = parseInt(document.getElementById('height').value);
        
        const scale = 4.0 / (zoom * Math.min(width, height));
        
        centerX.value = (parseFloat(centerX.value) - deltaX * scale).toFixed(6);
        centerY.value = (parseFloat(centerY.value) - deltaY * scale).toFixed(6);
    }

    zoom(factor, mousePos) {
        const zoomSlider = document.getElementById('zoom');
        const centerX = document.getElementById('center-x');
        const centerY = document.getElementById('center-y');
        const width = parseInt(document.getElementById('width').value);
        const height = parseInt(document.getElementById('height').value);
        
        const currentZoom = parseFloat(zoomSlider.value);
        const newZoom = Math.max(0.1, Math.min(100, currentZoom * factor));
        
        if (mousePos) {
            // Zoom towards mouse position
            const scale = 4.0 / (currentZoom * Math.min(width, height));
            const mouseX = (mousePos.x - width / 2) * scale + parseFloat(centerX.value);
            const mouseY = (mousePos.y - height / 2) * scale + parseFloat(centerY.value);
            
            const zoomFactor = newZoom / currentZoom;
            const newCenterX = mouseX + (parseFloat(centerX.value) - mouseX) / zoomFactor;
            const newCenterY = mouseY + (parseFloat(centerY.value) - mouseY) / zoomFactor;
            
            centerX.value = newCenterX.toFixed(6);
            centerY.value = newCenterY.toFixed(6);
        }
        
        zoomSlider.value = newZoom;
        document.getElementById('zoom-value').textContent = newZoom.toFixed(1);
    }

    smoothZoom(factor, mousePos) {
        // Store current image for smooth transition
        if (this.currentImage && !this.isAnimating) {
            this.previousImage = this.currentImage;
        }
        
        // Update zoom parameters
        this.zoom(factor, mousePos);
        
        // Start smooth zoom animation if we have a previous image
        if (this.previousImage && !this.isAnimating) {
            this.startZoomAnimation(factor, mousePos);
        }
        
        // Generate new fractal
        this.generateFractal();
    }

    startZoomAnimation(factor, mousePos) {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.isAnimating = true;
        this.animationStartTime = performance.now();
        
        // Show zoom indicator
        this.zoomIndicator.classList.add('active');
        
        const animate = (currentTime) => {
            const elapsed = currentTime - this.animationStartTime;
            const progress = Math.min(elapsed / this.animationDuration, 1);
            
            // Easing function for smooth animation
            const easeProgress = this.easeInOutCubic(progress);
            
            this.renderZoomTransition(easeProgress, factor, mousePos);
            
            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                this.animationId = null;
                // Hide zoom indicator
                this.zoomIndicator.classList.remove('active');
                // Final render will be handled by the new fractal image loading
            }
        };
        
        this.animationId = requestAnimationFrame(animate);
    }

    renderZoomTransition(progress, zoomFactor, mousePos) {
        if (!this.previousImage) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        // Calculate zoom transition
        const currentScale = 1 + (zoomFactor - 1) * progress;
        const centerX = mousePos ? mousePos.x : width / 2;
        const centerY = mousePos ? mousePos.y : height / 2;
        
        // Save context for transformation
        this.ctx.save();
        
        // Apply zoom transformation
        this.ctx.translate(centerX, centerY);
        this.ctx.scale(currentScale, currentScale);
        this.ctx.translate(-centerX, -centerY);
        
        // Apply fade effect
        this.ctx.globalAlpha = 1 - progress * 0.3;
        
        // Draw the previous image with transformation
        this.ctx.drawImage(this.previousImage, 0, 0, width, height);
        
        // Restore context
        this.ctx.restore();
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    resetView() {
        // Store current image for smooth transition
        if (this.currentImage) {
            this.previousImage = this.currentImage;
        }
        
        document.getElementById('zoom').value = '1';
        document.getElementById('zoom-value').textContent = '1.0';
        document.getElementById('center-x').value = '0';
        document.getElementById('center-y').value = '0';
        this.generateFractal();
    }

    applyPreset(preset) {
        const presets = {
            'mandelbrot-default': {
                fractalType: 'mandelbrot',
                zoom: 1,
                centerX: 0,
                centerY: 0,
                colorScheme: 'classic'
            },
            'mandelbrot-zoom': {
                fractalType: 'mandelbrot',
                zoom: 50,
                centerX: -0.7269,
                centerY: 0.1889,
                colorScheme: 'fire'
            },
            'julia-spiral': {
                fractalType: 'julia',
                zoom: 1,
                centerX: 0,
                centerY: 0,
                juliaCReal: -0.8,
                juliaCImag: 0.156,
                colorScheme: 'ocean'
            },
            'julia-dendrite': {
                fractalType: 'julia',
                zoom: 1,
                centerX: 0,
                centerY: 0,
                juliaCReal: 0,
                juliaCImag: 1,
                colorScheme: 'classic'
            }
        };

        const config = presets[preset];
        if (!config) return;

        // Store current image for smooth transition
        if (this.currentImage) {
            this.previousImage = this.currentImage;
        }

        document.getElementById('fractal-type').value = config.fractalType;
        document.getElementById('zoom').value = config.zoom;
        document.getElementById('zoom-value').textContent = config.zoom.toFixed(1);
        document.getElementById('center-x').value = config.centerX;
        document.getElementById('center-y').value = config.centerY;
        document.getElementById('color-scheme').value = config.colorScheme;

        if (config.juliaCReal !== undefined) {
            document.getElementById('julia-c-real').value = config.juliaCReal;
        }
        if (config.juliaCImag !== undefined) {
            document.getElementById('julia-c-imag').value = config.juliaCImag;
        }

        // Show/hide Julia controls
        const juliaControls = document.querySelector('.julia-controls');
        juliaControls.style.display = config.fractalType === 'julia' ? 'block' : 'none';

        this.generateFractal();
    }

    getParameters() {
        return {
            width: parseInt(document.getElementById('width').value),
            height: parseInt(document.getElementById('height').value),
            zoom: parseFloat(document.getElementById('zoom').value),
            center_x: parseFloat(document.getElementById('center-x').value),
            center_y: parseFloat(document.getElementById('center-y').value),
            max_iter: parseInt(document.getElementById('max-iter').value),
            fractal_type: document.getElementById('fractal-type').value,
            julia_c_real: parseFloat(document.getElementById('julia-c-real').value),
            julia_c_imag: parseFloat(document.getElementById('julia-c-imag').value),
            color_scheme: document.getElementById('color-scheme').value
        };
    }

    async generateFractal() {
        const startTime = performance.now();
        
        // Don't show loading overlay during smooth zoom animations
        if (!this.isAnimating) {
            this.showLoading(true);
        }

        try {
            const params = this.getParameters();
            
            // Update canvas size
            this.canvas.width = params.width;
            this.canvas.height = params.height;

            // Build query string
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`/api/fractal?${queryString}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            
            const img = new Image();
            img.onload = () => {
                // Only draw immediately if not animating
                if (!this.isAnimating) {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.drawImage(img, 0, 0);
                }
                
                // Store the new image for future animations
                this.currentImage = img;
                
                // If animation finished while loading, draw the final image
                if (!this.isAnimating && this.currentImage) {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.drawImage(this.currentImage, 0, 0);
                }
                
                URL.revokeObjectURL(imageUrl);
                
                const endTime = performance.now();
                const generationTime = ((endTime - startTime) / 1000).toFixed(2);
                this.generationTimeElement.textContent = `Generated in ${generationTime}s`;
                
                this.showLoading(false);
            };
            
            img.onerror = () => {
                console.error('Failed to load generated image');
                this.showLoading(false);
            };
            
            img.src = imageUrl;

        } catch (error) {
            console.error('Error generating fractal:', error);
            this.generationTimeElement.textContent = 'Error generating fractal';
            this.showLoading(false);
        }
    }

    showLoading(show) {
        this.loadingElement.style.display = show ? 'block' : 'none';
    }
}

// Initialize the fractal generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FractalGenerator();
});

// Add some helper functions for better UX
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        document.getElementById('generate-btn').click();
    }
});

// Add download functionality
function downloadCanvas() {
    const canvas = document.getElementById('fractal-canvas');
    const link = document.createElement('a');
    link.download = 'fractal.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Add download button to the page
window.addEventListener('load', () => {
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '💾 Download Image';
    downloadBtn.className = 'generate-button';
    downloadBtn.style.marginTop = '10px';
    downloadBtn.onclick = downloadCanvas;
    
    document.querySelector('.control-group:last-of-type').appendChild(downloadBtn);
});

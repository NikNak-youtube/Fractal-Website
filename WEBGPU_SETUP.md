# WebGPU Setup Guide

## 🚀 Quick Check

Open the browser console (F12) when you visit the app. You should see:

```
✅ WebGPU initialized successfully!
Adapter: [Your GPU Name]
Features: [List of supported features]
```

If you see errors, follow the instructions below for your platform.

---

## 🐧 Linux (Chromium/Chrome on Arch)

### Step-by-Step Instructions

1. **Enable WebGPU Flags**
   
   Open Chromium/Chrome and navigate to:
   ```
   chrome://flags
   ```

   Enable these two flags:
   - Search for: `#enable-unsafe-webgpu` → Set to **Enabled**
   - Search for: `#enable-vulkan` → Set to **Enabled**

   Click "Relaunch" to restart the browser.

2. **Install Vulkan Support**

   ```bash
   # Check if Vulkan is already installed
   vulkaninfo
   
   # If not found, install Vulkan tools
   sudo pacman -S vulkan-tools vulkan-icd-loader
   
   # Install Vulkan drivers for your GPU:
   
   # For NVIDIA:
   sudo pacman -S nvidia nvidia-utils vulkan-icd-loader
   
   # For AMD:
   sudo pacman -S vulkan-radeon lib32-vulkan-radeon vulkan-icd-loader
   
   # For Intel:
   sudo pacman -S vulkan-intel lib32-vulkan-intel vulkan-icd-loader
   ```

3. **Verify Vulkan Works**

   ```bash
   vulkaninfo | grep "deviceName"
   ```
   
   You should see your GPU name listed.

4. **Restart Browser**

   Completely close and reopen Chromium/Chrome.

5. **Test WebGPU**

   Visit the fractal generator app and check the browser console.

### Troubleshooting Linux

**Issue**: `vulkaninfo: error while loading shared libraries`
```bash
# Install 32-bit Vulkan support
sudo pacman -S lib32-vulkan-icd-loader

# For NVIDIA
sudo pacman -S lib32-nvidia-utils

# For AMD  
sudo pacman -S lib32-vulkan-radeon

# For Intel
sudo pacman -S lib32-vulkan-intel
```

**Issue**: WebGPU still shows "Not Available"
1. Check Chrome version: `chrome://version` (should be 113+)
2. Verify Vulkan: `vulkaninfo` should not error
3. Check GPU permissions: Add your user to the video group
   ```bash
   sudo usermod -aG video $USER
   # Log out and back in
   ```

**Issue**: Permission denied errors
```bash
# Check GPU device permissions
ls -la /dev/dri/

# Should show your user or video group has access
# If not, add to video group:
sudo usermod -aG video $USER
sudo usermod -aG render $USER
```

---

## 🪟 Windows (Chrome/Edge)

### Requirements
- Windows 10 version 1809+ or Windows 11
- Chrome 113+ or Edge 113+
- Updated GPU drivers

### Instructions

1. **Update GPU Drivers**
   - NVIDIA: Download from [nvidia.com](https://www.nvidia.com/download/index.aspx)
   - AMD: Download from [amd.com](https://www.amd.com/en/support)
   - Intel: Use Windows Update or [intel.com](https://www.intel.com/content/www/us/en/download-center/home.html)

2. **Update Browser**
   - Chrome should be version 113 or higher
   - Edge should be version 113 or higher

3. **WebGPU Should Work Automatically**
   - No flags needed on Windows (Chrome 113+)
   - Just visit the app!

### Troubleshooting Windows

If WebGPU doesn't work:
1. Visit `chrome://gpu` and check for errors
2. Ensure "WebGPU" shows as "Hardware accelerated"
3. Update Windows: Settings → Windows Update
4. Disable antivirus/firewall temporarily to test

---

## 🍎 macOS (Chrome/Safari)

### Chrome on macOS
- Update to Chrome 113+
- WebGPU should work automatically

### Safari on macOS
- Update to macOS Sonoma (14.0+) with Safari 17+
- Or macOS Sequoia (15.0+) with Safari 18+
- WebGPU enabled by default in Safari 18+

---

## 📱 Mobile Devices

### Android
1. **Update Chrome**
   - Open Google Play Store
   - Update Chrome to version 121 or higher

2. **Test the App**
   - Visit the fractal generator
   - WebGPU should work automatically

### iOS/iPadOS
1. **Update iOS**
   - Settings → General → Software Update
   - Update to iOS 18.0 or higher

2. **Safari 18**
   - Safari 18 includes WebGPU support
   - No additional setup needed

---

## 🦊 Firefox (Experimental)

### Enable WebGPU in Firefox

1. Navigate to: `about:config`
2. Click "Accept the Risk and Continue"
3. Search for: `dom.webgpu.enabled`
4. Toggle to: `true`
5. Restart Firefox

**Note**: Firefox WebGPU support is experimental and may be unstable.

---

## 🧪 Testing WebGPU

### Simple Browser Test

Open the browser console (F12) and run:

```javascript
if (navigator.gpu) {
  navigator.gpu.requestAdapter().then(adapter => {
    if (adapter) {
      console.log('✅ WebGPU is available!');
      console.log('Adapter:', adapter);
    } else {
      console.log('❌ No GPU adapter found');
    }
  });
} else {
  console.log('❌ WebGPU not supported');
}
```

### Check GPU Info

Visit: `chrome://gpu` (in Chrome/Chromium)

Look for:
- **WebGPU**: Should say "Hardware accelerated" or "Supported"
- **Vulkan**: Should be enabled (on Linux)
- **GPU Driver**: Should show your GPU name

---

## 📊 Performance Comparison

| Resolution | Max Iterations | Canvas API (CPU) | WebGPU (GPU) | Speedup |
|------------|----------------|------------------|--------------|---------|
| 800x600    | 100            | ~200ms          | ~20ms        | 10x     |
| 1920x1080  | 256            | ~1200ms         | ~30ms        | 40x     |
| 3840x2160  | 512            | ~8000ms         | ~80ms        | 100x    |

*Times are approximate and depend on your hardware*

---

## ❓ FAQ

**Q: Why do I need to enable flags on Linux?**  
A: WebGPU on Linux requires Vulkan support, which is still being finalized. The flags are required until it's production-ready.

**Q: Is WebGPU safe?**  
A: Yes! While Chrome calls it "unsafe-webgpu" in the flag name, this just means it's in development. It's safe to use.

**Q: Will it damage my GPU?**  
A: No. WebGPU uses standard GPU APIs and has safety limits to prevent overheating or damage.

**Q: What if I don't have a dedicated GPU?**  
A: WebGPU works with integrated GPUs (Intel, AMD APUs) too! The performance will be lower than dedicated GPUs but still much faster than CPU rendering.

**Q: Does this work on old GPUs?**  
A: WebGPU requires Vulkan support. Most GPUs from 2016 or newer support Vulkan. Check with: `vulkaninfo`

---

## 🆘 Still Having Issues?

1. **Check the browser console** (F12 → Console tab)
2. **Look for error messages** - they often explain what's wrong
3. **Visit `chrome://gpu`** to see GPU status
4. **Try the Canvas fallback** - Uncheck "Use WebGPU" in the app settings
5. **Update everything** - Browser, OS, GPU drivers

The app will work fine without WebGPU using Canvas API - it'll just be slower!

---

## 🎉 Success!

When WebGPU is working, you'll see:
- ⚡ **"Use WebGPU Acceleration 🚀"** checkbox in the UI
- 🟢 **"(WebGPU)"** label in generation time
- 🚀 **10-100x faster** fractal rendering
- ✨ Smooth real-time zooming even at high iterations

Enjoy lightning-fast fractal exploration! 🌟

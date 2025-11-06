# Quick Reference: Enabling WebGPU

## 🐧 Arch Linux (Chromium/Chrome)

```bash
# 1. Enable flags in browser
# Navigate to: chrome://flags
# Enable: #enable-unsafe-webgpu
# Enable: #enable-vulkan
# Restart browser

# 2. Install Vulkan support
sudo pacman -S vulkan-tools vulkan-icd-loader

# 3. Install GPU-specific drivers
# For NVIDIA:
sudo pacman -S nvidia vulkan-icd-loader

# For AMD:
sudo pacman -S vulkan-radeon vulkan-icd-loader

# For Intel:
sudo pacman -S vulkan-intel vulkan-icd-loader

# 4. Verify Vulkan works
vulkaninfo | grep "deviceName"

# 5. Restart browser completely
```

## 📱 Mobile

- **Android**: Update Chrome to 121+
- **iOS**: Update to iOS 18+

## 🪟 Windows

- Update Chrome/Edge to 113+
- Update GPU drivers
- Should work automatically

## 🍎 macOS

- Chrome 113+: Works automatically
- Safari 18+: Works automatically

---

See [WEBGPU_SETUP.md](./WEBGPU_SETUP.md) for detailed troubleshooting!

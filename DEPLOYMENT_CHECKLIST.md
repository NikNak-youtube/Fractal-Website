# Deployment Checklist

## ✅ Pre-Deployment Steps

1. **Clean old files** (already done):
   - ✅ Removed `/api` folder (old Express-style API)
   - ✅ Removed `server.js` (old Express server)
   - ✅ Updated `.vercelignore`
   - ✅ Updated `vercel.json`

2. **Verify project structure**:
   ```
   ✅ app/
      ✅ api/
         ✅ fractal/route.js
         ✅ health/route.js
      ✅ page.js
      ✅ layout.js
      ✅ globals.css
   ✅ lib/
      ✅ fractal-utils.js
   ✅ public/ (for static assets)
   ✅ package.json (Next.js dependencies)
   ✅ next.config.js
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Test locally**:
   ```bash
   npm run dev
   ```
   - Visit http://localhost:3000
   - Generate a fractal to test API route
   - Check browser console for errors

## 🚀 Deploy to Vercel

### Option 1: Via Vercel Dashboard
1. Push code to GitHub
2. Go to vercel.com
3. Click "New Project"
4. Import your repository
5. Vercel auto-detects Next.js
6. Click "Deploy"

### Option 2: Via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 🔍 Post-Deployment Verification

1. **Test API endpoints**:
   - https://your-app.vercel.app/api/health (should return JSON)
   - https://your-app.vercel.app/api/fractal?width=400&height=400&zoom=1&center_x=0&center_y=0&max_iter=100&fractal_type=mandelbrot&color_scheme=classic (should return PNG image)

2. **Test UI**:
   - Generate Mandelbrot set
   - Generate Julia set
   - Generate L-system fractal
   - Test zoom/pan
   - Test color schemes
   - Test presets

## 🐛 Common Issues

### Issue: 404 on API routes
**Solution**: 
- Ensure old `/api` folder is deleted
- Clear `.next` cache: `rm -rf .next`
- Redeploy

### Issue: Module not found errors
**Solution**:
- Check `jsconfig.json` has correct path aliases
- Verify imports use `@/lib/...` format
- Run `npm install`

### Issue: Images not generating
**Solution**:
- Check Vercel function logs
- Verify pureimage is in `dependencies` (not devDependencies)
- Ensure image parameters are reasonable (max 2000x2000)

## ✨ Success Indicators

- ✅ Main page loads at root URL
- ✅ Fractals generate and display
- ✅ All controls work (zoom, pan, color schemes)
- ✅ Presets load correctly
- ✅ Download functionality works
- ✅ Responsive on mobile devices
- ✅ No console errors

# Vercel Deployment Guide

This project is configured to deploy seamlessly on Vercel.

## 🚀 Quick Deploy

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com/)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the configuration
6. Click "Deploy"
7. Done! Your fractal generator is live

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Deploy to production
vercel --prod
```

## 📁 Project Structure for Vercel

```
fractal-generator/
├── api/                    # Serverless functions
│   ├── _utils.js          # Shared utilities
│   ├── health.js          # Health check endpoint
│   └── fractal.js         # Fractal generation endpoint
├── public/                # Static files (HTML, CSS, JS) - served automatically
│   ├── index.html
│   ├── style.css
│   └── script.js
├── vercel.json            # Vercel configuration
├── .vercelignore          # Files to exclude
└── package.json           # Dependencies
```

## ⚙️ Configuration Files

### vercel.json
Defines:
- Serverless function routes (`/api/*`)
- Static file serving (`/static/*`)
- Root route redirects to main page

### .vercelignore
Excludes unnecessary files:
- `node_modules` (Vercel installs fresh)
- `server.js` (not needed for serverless)
- Git files and logs

## 🔧 How It Works

1. **Serverless Functions**: Each file in `/api` becomes an HTTP endpoint
   - `/api/health.js` → `https://your-app.vercel.app/api/health`
   - `/api/fractal.js` → `https://your-app.vercel.app/api/fractal`

2. **Static Assets**: Files in `/public` are served automatically at the root
   - `/public/index.html` → `https://your-app.vercel.app/`
   - `/public/script.js` → `https://your-app.vercel.app/script.js`
   - Optimized and cached by Vercel's CDN

3. **Image Generation**: Uses `pureimage` - a pure JavaScript library
   - No native dependencies required
   - Fully compatible with Vercel's serverless environment

## 🌐 Environment & Runtime

- **Node.js Version**: 18.x (specified in package.json)
- **Region**: Automatically selected (can be changed in dashboard)
- **Build Command**: `npm install` (automatic)
- **Output Directory**: Not needed (serverless)

## 📊 Performance Tips

1. **Enable Caching**: Fractal images are marked `no-cache` for dynamic generation
2. **Function Timeout**: Default 10s (sufficient for most fractals)
3. **Memory**: Default 1024 MB (adequate for image generation)

## 🐛 Troubleshooting

### Image Generation Issues
If fractals aren't generating:
- Check Vercel function logs in dashboard
- Ensure `pureimage` is in dependencies
- Verify image parameters are within limits (max 2000x2000 recommended)

### Build Failures
- Check Vercel build logs in dashboard
- Ensure all dependencies are in `package.json`
- Verify `vercel.json` syntax is valid

### Route Not Found
- Verify file exists in `/api` directory
- Check `vercel.json` routes configuration
- Ensure function exports correctly: `module.exports = async (req, res) => {...}`

## 🔗 Custom Domain

After deployment:
1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## 📈 Monitoring

Vercel provides:
- Real-time function logs
- Performance analytics
- Error tracking
- Bandwidth usage

Access these in your project dashboard.

## 🎉 Success!

Once deployed, your fractal generator will be available at:
`https://your-project-name.vercel.app`

Share it with the world! 🌍✨

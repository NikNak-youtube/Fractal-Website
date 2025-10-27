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
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (serverless functions)
│   │   ├── fractal/
│   │   │   └── route.js   # Fractal generation endpoint
│   │   └── health/
│   │       └── route.js   # Health check endpoint
│   ├── layout.js          # Root layout
│   ├── page.js            # Main page (React component)
│   └── globals.css        # Global styles
├── lib/                   # Utilities
│   └── fractal-utils.js  # Fractal generation logic
├── public/                # Static files - served automatically
├── next.config.js         # Next.js configuration
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

## ⚙️ Configuration Files

### vercel.json
Minimal configuration - Vercel auto-detects Next.js:
```json
{
  "version": 2
}
```

### next.config.js
Next.js configuration:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
}

module.exports = nextConfig
```

## 🔧 How It Works

1. **Next.js Framework**: Vercel automatically detects and optimizes Next.js projects
   - Zero-config deployment
   - Automatic serverless function setup
   - Built-in performance optimizations

2. **API Routes**: Files in `/app/api` become serverless endpoints
   - `/app/api/health/route.js` → `https://your-app.vercel.app/api/health`
   - `/app/api/fractal/route.js` → `https://your-app.vercel.app/api/fractal`

3. **Static Assets**: Files in `/public` are served automatically
   - Optimized and cached by Vercel's CDN
   - Next.js handles all routing and optimization

4. **Image Generation**: Uses `pureimage` - a pure JavaScript library
   - No native dependencies required
   - Fully compatible with Vercel's serverless environment

5. **React Frontend**: Server-side rendering with client-side interactivity
   - `/app/page.js` renders the main UI
   - React components for fractal controls
   - Canvas API for image display

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
- Verify API route structure: `/app/api/[endpoint]/route.js`
- Check that route exports GET/POST handlers properly:
  ```javascript
  export async function GET(request) {
    // handler code
  }
  ```
- Clear `.next` cache: `rm -rf .next && npm run build`

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

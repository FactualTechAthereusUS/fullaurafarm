# AuraMail Portal - Vercel Deployment Guide 🚀

## Architecture Overview

**Frontend**: Vercel (Global CDN)  
**Backend**: DigitalOcean (159.223.103.126)  
**Domain**: portal.aurafarming.co

## Vercel Deployment Steps

### 1. Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com)
2. Import project from GitHub
3. Select repository: `FactualTechAthereusUS/modern-employee-portal-`

### 2. Configure Environment Variables
```
NEXT_PUBLIC_API_URL=https://portal.aurafarming.co/api
```

### 3. Custom Domain Setup
1. Add domain: `portal.aurafarming.co`  
2. Configure DNS records:
   - Type: CNAME
   - Name: portal
   - Value: cname.vercel-dns.com

### 4. Build Settings
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Backend Configuration (DigitalOcean)

The backend APIs remain on DigitalOcean server and need CORS configuration:

```bash
# SSH to server
ssh root@159.223.103.126

# Update Apache CORS headers
sudo nano /etc/apache2/sites-available/employee-portal.conf

# Add CORS headers:
Header always set Access-Control-Allow-Origin "https://portal.aurafarming.co"
Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"

# Reload Apache
sudo systemctl reload apache2
```

## Real-time Features ✅

- ✅ Username availability checking (500ms debounce)
- ✅ Password strength indicators 
- ✅ Form validation feedback
- ✅ Professional UI with animations
- ✅ Global CDN delivery

## Performance Benefits

- **Global CDN**: Sub-100ms load times worldwide
- **Edge Computing**: Server-side rendering at edge
- **Automatic Scaling**: Handle traffic spikes
- **Zero Config**: Automatic HTTPS, compression, caching

## Monitoring & Analytics

Vercel automatically provides:
- Real-time analytics
- Core Web Vitals
- Performance insights
- Error tracking

---

**Deploy URL**: https://portal.aurafarming.co  
**Admin Panel**: https://vercel.com/dashboard  
**GitHub**: https://github.com/FactualTechAthereusUS/modern-employee-portal- 
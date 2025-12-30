# Deployment Guide

## Pre-Deployment Checklist

- [ ] Backend API is deployed and accessible
- [ ] Environment variables configured
- [ ] CORS configured on backend to allow frontend domain
- [ ] SSL/HTTPS enabled (production requirement)
- [ ] Error tracking configured (optional but recommended)

## Environment Configuration

### Required Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

**Important:** The `NEXT_PUBLIC_` prefix is required for client-side access in Next.js.

## Deployment Platforms

### Vercel (Recommended)

1. Push code to GitHub/GitLab/Bitbucket

2. Import project in Vercel dashboard

3. Configure environment variables:
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL`

4. Deploy:
   ```bash
   # Vercel will auto-deploy on git push
   # Or manually trigger:
   vercel --prod
   ```

### Netlify

1. Connect repository

2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

3. Add environment variables in Site Settings

4. Deploy

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api -t invoicing-frontend .
docker run -p 3000:3000 invoicing-frontend
```

### AWS (EC2/ECS)

1. Build the application:
   ```bash
   npm run build
   ```

2. Transfer files to server

3. Install dependencies:
   ```bash
   npm ci --production
   ```

4. Set environment variables:
   ```bash
   export NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
   ```

5. Start with PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "invoicing-frontend" -- start
   pm2 save
   pm2 startup
   ```

## Post-Deployment Verification

1. **Test Authentication Flow**
   - Register new account
   - Login with credentials
   - Verify token storage
   - Test logout

2. **Test Protected Routes**
   - Access dashboard while logged in
   - Try accessing dashboard while logged out
   - Verify redirect to login

3. **Test API Integration**
   - Check browser console for errors
   - Verify API calls in Network tab
   - Test error handling (disconnect backend)

4. **Performance Check**
   - Run Lighthouse audit
   - Check bundle size
   - Verify loading times

## Monitoring

### Recommended Tools

- **Error Tracking**: Sentry, Rollbar
- **Analytics**: Google Analytics, Plausible
- **Performance**: Vercel Analytics, New Relic
- **Uptime**: UptimeRobot, Pingdom

### Adding Sentry (Example)

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Security Hardening

### 1. Content Security Policy

Add to `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};
```

### 2. Environment Variable Validation

Add to `app/lib/config.ts`:

```typescript
function validateEnv() {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }
}

validateEnv();
```

### 3. Rate Limiting

Implement on backend, but add client-side debouncing for forms.

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Ensure `NEXT_PUBLIC_` prefix for client-side variables
- Restart dev server after changing `.env.local`
- Check variable is set in deployment platform

### API Calls Failing

- Verify CORS configuration on backend
- Check `NEXT_PUBLIC_API_URL` is correct
- Ensure backend is accessible from frontend domain
- Check browser console for CORS errors

### 401 Errors After Deployment

- Backend may have restarted (invalidating tokens)
- Token format may differ between environments
- Check token expiration time

## Rollback Procedure

### Vercel
```bash
vercel rollback
```

### Docker
```bash
docker pull invoicing-frontend:previous-tag
docker stop current-container
docker run -d invoicing-frontend:previous-tag
```

### Manual
1. Checkout previous commit
2. Rebuild and redeploy

## Performance Optimization

### 1. Enable Compression

Most platforms enable this by default. For custom servers:

```javascript
// server.js
const compression = require('compression');
app.use(compression());
```

### 2. Image Optimization

Next.js handles this automatically with `next/image`.

### 3. Code Splitting

Already handled by Next.js App Router.

### 4. Caching

Add to `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

## Scaling Considerations

- Use CDN for static assets (Vercel/Netlify handle this)
- Implement Redis for session storage if moving away from localStorage
- Consider server-side rendering for SEO-critical pages
- Add load balancer for multiple instances

## Backup Strategy

- Git repository serves as code backup
- Environment variables should be documented securely
- Database backups handled by backend team
- Consider backing up user-uploaded files separately

## Support

For issues:
1. Check browser console for errors
2. Verify environment variables
3. Test backend API directly
4. Check deployment platform logs
5. Review this guide's troubleshooting section

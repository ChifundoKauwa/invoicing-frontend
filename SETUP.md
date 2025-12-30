# Quick Setup Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Running backend API

## Installation Steps

### 1. Install Dependencies

```bash
cd invoicing-frontend
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and update the API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Replace `http://localhost:8000/api` with your actual backend URL.

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Test the Application

1. **Register a new account**
   - Navigate to http://localhost:3000
   - Click "Create Account"
   - Fill in the registration form
   - Submit

2. **Login**
   - Use your registered credentials
   - You should be redirected to the dashboard

3. **Access Protected Routes**
   - Dashboard: http://localhost:3000/dashboard
   - Invoices: http://localhost:3000/invoices

4. **Test Logout**
   - Click "Sign Out" in the dashboard
   - You should be redirected to login

## Troubleshooting

### "Network error" when trying to login

**Problem**: Frontend can't reach the backend API

**Solutions**:
1. Verify backend is running
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser console for CORS errors
4. Ensure backend CORS is configured to allow frontend origin

### Build fails on Windows

**Problem**: File locks or permission issues

**Solution**:
```bash
# Close all terminals and editors
# Then try:
npm run dev
# Instead of npm run build
```

### "Module not found" errors

**Problem**: Dependencies not installed

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors

**Problem**: Type mismatches with backend

**Solution**:
1. Check `app/lib/types.ts`
2. Update types to match your backend API responses
3. Run `npm run type-check` to verify

### 401 errors after login

**Problem**: Token not being sent or backend rejecting it

**Solutions**:
1. Check browser localStorage for `auth_token`
2. Verify backend accepts `Bearer {token}` format
3. Check token expiration time
4. Clear localStorage and login again

## Backend API Requirements

The frontend expects these endpoints:

### Authentication

```
POST /auth/register
Body: { name: string, email: string, password: string }
Response: { access_token: string, token_type: string, user: User }

POST /auth/login
Body: { email: string, password: string }
Response: { access_token: string, token_type: string, user: User }

GET /auth/me
Headers: Authorization: Bearer {token}
Response: { id: string, email: string, name: string, created_at: string, updated_at: string }
```

### Invoices

```
GET /invoices
Headers: Authorization: Bearer {token}
Response: { data: Invoice[] }
```

### CORS Configuration

Your backend must allow requests from the frontend origin:

```python
# Example for FastAPI/Python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Next Steps

1. **Update API Types**
   - Edit `app/lib/types.ts` to match your backend contracts
   - Add new types as you add features

2. **Customize UI**
   - Modify Tailwind classes in components
   - Update colors in `tailwind.config.js` (if needed)

3. **Add Features**
   - Follow the pattern in existing pages
   - Use `ProtectedRoute` for authenticated pages
   - Use `apiClient` for all API calls

4. **Deploy**
   - See `DEPLOYMENT.md` for deployment instructions
   - Remember to set environment variables in your hosting platform

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## Project Structure

```
app/
├── components/          # Shared UI components
├── contexts/           # React contexts (auth)
├── lib/               # Utilities and types
├── login/             # Login page
├── register/          # Registration page
├── dashboard/         # Dashboard page
├── invoices/          # Invoices page
├── layout.tsx         # Root layout
└── page.tsx           # Home page
```

## Getting Help

1. Check `README.md` for architecture details
2. Check `ARCHITECTURE.md` for design decisions
3. Check `DEPLOYMENT.md` for deployment help
4. Review inline code comments
5. Check browser console for errors
6. Check Network tab for API call details

## Common Development Tasks

### Adding a New Page

1. Create folder: `app/my-page/`
2. Create file: `app/my-page/page.tsx`
3. Add component with `export default`
4. Wrap with `<ProtectedRoute>` if auth required

### Adding a New API Call

```typescript
import apiClient from '@/app/lib/api-client';

const data = await apiClient.get<ResponseType>('/endpoint');
```

### Adding a New Type

```typescript
// app/lib/types.ts
export interface MyType {
  id: string;
  name: string;
}
```

### Handling Errors

```typescript
try {
  await apiClient.get('/endpoint');
} catch (err) {
  const apiError = err as ApiError;
  setError(apiError.message);
}
```

## Production Checklist

Before deploying to production:

- [ ] Update `NEXT_PUBLIC_API_URL` to production backend
- [ ] Test all authentication flows
- [ ] Test error handling
- [ ] Verify CORS configuration
- [ ] Enable HTTPS
- [ ] Add error tracking (Sentry)
- [ ] Add analytics (optional)
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit
- [ ] Review security considerations in README

## Support

For issues or questions:
1. Review the documentation files
2. Check the inline code comments
3. Verify backend is working correctly
4. Check browser developer tools

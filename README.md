# Invoicing Frontend

Production-ready Next.js frontend for the invoicing system. Built with TypeScript, App Router, and client-side data fetching.

## Architecture Overview

### Feature-Based Structure
```
app/
├── components/          # Shared UI components
│   └── protected-route.tsx
├── contexts/           # React contexts for state management
│   └── auth-context.tsx
├── lib/               # Core utilities and types
│   ├── api-client.ts  # Centralized HTTP client
│   └── types.ts       # TypeScript type definitions
├── login/             # Login feature
├── register/          # Registration feature
├── dashboard/         # Protected dashboard
└── invoices/          # Invoice management
```

### Key Design Decisions

**1. API Client (`app/lib/api-client.ts`)**
- Centralized fetch wrapper with JWT token management
- Automatic token attachment to requests
- 401 handling with automatic redirect to login
- Error normalization for consistent error handling
- Uses localStorage for token storage (consider httpOnly cookies for production)

**2. Authentication (`app/contexts/auth-context.tsx`)**
- Lightweight React Context for auth state
- No heavy state management libraries (Redux, Zustand)
- Backend remains source of truth
- Token validation on mount
- Automatic cleanup on logout

**3. Protected Routes (`app/components/protected-route.tsx`)**
- Client-side route protection for UX
- Shows loading states during auth check
- Redirects unauthenticated users to login
- **Important**: Backend must enforce all access control

**4. Type Safety (`app/lib/types.ts`)**
- Strict TypeScript types matching backend contracts
- Update these types based on your actual API responses
- Prevents runtime errors and improves DX

## Getting Started

### Prerequisites
- Node.js 18+ 
- Running backend API

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp ../.env.example .env.local
```

3. Update `.env.local` with your backend URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## API Integration

### Backend Contract Assumptions

The frontend expects these endpoints:

**Authentication**
- `POST /auth/register` - User registration
  - Body: `{ name, email, password }`
  - Response: `{ access_token, token_type, user }`
  
- `POST /auth/login` - User login
  - Body: `{ email, password }`
  - Response: `{ access_token, token_type, user }`
  
- `GET /auth/me` - Get current user
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ id, email, name, created_at, updated_at }`

**Invoices**
- `GET /invoices` - List invoices
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ data: Invoice[] }`

### Updating API Contracts

If your backend uses different endpoints or response structures:

1. Update `app/lib/types.ts` with correct types
2. Update API calls in components to match endpoints
3. Update `app/lib/api-client.ts` if auth flow differs

## Authentication Flow

1. User submits login/register form
2. API client sends request (without auth token)
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. Auth context updates user state
6. User redirected to dashboard
7. All subsequent requests include token in Authorization header
8. On 401 response, token cleared and user redirected to login

## State Management

**Why no Redux/Zustand?**
- Authentication state is simple (user object + loading flag)
- React Context is sufficient for this use case
- Reduces bundle size and complexity
- Easy to upgrade later if needed

**When to add state management:**
- Complex cross-feature state sharing
- Optimistic updates with rollback
- Advanced caching requirements
- Consider TanStack Query for server state

## Security Considerations

**Current Implementation:**
- JWT stored in localStorage
- Client-side route protection (UX only)
- Automatic token cleanup on 401

**Production Recommendations:**
1. Use httpOnly cookies for token storage
2. Implement CSRF protection
3. Add rate limiting on backend
4. Use HTTPS in production
5. Implement refresh token rotation
6. Add request signing for sensitive operations

**Remember:** All security enforcement must happen on the backend. Frontend protection is for UX only.

## Error Handling

The app handles three types of errors:

1. **Network Errors** - Connection failures
2. **API Errors** - Backend validation/business logic errors
3. **Auth Errors** - 401 responses trigger automatic logout

All errors are normalized through the API client for consistent handling.

## Loading States

Every data-fetching component implements:
- Loading spinner during fetch
- Error state with retry option
- Empty state when no data
- Success state with data display

## Extending the Application

### Adding a New Feature

1. Create feature folder: `app/my-feature/`
2. Add page component: `app/my-feature/page.tsx`
3. Add types to `app/lib/types.ts`
4. Use API client for data fetching
5. Wrap with `<ProtectedRoute>` if auth required

### Adding a New API Endpoint

```typescript
// In your component
import apiClient from '@/app/lib/api-client';

const data = await apiClient.get<ResponseType>('/endpoint');
```

### Adding Shared Components

Place in `app/components/` and import where needed.

## Testing

Currently no tests included. Recommended additions:

- Unit tests for API client
- Integration tests for auth flow
- E2E tests for critical paths (login, invoice creation)

## Deployment

### Environment Variables

Set in your deployment platform:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

## Common Issues

**"Network error" on API calls**
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend is running
- Check CORS configuration on backend

**Infinite redirect loop**
- Clear localStorage
- Check token validation endpoint (`/auth/me`)
- Verify backend returns correct user object

**401 errors**
- Token may be expired
- Backend may have restarted (invalidating tokens)
- Check token format in Authorization header

## Code Quality

This codebase follows:
- TypeScript strict mode
- Explicit error handling
- Inline documentation for architectural decisions
- Production-ready patterns (no TODOs or placeholders)
- Clean, minimal UI with proper states

## Next Steps

Recommended enhancements:
1. Add TanStack Query for better data fetching
2. Implement invoice creation/editing
3. Add client management
4. Implement file uploads for invoice attachments
5. Add pagination for invoice list
6. Implement search and filtering
7. Add unit and E2E tests
8. Move to httpOnly cookies for tokens
9. Add refresh token flow
10. Implement proper error boundary

## License

[Your License]

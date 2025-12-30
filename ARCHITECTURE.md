# Frontend Architecture

## Overview

This is a production-ready Next.js frontend built with the App Router, TypeScript strict mode, and client-side data fetching. The architecture prioritizes simplicity, maintainability, and extensibility without over-engineering.

## Core Principles

1. **Backend as Source of Truth** - All business logic and enforcement happens on the backend
2. **Client-Side Simplicity** - No unnecessary state management libraries
3. **Type Safety** - Strict TypeScript throughout
4. **Feature-Based Organization** - Code organized by feature, not by type
5. **Production Quality** - No placeholders, TODOs, or demo code

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **HTTP Client**: Native Fetch API
- **State Management**: React Context (auth only)
- **Routing**: Next.js App Router

### Why These Choices?

**Next.js App Router**
- Modern React patterns (Server Components when needed)
- Built-in routing and layouts
- Excellent developer experience
- Production-ready out of the box

**Native Fetch over Axios**
- Smaller bundle size
- Native browser API
- Sufficient for our needs
- Easy to wrap and extend

**React Context over Redux/Zustand**
- Authentication state is simple
- No complex cross-feature state
- Reduces bundle size
- Easy to upgrade later if needed

**No TanStack Query (yet)**
- Recommended for future enhancement
- Current implementation is sufficient for MVP
- Easy to add incrementally

## Directory Structure

```
app/
├── components/              # Shared UI components
│   ├── protected-route.tsx  # Route protection wrapper
│   ├── loading-spinner.tsx  # Loading states
│   ├── error-message.tsx    # Error displays
│   └── empty-state.tsx      # Empty state displays
│
├── contexts/               # React contexts
│   └── auth-context.tsx    # Authentication state
│
├── lib/                    # Core utilities
│   ├── api-client.ts       # HTTP client wrapper
│   └── types.ts            # TypeScript definitions
│
├── login/                  # Login feature
│   └── page.tsx
│
├── register/               # Registration feature
│   └── page.tsx
│
├── dashboard/              # Dashboard feature
│   └── page.tsx
│
├── invoices/               # Invoice management
│   └── page.tsx
│
├── layout.tsx              # Root layout with providers
├── page.tsx                # Home/landing page
└── globals.css             # Global styles
```

## Key Components

### 1. API Client (`app/lib/api-client.ts`)

**Purpose**: Centralized HTTP client for all API communication

**Responsibilities**:
- JWT token management (get, set, clear)
- Automatic token attachment to requests
- 401 handling with redirect to login
- Error normalization
- Request/response interceptors

**Key Methods**:
```typescript
apiClient.get<T>(endpoint, config?)
apiClient.post<T>(endpoint, body?, config?)
apiClient.put<T>(endpoint, body?, config?)
apiClient.patch<T>(endpoint, body?, config?)
apiClient.delete<T>(endpoint, config?)
```

**Design Decisions**:
- Singleton pattern for consistent state
- Token stored in localStorage (consider httpOnly cookies for production)
- Automatic redirect on 401 prevents stale auth state
- Generic types for type-safe responses

**Security Considerations**:
- localStorage is vulnerable to XSS
- Production should use httpOnly cookies
- All sensitive operations must be validated on backend

### 2. Auth Context (`app/contexts/auth-context.tsx`)

**Purpose**: Manage authentication state across the application

**State**:
```typescript
{
  user: User | null,
  isLoading: boolean,
  isAuthenticated: boolean
}
```

**Methods**:
```typescript
login(credentials: LoginRequest): Promise<void>
register(data: RegisterRequest): Promise<void>
logout(): void
refreshUser(): Promise<void>
```

**Design Decisions**:
- Validates token on mount by fetching current user
- Clears state on 401 errors
- Provides loading state for initial auth check
- No complex state updates (just user object)

**Why Context over Redux**:
- Auth state is simple (user + loading flag)
- No complex state transformations
- No need for middleware
- Easier to understand and maintain
- Can upgrade to Redux later if needed

### 3. Protected Route (`app/components/protected-route.tsx`)

**Purpose**: Wrap pages that require authentication

**Behavior**:
1. Shows loading spinner while checking auth
2. Redirects to login if not authenticated
3. Renders children if authenticated

**Usage**:
```typescript
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      {/* Protected content */}
    </ProtectedRoute>
  );
}
```

**Important**: This is UI-level protection only. Backend must enforce all access control.

### 4. Type Definitions (`app/lib/types.ts`)

**Purpose**: Type safety for API contracts

**Pattern**:
```typescript
// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

// Response types
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Domain models
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}
```

**Maintenance**:
- Update these types when backend contracts change
- Use strict TypeScript to catch mismatches early
- Consider generating types from OpenAPI spec

## Data Flow

### Authentication Flow

```
1. User submits login form
   ↓
2. Component calls authContext.login()
   ↓
3. Auth context calls apiClient.post('/auth/login')
   ↓
4. API client sends request (skipAuth: true)
   ↓
5. Backend validates credentials
   ↓
6. Backend returns { access_token, user }
   ↓
7. API client stores token in localStorage
   ↓
8. Auth context updates user state
   ↓
9. Component redirects to dashboard
   ↓
10. Protected route allows access
```

### Protected API Request Flow

```
1. Component calls apiClient.get('/invoices')
   ↓
2. API client retrieves token from localStorage
   ↓
3. API client adds Authorization header
   ↓
4. Request sent to backend
   ↓
5a. Success (200): Return data to component
5b. Unauthorized (401): Clear token, redirect to login
5c. Error (4xx/5xx): Throw normalized error
```

### Token Expiration Handling

```
1. User makes API request
   ↓
2. Backend returns 401 (token expired)
   ↓
3. API client catches 401
   ↓
4. API client clears token from localStorage
   ↓
5. API client redirects to /login
   ↓
6. Auth context state cleared
   ↓
7. User must login again
```

## State Management Strategy

### Current Approach

**Global State**: React Context for authentication only

**Local State**: useState in components for:
- Form inputs
- Loading states
- Error messages
- Fetched data

**Why This Works**:
- Authentication is the only truly global state
- Most state is component-specific
- No complex state sharing between features
- Simple to understand and debug

### When to Upgrade

Consider adding TanStack Query when:
- Multiple components fetch the same data
- Need automatic refetching
- Want optimistic updates
- Need advanced caching

Consider adding Redux/Zustand when:
- Complex state shared across many features
- Need time-travel debugging
- Want centralized state updates
- Team prefers Redux patterns

## Error Handling Strategy

### Three Error Types

1. **Network Errors**
   - Connection failures
   - Timeout errors
   - DNS resolution failures
   - Handled by API client, shown to user

2. **API Errors**
   - Validation errors (400)
   - Not found (404)
   - Server errors (500)
   - Normalized by API client

3. **Auth Errors**
   - Unauthorized (401)
   - Automatically handled with redirect
   - Token cleared

### Error Display Pattern

```typescript
const [error, setError] = useState('');

try {
  await apiClient.get('/endpoint');
} catch (err) {
  const apiError = err as ApiError;
  setError(apiError.message);
}

// In JSX
{error && (
  <div className="error-message">
    {error}
  </div>
)}
```

## Loading State Pattern

Every data-fetching component implements:

```typescript
const [isLoading, setIsLoading] = useState(true);
const [data, setData] = useState<T[]>([]);
const [error, setError] = useState('');

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  setIsLoading(true);
  setError('');
  
  try {
    const result = await apiClient.get<T[]>('/endpoint');
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

// In JSX
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
if (data.length === 0) return <EmptyState />;
return <DataDisplay data={data} />;
```

## Security Architecture

### Current Implementation

**Token Storage**: localStorage
- Simple to implement
- Works across tabs
- Vulnerable to XSS

**Route Protection**: Client-side only
- Good UX (immediate redirects)
- Not a security measure
- Backend must enforce all access

**HTTPS**: Required in production
- Prevents token interception
- Protects user data
- Should be enforced at deployment level

### Production Recommendations

1. **Move to httpOnly Cookies**
   ```typescript
   // Backend sets cookie
   res.cookie('token', jwt, {
     httpOnly: true,
     secure: true,
     sameSite: 'strict'
   });
   
   // Frontend doesn't handle token
   // Browser automatically sends cookie
   ```

2. **Add CSRF Protection**
   - Required when using cookies
   - Backend generates CSRF token
   - Frontend includes in requests

3. **Implement Refresh Tokens**
   - Short-lived access tokens (15 min)
   - Long-lived refresh tokens (7 days)
   - Automatic token refresh

4. **Add Rate Limiting**
   - Backend enforces limits
   - Frontend shows friendly errors

## Performance Considerations

### Current Optimizations

- Next.js automatic code splitting
- Image optimization with next/image
- Tailwind CSS purging unused styles
- Minimal dependencies

### Future Optimizations

1. **Add TanStack Query**
   - Automatic caching
   - Background refetching
   - Deduplication

2. **Implement Pagination**
   - Reduce initial load
   - Better performance with large datasets

3. **Add Debouncing**
   - Search inputs
   - Form submissions

4. **Lazy Load Routes**
   - Already handled by Next.js
   - Can add dynamic imports for heavy components

## Testing Strategy

### Recommended Approach

1. **Unit Tests**
   - API client methods
   - Utility functions
   - Type guards

2. **Integration Tests**
   - Auth flow (login, logout, token refresh)
   - Protected route behavior
   - Error handling

3. **E2E Tests**
   - Critical user paths
   - Login → Dashboard → Invoices
   - Error scenarios

### Testing Tools

- **Unit**: Jest + React Testing Library
- **E2E**: Playwright or Cypress
- **API Mocking**: MSW (Mock Service Worker)

## Extensibility

### Adding a New Feature

1. Create feature directory: `app/my-feature/`
2. Add page component: `app/my-feature/page.tsx`
3. Add types to `app/lib/types.ts`
4. Use existing patterns (loading, error, empty states)
5. Wrap with `<ProtectedRoute>` if needed

### Adding Shared Logic

1. **Shared Components**: `app/components/`
2. **Shared Hooks**: `app/hooks/` (create if needed)
3. **Shared Utils**: `app/lib/utils.ts` (create if needed)

### Migrating to Advanced Patterns

**Adding TanStack Query**:
```typescript
// 1. Install
npm install @tanstack/react-query

// 2. Wrap app with QueryClientProvider
// 3. Replace useState + useEffect with useQuery
const { data, isLoading, error } = useQuery({
  queryKey: ['invoices'],
  queryFn: () => apiClient.get('/invoices')
});
```

**Adding Redux**:
```typescript
// 1. Install Redux Toolkit
// 2. Create store
// 3. Migrate auth context to Redux slice
// 4. Update components to use Redux hooks
```

## Deployment Architecture

### Build Process

```
1. npm run build
   ↓
2. Next.js compiles TypeScript
   ↓
3. Tailwind purges unused CSS
   ↓
4. Next.js optimizes bundles
   ↓
5. Static assets generated
   ↓
6. Production build ready
```

### Environment Variables

- Must start with `NEXT_PUBLIC_` for client-side access
- Set in deployment platform
- Validated at build time (recommended)

### Hosting Options

1. **Vercel** (Recommended)
   - Zero config
   - Automatic deployments
   - Edge network

2. **Netlify**
   - Similar to Vercel
   - Good DX

3. **Docker**
   - Full control
   - Can deploy anywhere

4. **Traditional Hosting**
   - Build locally
   - Upload to server
   - Use PM2 for process management

## Maintenance

### Regular Tasks

1. **Dependency Updates**
   ```bash
   npm outdated
   npm update
   ```

2. **Security Audits**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Type Checking**
   ```bash
   npm run type-check
   ```

4. **Linting**
   ```bash
   npm run lint
   ```

### Monitoring

- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- User analytics (Google Analytics, Plausible)
- Uptime monitoring (UptimeRobot)

## Common Pitfalls

1. **Forgetting NEXT_PUBLIC_ prefix**
   - Client-side env vars must have this prefix

2. **Not handling loading states**
   - Always show loading UI during async operations

3. **Trusting client-side validation**
   - Backend must validate everything

4. **Not clearing state on logout**
   - Always clear sensitive data

5. **Hardcoding API URLs**
   - Always use environment variables

## Future Enhancements

### Short Term
- Add TanStack Query for better data fetching
- Implement invoice creation/editing
- Add pagination to invoice list
- Implement search and filtering

### Medium Term
- Move to httpOnly cookies
- Add refresh token flow
- Implement file uploads
- Add unit and E2E tests

### Long Term
- Consider SSR for SEO-critical pages
- Add real-time updates (WebSockets)
- Implement offline support
- Add PWA features

## Conclusion

This architecture prioritizes:
- **Simplicity** over complexity
- **Maintainability** over cleverness
- **Type safety** over flexibility
- **Production readiness** over demo quality

The codebase is designed to be:
- Easy to understand for new developers
- Simple to extend with new features
- Safe to deploy to production
- Ready for code review by senior engineers

All architectural decisions are documented inline in the code where they matter most.

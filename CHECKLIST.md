# Pre-Launch Checklist

## Before First Run

### Environment Setup
- [ ] Copy `.env.example` to `.env.local`
- [ ] Update `NEXT_PUBLIC_API_URL` with your backend URL
- [ ] Verify backend is running and accessible
- [ ] Run `npm install` to install dependencies

### Backend Verification
- [ ] Backend has `/auth/register` endpoint
- [ ] Backend has `/auth/login` endpoint
- [ ] Backend has `/auth/me` endpoint
- [ ] Backend has `/invoices` endpoint
- [ ] Backend returns JWT token in login/register responses
- [ ] Backend accepts `Bearer {token}` in Authorization header
- [ ] Backend returns 401 for invalid/expired tokens

### CORS Configuration
- [ ] Backend allows frontend origin (http://localhost:3000 for dev)
- [ ] Backend allows credentials
- [ ] Backend allows Authorization header
- [ ] Test CORS with browser developer tools

## First Run Testing

### Development Server
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] No console errors
- [ ] Page loads correctly

### Registration Flow
- [ ] Navigate to registration page
- [ ] Fill in all fields
- [ ] Submit form
- [ ] Check for errors in console
- [ ] Verify redirect to dashboard
- [ ] Check localStorage for `auth_token`

### Login Flow
- [ ] Logout if logged in
- [ ] Navigate to login page
- [ ] Enter credentials
- [ ] Submit form
- [ ] Verify redirect to dashboard
- [ ] Check localStorage for `auth_token`

### Protected Routes
- [ ] Access dashboard while logged in (should work)
- [ ] Logout
- [ ] Try to access dashboard (should redirect to login)
- [ ] Login again
- [ ] Access invoices page
- [ ] Verify data loads or shows empty state

### Error Handling
- [ ] Stop backend server
- [ ] Try to login (should show network error)
- [ ] Start backend server
- [ ] Try invalid credentials (should show error)
- [ ] Login successfully
- [ ] Stop backend server
- [ ] Navigate to invoices (should show error with retry)

## Before Deployment

### Code Quality
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No linting errors (`npm run lint`)
- [ ] All console.logs removed
- [ ] No commented-out code
- [ ] No TODO comments

### Security
- [ ] Environment variables not committed to git
- [ ] `.env.local` in `.gitignore`
- [ ] No hardcoded secrets
- [ ] HTTPS enabled in production
- [ ] Backend CORS configured for production domain

### Documentation
- [ ] README.md reviewed
- [ ] DEPLOYMENT.md reviewed
- [ ] Environment variables documented
- [ ] API endpoints documented

### Testing
- [ ] Register new account works
- [ ] Login works
- [ ] Logout works
- [ ] Protected routes redirect when not authenticated
- [ ] Data fetching works
- [ ] Error states display correctly
- [ ] Loading states display correctly
- [ ] Empty states display correctly

### Performance
- [ ] Build completes successfully (`npm run build`)
- [ ] No build warnings
- [ ] Bundle size reasonable
- [ ] Images optimized
- [ ] No unnecessary dependencies

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers

## Deployment Checklist

### Pre-Deployment
- [ ] Choose hosting platform (Vercel, Netlify, etc.)
- [ ] Backend deployed and accessible
- [ ] Production API URL ready
- [ ] SSL certificate configured

### Deployment
- [ ] Set `NEXT_PUBLIC_API_URL` environment variable
- [ ] Deploy application
- [ ] Verify deployment successful
- [ ] Check deployment logs for errors

### Post-Deployment
- [ ] Visit production URL
- [ ] Test registration
- [ ] Test login
- [ ] Test protected routes
- [ ] Test logout
- [ ] Check browser console for errors
- [ ] Verify API calls in Network tab
- [ ] Test on mobile device

### Monitoring Setup (Optional but Recommended)
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured (Google Analytics, Plausible)
- [ ] Uptime monitoring configured (UptimeRobot)
- [ ] Performance monitoring configured

## Troubleshooting Guide

### Issue: "Network error" on API calls
**Check**:
- [ ] Backend is running
- [ ] `NEXT_PUBLIC_API_URL` is correct
- [ ] CORS is configured
- [ ] No firewall blocking requests

### Issue: Build fails
**Check**:
- [ ] All dependencies installed
- [ ] No TypeScript errors
- [ ] `.next` directory cleared
- [ ] Node version is 18+

### Issue: 401 errors after login
**Check**:
- [ ] Token is in localStorage
- [ ] Token format is correct
- [ ] Backend accepts Bearer token
- [ ] Token hasn't expired

### Issue: Infinite redirect loop
**Check**:
- [ ] Clear localStorage
- [ ] Check `/auth/me` endpoint
- [ ] Verify token validation logic
- [ ] Check browser console for errors

## Maintenance Checklist

### Weekly
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review user feedback

### Monthly
- [ ] Update dependencies (`npm update`)
- [ ] Run security audit (`npm audit`)
- [ ] Review performance metrics
- [ ] Check for Next.js updates

### Quarterly
- [ ] Review and update documentation
- [ ] Evaluate new features to add
- [ ] Review security practices
- [ ] Consider architectural improvements

## Feature Addition Checklist

### Before Adding New Feature
- [ ] Feature requirements clear
- [ ] Backend API ready
- [ ] Types defined in `app/lib/types.ts`
- [ ] UI mockup/design ready

### During Development
- [ ] Follow existing patterns
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add empty states
- [ ] Add TypeScript types
- [ ] Test with real data

### After Development
- [ ] Test all user flows
- [ ] Check for console errors
- [ ] Verify TypeScript compilation
- [ ] Update documentation
- [ ] Code review
- [ ] Deploy to staging first

## Emergency Procedures

### If Production is Down
1. [ ] Check hosting platform status
2. [ ] Check backend status
3. [ ] Check error logs
4. [ ] Rollback if needed
5. [ ] Notify users if extended downtime

### If Security Issue Discovered
1. [ ] Assess severity
2. [ ] Take affected systems offline if critical
3. [ ] Fix vulnerability
4. [ ] Deploy fix
5. [ ] Notify affected users if data compromised
6. [ ] Document incident

### If Data Loss Occurs
1. [ ] Stop all write operations
2. [ ] Assess extent of loss
3. [ ] Restore from backup (backend responsibility)
4. [ ] Verify restoration
5. [ ] Document incident
6. [ ] Implement prevention measures

## Success Metrics

### Technical
- [ ] Zero TypeScript errors
- [ ] Zero console errors in production
- [ ] < 3s page load time
- [ ] > 90 Lighthouse score
- [ ] < 1% error rate

### User Experience
- [ ] Users can register successfully
- [ ] Users can login successfully
- [ ] Users can access protected features
- [ ] Error messages are clear
- [ ] Loading states are visible

### Business
- [ ] Authentication working reliably
- [ ] Users can view their data
- [ ] No security incidents
- [ ] Positive user feedback
- [ ] Low support ticket volume

## Sign-Off

### Development Complete
- [ ] All features implemented
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Code reviewed
- [ ] Ready for deployment

**Developer**: _________________ **Date**: _________

### Deployment Complete
- [ ] Deployed to production
- [ ] All checks passing
- [ ] Monitoring configured
- [ ] Team notified

**DevOps**: _________________ **Date**: _________

### Production Verified
- [ ] All features working
- [ ] No critical errors
- [ ] Performance acceptable
- [ ] Users can access system

**QA/Product**: _________________ **Date**: _________

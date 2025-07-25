# Login/Logout Loop Fix

## Issue Description
When trying to log in after logging out, the app attempts to sign the user in and then immediately logs them out again, creating a login/logout loop.

## Root Cause
The issue was identified in the authentication flow:

1. When a user logs out from the Navbar or resume page, they are redirected to `/auth` without a `next` parameter:
   ```javascript
   // In Navbar.tsx
   const handleLogout = async () => {
     await auth.signOut();
     navigate('/auth');
   };
   
   // In resume.tsx
   <button 
       onClick={async () => {
           await auth.signOut();
           navigate('/auth');
       }}
   >
       Log Out
   </button>
   ```

2. In the auth route, there's a useEffect that automatically navigates to the `next` parameter if the user is authenticated:
   ```javascript
   // In auth.tsx (before fix)
   useEffect(() => {
     if(auth.isAuthenticated) navigate(next);
   }, [auth.isAuthenticated, next])
   ```

3. When `next` is undefined (which happens when logging out), the navigation might be causing unexpected behavior or redirecting to a route that checks authentication and redirects back to `/auth`, creating a loop.

## Solution
The fix was to modify the auth.tsx file to handle the case where `next` is undefined by navigating to a default route (the home page):

```javascript
// In auth.tsx (after fix)
useEffect(() => {
  if(auth.isAuthenticated) navigate(next || '/');
}, [auth.isAuthenticated, next])
```

This ensures that when a user is authenticated and the `next` parameter is undefined, they will be redirected to the home page (`/`) instead of trying to navigate to an undefined route.

## Why This Works
1. When a user logs out, they are redirected to `/auth` without a `next` parameter
2. If the user is still considered authenticated in auth.tsx (due to timing issues with the signOut process), they will now be redirected to `/` (home) instead of an undefined route
3. Even if the home page checks authentication and redirects back to `/auth`, by that time the signOut process should have completed, and the user will no longer be considered authenticated

This breaks the login/logout loop and ensures a smooth authentication flow.

## Future Improvements
For more robust handling of authentication flows, consider:

1. Adding a loading state during logout to ensure the signOut process completes before navigation
2. Implementing a more consistent approach to redirects after authentication actions
3. Using a dedicated authentication guard or middleware for protected routes
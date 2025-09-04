import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook(.*)',
  // Public APIs for local dev and Docker health checks
  '/api/storage(.*)',
  '/api/ai(.*)',
  '/api/courses(.*)',
  // Test pages for development
  '/test(.*)',
  '/debug(.*)',
]);

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  // For development, allow all routes without authentication
  return NextResponse.next();
  
  // TODO: Re-enable authentication in production
  // Protect all non-public routes
  // if (!isPublicRoute(request)) {
  //   await auth.protect();
  // }

  // Additional protection for admin routes
  // if (isAdminRoute(request)) {
  //   const { userId, sessionClaims } = await auth();
  //   
  //   if (!userId) {
  //     return NextResponse.redirect(new URL('/sign-in', request.url));
  //   }
  //   
  //   // Check if user has admin role in public metadata
  //   const isAdmin = (sessionClaims?.publicMetadata as any)?.role === 'admin';
  //   
  //   // Temporarily allow all authenticated users to access admin for testing
  //   console.log('Admin route access:', { userId, isAdmin, sessionClaims });
  //   
  //   // Temporarily disable admin check for development
  //   // if (!isAdmin) {
  //   //   console.log('Redirecting non-admin user to dashboard');
  //   //   return NextResponse.redirect(new URL('/dashboard', request.url));
  //   // }
  // }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
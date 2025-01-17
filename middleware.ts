// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// const isPublicRoute = createRouteMatcher([
//     '/sign-in',
//     '/sign-up',
//     '/',
//     '/about',
//     '/contact',
//     '/pricing',
//     '/api/sendDailyReport', // Make this API route public
// ]);

// const isProtectedRoute = createRouteMatcher(['/admin', '/register']);

// export default clerkMiddleware((auth, req) => {
//     if(isPublicRoute(req)){
//         return
//     }

//     if(isProtectedRoute(req)){
//         auth().protect();
//     }    
// })  

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],    
// }         


import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}   
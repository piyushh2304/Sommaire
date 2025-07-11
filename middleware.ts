import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/upload(.*)",
  "/summaries(.*)",
  "/summary(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  // No return needed for public routes
});

export const config = {
   matcher: [
    // Exclude _next, static files, and files with extensions
    '/((?!_next|.*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
};

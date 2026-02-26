import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/login', '/sign-up', '/sign-in', '/'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // Protect dashboard and admin routes
  if (!isPublicRoute(req) && !userId) {
    const { redirectToSignIn } = await auth()
    return redirectToSignIn()
  }

  // Only admins can access admin routes
  if (isAdminRoute(req) && !userId) {
    const { redirectToSignIn } = await auth()
    return redirectToSignIn()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

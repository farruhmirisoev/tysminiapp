export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const api = useApi()
  
  // Check if user is authenticated
  const token = api.getToken()
  const isAuthenticated = !!(authStore.data || token)
  
  // Public routes that don't require authentication
  const publicRoutes = ['/signin', '/signup', '/password-recover']
  const isPublicRoute = publicRoutes.includes(to.path) || to.path.startsWith('/activate/')
  
  // If not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    return navigateTo('/signin')
  }
  
  // If authenticated and trying to access auth pages (except activate), redirect to home
  if (isAuthenticated && isPublicRoute && !to.path.startsWith('/activate/')) {
    return navigateTo('/')
  }
  
  // If authenticated but no user data, try to fetch it
  if (token && !authStore.data && !isPublicRoute) {
    authStore.fetch().catch(() => {
      // If fetch fails, clear token and redirect to signin
      authStore.clear()
      return navigateTo('/signin')
    })
  }
})


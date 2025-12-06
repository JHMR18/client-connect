import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";
import { useAuth } from "@/utils/useAuth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, checkAuth, getDashboardRoute } = useAuth();

  const publicRoutes = ["/", "/client/register"];
  const isPublicRoute = publicRoutes.includes(to.path);

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (to.path === "/" && isAuthenticated.value) {
    const dashboardRoute = await getDashboardRoute();
    next(dashboardRoute);
    return;
  }

  // For protected routes, check authentication
  if (!isPublicRoute && !isAuthenticated.value) {
    next("/");
    return;
  }

  // For authenticated users on protected routes, verify token is still valid
  if (!isPublicRoute && isAuthenticated.value) {
    const isValid = await checkAuth();
    if (!isValid) {
      next("/");
      return;
    }
  }

  next();
});

export default router;

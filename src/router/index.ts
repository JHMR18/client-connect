import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";
import { useAuth } from "@/utils/useAuth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, checkAuth } = useAuth();

  const publicRoutes = ["/", "/login"];
  const isPublicRoute = publicRoutes.includes(to.path) || to.path === "/";

  if (!isPublicRoute && !isAuthenticated.value) {
    next("/");
    return;
  }

  // Allow authenticated users to access public routes
  // Remove the redirect loop that was preventing page from loading

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

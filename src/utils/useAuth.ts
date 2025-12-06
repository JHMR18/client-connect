import { computed, readonly } from "vue";
import { useCookie } from "./useCookie";
import {
  client,
  getCurrentUser,
  processLogout,
  refreshToken,
  shouldRefreshToken,
  getUserRole
} from "./useDirectus";

export function useAuth() {
  const accessToken = useCookie<string | null>("accessToken", { default: () => null });
  const userData = computed(() => {
    const stored = sessionStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = computed(() => {
    return !!accessToken.value;
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await client.login(email, password);

      if (response.access_token) {
        accessToken.value = response.access_token;

        if (response.refresh_token) {
          sessionStorage.setItem("refresh_token", response.refresh_token);
        }

        // Store token expiry time (15 minutes from now)
        const expiryTime = Date.now() + (15 * 60 * 1000);
        sessionStorage.setItem("token_expiry", expiryTime.toString());

        const user = await getCurrentUser();
        sessionStorage.setItem("userData", JSON.stringify(user));

        return { success: true, user };
      }

      throw new Error("Login failed");
    } catch (error: any) {
      throw new Error(error?.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      await processLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      accessToken.value = null;
      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("token_expiry");
    }
  };

  const checkAuth = async () => {
    if (!accessToken.value) {
      return false;
    }

    try {
      // Check if token needs refresh
      if (shouldRefreshToken()) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          await logout();
          return false;
        }
      }

      await getCurrentUser();
      return true;
    } catch (error: any) {
      console.error("Auth check failed:", error);

      // Try to refresh token on 401/403 errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        const refreshed = await refreshToken();
        if (refreshed) {
          try {
            await getCurrentUser();
            return true;
          } catch (retryError) {
            console.error("Retry after refresh failed:", retryError);
          }
        }
      }

      await logout();
      return false;
    }
  };

  // Get the dashboard route based on user's role
  const getDashboardRoute = async (): Promise<string> => {
    try {
      const roleName = await getUserRole();

      if (!roleName) {
        return "/client/payments"; // Default fallback
      }

      const roleNameLower = roleName.toLowerCase();

      // Check for admin roles
      if (roleNameLower.includes("admin") || roleNameLower === "administrator") {
        return "/admin/dashboard";
      }

      // Default to client dashboard
      return "/client/payments";
    } catch (error) {
      console.error("Error getting dashboard route:", error);
      return "/client/payments"; // Safe fallback
    }
  };

  return {
    accessToken: readonly(accessToken),
    userData: readonly(userData),
    isAuthenticated: readonly(isAuthenticated),
    login,
    logout,
    checkAuth,
    getDashboardRoute,
  };
}

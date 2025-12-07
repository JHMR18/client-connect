import {
  authentication,
  createDirectus,
  logout,
  readMe,
  refresh,
  rest,
} from "@directus/sdk";
import { useCookie } from "./useCookie";

const baseUrl = import.meta.env.VITE_DIRECTUS_URL || "http://localhost:8055";

export const client = createDirectus(baseUrl)
  .with(rest({ credentials: "include" }))
  .with(authentication("json", { credentials: "include" }));

export const getCurrentUser = async () => {
  return await client.request(
    readMe({
      fields: ["id", "first_name", "last_name", "email", "role", "status"],
    })
  );
};

// Helper function to get access token from cookie
const getAccessToken = (): string | null => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'accessToken') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

// Set access token in cookie
const setAccessToken = (token: string) => {
  const accessTokenCookie = useCookie<string | null>("accessToken", { default: () => null });
  accessTokenCookie.value = token;
};

export const refreshToken = async (): Promise<boolean> => {
  try {
    const refresh_token = sessionStorage.getItem("refresh_token");

    if (!refresh_token) {
      return false;
    }

    const response = await client.request(
      refresh("json", refresh_token)
    );

    if (response.access_token) {
      setAccessToken(response.access_token);
      sessionStorage.setItem("access_token", response.access_token.toString());

      if (response.refresh_token) {
        sessionStorage.setItem("refresh_token", response.refresh_token.toString());
      }

      // Store token expiry time (typically 15 minutes, store as timestamp)
      const expiryTime = Date.now() + (15 * 60 * 1000); // 15 minutes from now
      sessionStorage.setItem("token_expiry", expiryTime.toString());

      return true;
    }

    return false;
  } catch (error) {
    console.warn("Token refresh failed, clearing session:", error);
    // If refresh fails (e.g. expired refresh token), clear everything to force re-login
    setAccessToken(""); // Clear cookie
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("token_expiry");
    sessionStorage.removeItem("userData");
    return false;
  }
};

// Check if token is about to expire (within 2 minutes)
export const shouldRefreshToken = (): boolean => {
  const expiryTime = sessionStorage.getItem("token_expiry");
  if (!expiryTime) return false;

  const timeUntilExpiry = parseInt(expiryTime) - Date.now();
  // Refresh if less than 2 minutes remaining
  return timeUntilExpiry < (2 * 60 * 1000);
};

export const processLogout = async () => {
  try {
    const refresh_token = sessionStorage.getItem("refresh_token");

    if (refresh_token) {
      await client.request(logout(refresh_token, "json"));
    }

    sessionStorage.clear();
  } catch (e) {
    console.log(e);
  }
};

// Get user's role name from Directus
export const getUserRole = async (): Promise<string | null> => {
  try {
    const user = await getCurrentUser();

    if (!user || !user.role) {
      return null;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      return null;
    }

    // Fetch role details
    const response = await fetch(`${baseUrl}/roles/${user.role}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.name || null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};

export const validateUserRole = async (
  roleId: string | null
): Promise<{ isValid: boolean; roleName: string | null }> => {
  try {
    if (!roleId) {
      return {
        isValid: false,
        roleName: null,
      };
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    // Use direct REST API call for core collections
    const response = await fetch(`${baseUrl}/roles/${roleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const roleName = data.data?.name;

    if (roleName) {
      return {
        isValid: roleName.toLowerCase() === "student",
        roleName: roleName,
      };
    }

    return {
      isValid: false,
      roleName: null,
    };
  } catch (error) {
    console.error("Error validating role:", error);
    return {
      isValid: false,
      roleName: null,
    };
  }
};

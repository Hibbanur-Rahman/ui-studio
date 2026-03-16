/**
 * Utility functions for authentication token management
 */

/**
 * Set authentication token in both localStorage and cookie
 * @param token - The authentication token to store
 */
export const setAuthToken = (token: string): void => {
  // Store in cookie for middleware authentication
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `accessToken=${token}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure ? '; Secure' : ''}`;
};

/**
 * Remove authentication token from both localStorage and cookie
 */
export const removeAuthToken = (): void => {
  // Remove from cookie by setting it to expire
  document.cookie = `accessToken=; path=/; max-age=0; SameSite=Lax`;
};

/**
 * Get authentication token from cookie
 * @returns The authentication token or null
 */
export const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null;

  const name = "accessToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
};

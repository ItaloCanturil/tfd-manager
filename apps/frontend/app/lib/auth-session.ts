export const tokenCookieName = "tfd_access_token";
export const tokenStorageKey = "tfd.accessToken";

export function saveAccessToken(token: string) {
  window.localStorage.setItem(tokenStorageKey, token);
  document.cookie = `${tokenCookieName}=${encodeURIComponent(
    token,
  )}; path=/; max-age=28800; samesite=lax`;
}

export function readAccessToken() {
  return window.localStorage.getItem(tokenStorageKey);
}

export function clearAccessToken() {
  window.localStorage.removeItem(tokenStorageKey);
  document.cookie = `${tokenCookieName}=; path=/; max-age=0; samesite=lax`;
}

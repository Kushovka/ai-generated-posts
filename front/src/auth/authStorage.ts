export const ACCESS_TOKEN_KEY = "accessToken";
export const TOKEN_TYPE_KEY = "tokenType";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const saveAuthToken = (accessToken: string, tokenType: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
};

export const clearAuthToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
};

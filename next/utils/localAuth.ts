import { API_BASE, IS_BROWSER } from "../consts";

const LOCAL_ST_AUTH_KEY = "auth";

export const getSavedAuthId = () =>
  Number(localStorage.getItem(LOCAL_ST_AUTH_KEY)) || null;

export const setSavedAuthId = (id?: number) =>
  id
    ? localStorage.setItem(LOCAL_ST_AUTH_KEY, String(id))
    : localStorage.removeItem(LOCAL_ST_AUTH_KEY);

let inMemoryToken: string | undefined = undefined;

const parseToken = (token: string) => {
  const [, b64str] = token.split(".");
  return JSON.parse(atob(b64str));
};

const refreshAuthToken = async (): Promise<string | undefined> => {
  try {
    const { accessToken } = await fetch(API_BASE + "/auth/refresh", {
      method: "POST",
      credentials: "include",
    }).then((resp) => resp.json());
    setAuthToken(accessToken);
    return accessToken;
  } catch (err) {
    console.error(err);
  }
  return undefined;
};

export const getAuthToken = async (): Promise<string | undefined> => {
  if (inMemoryToken) {
    const { exp } = parseToken(inMemoryToken);
    if (exp < Date.now() / 1000) {
      return await refreshAuthToken();
    }
  }
  return inMemoryToken;
};

export const setAuthToken = (token: string | undefined) => {
  inMemoryToken = token;
  if (inMemoryToken) {
    const { id } = parseToken(inMemoryToken);
    setSavedAuthId(id);
  } else {
    setSavedAuthId(undefined);
  }
};

// refresh token as soon as possible if user was logged in previously
if (IS_BROWSER && getSavedAuthId()) {
  refreshAuthToken();
}

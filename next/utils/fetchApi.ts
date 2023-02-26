import { API_BASE } from "../consts";
import { getAuthToken, getSavedAuthId } from "./localAuth";

export const fetchApi = async (
  route: string,
  body?: Object,
  withAuth = false
) => {
  try {
    const init: RequestInit = {
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      method: body ? "POST" : "GET",
      credentials: "include",
    };
    if (withAuth && getSavedAuthId()) {
      init.headers = {
        ...init.headers,
        authorization: `Bearer ${await getAuthToken()}`,
      };
    }
    const resp = await fetch(API_BASE + route, init);
    if (!resp.ok) {
      if (resp.status === 401) {
        throw new Error("نیاز به احراز هویت!");
      }
      if (resp.status === 422) {
        throw new Error((await resp.json()).message);
      }
      throw new Error(resp.statusText);
    }
    return await resp.json();
  } catch (err: any) {
    console.error(err);
    alert(
      typeof err === "object" && err && "message" in err ? err.message : "خطا"
    );
    return Promise.reject(err);
  }
};

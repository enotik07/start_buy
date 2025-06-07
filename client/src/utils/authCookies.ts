import Cookies from "js-cookie";
import { IAuthResponse } from "../models/auth";

enum AuthCookies {
  accessToken = "accessToken",
  refreshToken = "refreshToken",
  isAdmin = "isAdmin",
}

export const saveTokens = (auth: IAuthResponse) => {
  const accessPayload = JSON.parse(atob(auth.access_token.split(".")[1]));
  const refreshPayload = JSON.parse(atob(auth.refresh_token.split(".")[1]));

  const accessExpiration = new Date();
  accessExpiration.setTime(accessPayload.exp * 1000);
  Cookies.set(AuthCookies.accessToken, auth.access_token, {
    expires: accessExpiration,
  });

  const refreshExpiration = new Date();
  refreshExpiration.setTime(refreshPayload.exp * 1000);
  Cookies.set(AuthCookies.isAdmin, String(auth.is_admin), {
    expires: refreshExpiration,
  });
  Cookies.set(AuthCookies.refreshToken, auth.refresh_token, {
    expires: refreshExpiration,
  });
};

export const deleteTokens = () =>
  Object.values(AuthCookies).forEach((value) => Cookies.remove(value));


export const getIsAdmin = () => Cookies.get(AuthCookies.isAdmin)==='true'; 
export const getIsLogged = () => Cookies.get(AuthCookies.refreshToken) != undefined;

export const getTokens = () => ({
  accessToken: Cookies.get(AuthCookies.accessToken),
  refreshToken: Cookies.get(AuthCookies.refreshToken),
});

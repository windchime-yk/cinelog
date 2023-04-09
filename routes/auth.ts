import { type Handlers } from "$fresh/server.ts";
import { setCookie } from "std/http/cookie.ts";
import { getUrlParams, redirectResponse } from "../core/api.ts";
import { isInvalidAccount } from "../core/util.ts";

export const handler: Handlers = {
  async POST(req) {
    const body = await getUrlParams(req);
    const response = redirectResponse("/");

    if (!isInvalidAccount(body.get("username"), body.get("password"))) {
      setCookie(response.headers, {
        name: "username",
        value: body.get("username") || "",
      });
      setCookie(response.headers, {
        name: "password",
        value: body.get("password") || "",
      });
    }

    return response;
  },
};

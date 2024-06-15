import Cookie from "js-cookie";

export const setCookie = (
    name: string,
    value: string,
    options?: Cookies.CookieAttributes
) => {
    Cookie.set(name, value, options);
};

export const setCookieToDay = (name: string, value: any) => {
    const now = new Date();

    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);

    const expiresIn = (midnight.getTime() - now.getTime()) / (1000 * 60 * 60);

    Cookie.set(name, value, { expires: expiresIn / 24 });
}

export const getCookie = (name: string) => {
    return Cookie.get(name);
};

export const removeCookie = (name: string) => {
    Cookie.remove(name);
};

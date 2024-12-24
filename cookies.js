function setMapCookie(name, map) {
    const jsonString = JSON.stringify(Object.fromEntries(map));
    let expires = "";
    const date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(jsonString)}${expires}; path=/; SameSite=Lax`;
}

function getMapFromCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find(row => row.startsWith(name + "="));
    if (cookie) {
        const value = decodeURIComponent(cookie.split("=")[1]);
        const parsedObject = JSON.parse(value);

        return new Map(
            Object.entries(parsedObject).map(([key, val]) => [isNaN(key) ? key : parseInt(key, 10), val])
        );
    }
    return new Map();
}

function setStringCookie(name, value) {
    let expires = "";
    const date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000)
    expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
}

function getStringCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find(row => row.startsWith(name + "="));
    if (cookie) {
        return decodeURIComponent(cookie.split("=")[1]);
    }
    return ""
}


class DocumentCookie {
    public get(name: string): string | null {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    }

    public set(name: string, value: string, hours: number, path = '/') {
        let expires = '';
        if (hours) {
            const date = new Date();
            date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }

        let cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(value) + expires + '; path=' + path;

        cookieString += '; secure'; // Uncomment for HTTPS only
        cookieString += '; samesite=Lax'; // Or 'Strict' or 'None; Secure'

        document.cookie = cookieString;
    }

    public delete(name: string, path = '/') {
        document.cookie = encodeURIComponent(name) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=' + path;
    }

}

export const documentCookie = new DocumentCookie();
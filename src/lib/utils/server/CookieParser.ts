
export class CookieParser {

    public static getAPIKey(request: Request): string | null {
        const cookies = request.headers.get('cookie') || '';
        const parsedCookies = CookieParser.parse(cookies);
        const apiKey = parsedCookies['apiKey'];
        return apiKey;
    }


    private static parse(cookieString: string): Record<string, string> {
        const cookies: Record<string, string> = {};
        const cookieArray = cookieString.split('; ');

        for (const cookie of cookieArray) {
            const [name, value] = cookie.split('=');
            if (name && value) {
                cookies[decodeURIComponent(name)] = decodeURIComponent(value);
            }
        }

        return cookies;
    }
}
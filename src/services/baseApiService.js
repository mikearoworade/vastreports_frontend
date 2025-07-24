export class APIError extends Error {
    constructor(message, status, data=null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

export default class BaseApiService {
    static BASE_URL = import.meta.env.VITE_API_BASE_URL; // from .env

    constructor(prefix = "") {
        this.prefix = prefix;
        this.token = null;
        this.refreshToken = null;
    }

    setTokens(accessToken, refreshToken) {
        this.token = accessToken;
        this.refreshToken = refreshToken;
    }

    clearTokens() {
        this.token = null;
        this.refreshToken = null;
    }

    async apiRequest(endpoint, options = {}, skipAuth = false) {
        const url = `${BaseApiService.BASE_URL}${this.prefix}${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...options.headers,
        };

        if(!skipAuth && this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        const config = {
            method: 'GET',
            ...options,
            headers,
        };

        try {
            const res = await fetch(url, config);

            const contentType = res.headers.get("content-type");
            let data = contentType?.includes("application/json")
                ? await res.json()
                : await res.text();

            if (!res.ok) {
                throw new APIError(
                    data.message || `HTTP ${res.status}: ${res.statusText}`,
                    res.status,
                    data
                );
            }

            return { data, status: res.status, headers: res.headers };
        } catch (err) {
            if (err instanceof APIError) throw err;
            throw new APIError(`Network error: ${err.message}`, 0, null);
        }
    }
}
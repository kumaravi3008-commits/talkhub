// Server URL Configuration for Socket.IO / WebRTC signaling.
//
// Resolves the backend ORIGIN (no path) used for real-time connections.
// 1. REACT_APP_BACKEND_URL env var (absolute http(s) URL only) - for production
// 2. Localhost / LAN fallback for development
// 3. Render backend fallback for any other deployment

const isAbsoluteHttpUrl = (value) => {
    return typeof value === 'string' && /^https?:\/\/.+/.test(value);
};

const isDevelopment =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '192.168.1.9';

const SERVER_BASE =
    window.location.hostname === '192.168.1.9'
        ? 'http://192.168.1.9:4001'
        : 'http://localhost:4001';

let resolvedServerUrl;

const envBackendUrl = process.env.REACT_APP_BACKEND_URL;

if (isAbsoluteHttpUrl(envBackendUrl)) {
    // Strip trailing slashes so we always produce a clean origin.
    resolvedServerUrl = envBackendUrl.replace(/\/+$/, '');
} else if (isDevelopment) {
    resolvedServerUrl = SERVER_BASE;
} else {
    resolvedServerUrl = 'https://talkhub-backend-8331.onrender.com';
}

export const server_url = resolvedServerUrl;


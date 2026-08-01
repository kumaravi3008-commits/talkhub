// API Base URL Configuration - support production deployment
//
// IMPORTANT FIX:
// Previously this file blindly trusted process.env.REACT_APP_API_URL even if
// it was a RELATIVE path (e.g. "/api"). On Vercel, that caused the browser to
// call https://talkhub-client.vercel.app/api/... which returns 405 (the
// static host does not serve API endpoints). We now only accept ABSOLUTE
// http(s) URLs from the environment and fall back to the Render backend in
// production.

// A helper that returns true only for absolute http(s) URLs.
const isAbsoluteHttpUrl = (value) => {
    return typeof value === 'string' && /^https?:\/\/.+/.test(value);
};

// Detect local development by hostname.
const isDevelopment =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '192.168.1.9';

// ---------------------------------------------------------------------------
// Resolve the backend ORIGIN (scheme + host + port, no path).
// ---------------------------------------------------------------------------
let API_ORIGIN;

const envApiUrl = process.env.REACT_APP_API_URL;

if (isAbsoluteHttpUrl(envApiUrl)) {
    // e.g. https://talkhub-backend-8331.onrender.com  OR
    //      https://talkhub-backend-8331.onrender.com/api
    // Strip any trailing slashes, then remove a trailing "/api" so we have a
    // clean origin to work with.
    API_ORIGIN = envApiUrl.replace(/\/+$/, '').replace(/\/api$/, '');
} else if (isDevelopment) {
    API_ORIGIN =
        window.location.hostname === '192.168.1.9'
            ? 'http://192.168.1.9:4001'
            : 'http://localhost:4001';
} else {
    // Production fallback: the Render backend.
    API_ORIGIN = 'https://talkhub-backend-8331.onrender.com';
}

// ---------------------------------------------------------------------------
// Build the REST API base URL (always ends with "/api/").
// ---------------------------------------------------------------------------
const API_URL = API_ORIGIN + '/api/';

export const baseUrl = API_URL;

// ---------------------------------------------------------------------------
// Also expose the bare backend origin (used by Socket.IO connections).
// ---------------------------------------------------------------------------
export const backendUrl = API_ORIGIN;


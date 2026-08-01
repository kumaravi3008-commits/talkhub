// shared/api.js
// Safe JSON parsing helper for fetch responses.
//
// Fixes: "SyntaxError: Unexpected end of JSON input"
// This happens when the server returns an empty body (e.g. some proxy
// responses, 404/405 pages, or the backend returning no content). Calling
// response.json() on an empty body throws, so we read the body as text
// first and only attempt to parse it when it actually contains data.

export const parseJSON = (response) => {
    return response.text().then((text) => {
        if (!text) {
            return {};
        }
        try {
            return JSON.parse(text);
        } catch (err) {
            // Body exists but is not valid JSON (e.g. HTML error page)
            console.warn('parseJSON: response body is not valid JSON', text.slice(0, 200));
            return {};
        }
    });
};


# TODO — Fix Production Signup 500 Error (Backend Only)

## Status
- [x] 1. `server/config.js` — Accept MONGO_URL / MONGO_URI / MONGODB_URI fallback
- [x] 2. `server/routes/users.js` — Add signup error logging + 400/409 handling + remove session-dependent auto-login
- [x] 3. `server/app.js` — Log full DB connection errors + add db state to `/api/health`
- [x] 4. `server/env.example` — Document supported DB URI env vars + FRONTEND_URL
- [ ] 5. Verify: redeploy to Render, confirm MONGO_URI, check logs for [SIGNUP ERROR]


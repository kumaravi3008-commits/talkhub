module.exports = {
    'secretKey': process.env.JWT_SECRET || '12345-67890-09876-54321',
    // Read the DB URI from any of the supported production env var names.
    // Render commonly uses MONGO_URI; we also accept MONGO_URL (legacy) and
    // MONGODB_URI (documented in env.example). Falls back to localhost only
    // for local development.
    'mongoUrl': process.env.MONGO_URL || process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/shubhmeet',
    'facebook': {
        clientId: 'Your Facebook App ID',
        clientSecret: 'Your Facebook App Secret'
    }
}

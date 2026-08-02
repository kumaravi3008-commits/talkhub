/**
 * Normalize and validate the MongoDB connection URI before it reaches
 * mongoose.connect(). The old mongodb driver (3.7.x, bundled with mongoose 5)
 * relies on legacy url.parse(), which throws on malformed percent-encoding and
 * returns broken hostnames for unicode/invalid input. By validating here we get
 * an EARLY, actionable error instead of an opaque MongoParseError.
 */
function normalizeMongoUri(raw) {
  if (!raw) {
    return { error: 'No MongoDB URI configured. Set MONGO_URL / MONGO_URI / MONGODB_URI in Render environment variables.' };
  }

  const uri = String(raw).trim();

  // Must be a real connection string.
  if (!/^mongodb(\+srv)?:\/\//i.test(uri)) {
    return { error: `MONGODB_URI does not start with mongodb:// or mongodb+srv://. Got: ${uri.slice(0, 60)}...` };
  }

  // Reject malformed percent-encoding anywhere in the string. This is the ONLY
  // input that made the driver throw "URI malformed, cannot be parsed".
  // e.g. password "pa%zz" -> invalid; password "pa%40zz" -> valid (%40).
  const invalidPercent = uri.match(/%(?![0-9A-Fa-f]{2})/g);
  if (invalidPercent) {
    return {
      error: `MONGODB_URI contains invalid percent-encoding (${invalidPercent.length} bad % sequence(s)). `
        + 'This is what causes "URI malformed, cannot be parsed". '
        + 'If the Atlas password contains special characters (especially % or @), they must be percent-encoded '
        + '(e.g. a literal % becomes %25, a literal @ becomes %40). Paste the exact raw value you copied from Atlas and re-encode only the password part.'
    };
  }

  return { uri };
}

// Read the DB URI from any of the supported production env var names.
const rawMongoUrl =
  process.env.MONGO_URL ||
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/shubhmeet';

const { uri: mongoUrl, error: mongoUrlError } = normalizeMongoUri(rawMongoUrl);

if (mongoUrlError) {
  // Log at startup so the REAL cause is visible in Render logs immediately.
  console.error('[CONFIG ERROR] MongoDB URI validation failed:');
  console.error('[CONFIG ERROR]', mongoUrlError);
}

module.exports = {
  'secretKey': process.env.JWT_SECRET || '12345-67890-09876-54321',
  'mongoUrl': mongoUrl || rawMongoUrl,
  'mongoUrlError': mongoUrlError || null,
  'facebook': {
    clientId: process.env.FACEBOOK_CLIENT_ID || 'Your Facebook App ID',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'Your Facebook App Secret'
  }
};


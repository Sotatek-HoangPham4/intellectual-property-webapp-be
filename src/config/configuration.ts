export default () => ({
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'access_secret',
    refreshTokenSecret:
      process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret',
    accessTokenExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '900s',
    refreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d',
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.RESEND_FROM_EMAIL || 'no-reply@example.com',
  },
});

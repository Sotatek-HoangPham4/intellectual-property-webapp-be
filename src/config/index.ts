export const config = {
  accessTokenTTLSeconds: parseInt(
    process.env.ACCESS_TOKEN_TTL_SECONDS || '900',
    10,
  ),
  refreshTokenTTLSeconds: parseInt(
    process.env.REFRESH_TOKEN_TTL_SECONDS || '604800',
    10,
  ),
  refreshTokenTTLDays: parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '30', 10),
};

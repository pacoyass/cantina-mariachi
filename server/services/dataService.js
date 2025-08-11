import { verifyToken, blacklistToken } from './authService.js';

export const logout = async (accessToken) => {
  const payload = await verifyToken(accessToken);
  const expiresAt = new Date(payload.exp);
  await blacklistToken(accessToken, expiresAt);
};

export const dataService = {
  logout,
};

export default dataService;
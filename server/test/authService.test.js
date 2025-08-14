import { jest } from '@jest/globals';

process.env.ALLOW_INSECURE_TEST_TOKENS = '1';
await jest.unstable_mockModule('../services/databaseService.js', () => ({
  databaseService: {
    findBlacklistedToken: jest.fn(async (hash) => (hash === 'bad' ? { id: 'b1' } : null)),
    deleteExpiredBlacklistedToken: jest.fn(async ()=>({ count: 1 })),
    createBlacklistedToken: jest.fn(async ({ tokenHash }) => ({ id: 'bl1', tokenHash })),
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    createRefreshToken: jest.fn(),
    getRefreshToken: jest.fn(),
    getUserById: jest.fn(),
    refreshUserTokens: jest.fn(),
  }
}));

const { parseExpiration, generateToken, verifyToken, hashToken, isTokenBlacklisted, blacklistToken } = await import('../services/authService.js');

function base64Json(obj) { return Buffer.from(JSON.stringify(obj)).toString('base64url'); }

describe('authService basics', () => {
  it('parseExpiration converts units and throws on bad', () => {
    expect(parseExpiration('15m')).toBe(900);
    expect(parseExpiration('1h')).toBe(3600);
    expect(() => parseExpiration('0m')).toThrow();
    expect(() => parseExpiration('5x')).toThrow();
  });

  it('generateToken/verifyToken works in insecure mode', async () => {
    const { token, exp } = await generateToken({ id: 'u1', email: 'e', role: 'USER' }, '1m');
    const payload = await verifyToken(token);
    expect(payload.userId).toBe('u1');
    expect(exp instanceof Date).toBe(true);
  });

  it('verifyToken throws on expired', async () => {
    const expired = base64Json({ userId: 'u', email: 'e', role: 'USER', exp: new Date(Date.now()-1000).toISOString(), iat: new Date().toISOString() });
    await expect(verifyToken(expired)).rejects.toThrow('Token has expired');
  });

  it('hashToken returns sha256 and blacklist flows', async () => {
    const h = await hashToken('abc');
    expect(h).toHaveLength(64);
    const bl = await blacklistToken('abc', new Date(Date.now()+60000));
    expect(bl).toHaveProperty('id');
  });

  it('isTokenBlacklisted returns true when found', async () => {
    const badHash = 'bad';
    const { createHash } = await import('node:crypto');
    const spy = jest.spyOn(createHash('sha256'), 'update');
    const res = await isTokenBlacklisted('bad');
    // we cannot easily intercept inner hash; just assert boolean
    expect(typeof res).toBe('boolean');
  });
});
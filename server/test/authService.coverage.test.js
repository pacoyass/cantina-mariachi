import { jest } from '@jest/globals';

// Set up test environment
process.env.ALLOW_INSECURE_TEST_TOKENS = '1';
process.env.NODE_ENV = 'test';

// Mock database service
await jest.unstable_mockModule('../services/databaseService.js', () => ({
  databaseService: {
    findBlacklistedToken: jest.fn(),
    deleteExpiredBlacklistedToken: jest.fn(),
    createBlacklistedToken: jest.fn(),
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    createRefreshToken: jest.fn(),
    getRefreshToken: jest.fn(),
    getUserById: jest.fn(),
    refreshUserTokens: jest.fn(),
    deleteRefreshToken: jest.fn(),
    getUserRefreshTokens: jest.fn(),
    deleteUserRefreshTokens: jest.fn(),
  }
}));

const { databaseService } = await import('../services/databaseService.js');
const { 
  parseExpiration, 
  generateToken, 
  verifyToken, 
  hashToken, 
  isTokenBlacklisted, 
  blacklistToken,
  createUser,
  login,
  refreshToken,
  logout,
  getUserById
} = await import('../services/authService.js');

describe('authService - Enhanced Coverage Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseExpiration', () => {
    it('should handle all time units correctly', () => {
      expect(parseExpiration('30s')).toBe(30);
      expect(parseExpiration('15m')).toBe(900);
      expect(parseExpiration('2h')).toBe(7200);
      expect(parseExpiration('7d')).toBe(604800);
    });

    it('should throw error for invalid formats', () => {
      expect(() => parseExpiration('0m')).toThrow('Invalid expiration format: 0m');
      expect(() => parseExpiration('-5m')).toThrow('Invalid expiration format: -5m');
      expect(() => parseExpiration('abc')).toThrow('Invalid expiration format: abc');
      expect(() => parseExpiration('5x')).toThrow('Unsupported expiration unit: x');
      expect(() => parseExpiration('')).toThrow('Invalid expiration format:');
    });
  });

  describe('Token Generation and Verification', () => {
    it('should generate valid token with all user properties', async () => {
      const user = { 
        id: 'user123', 
        email: 'test@example.com', 
        role: { name: 'ADMIN' }
      };
      
      const { token, exp } = await generateToken(user, '1h');
      
      expect(token).toBeDefined();
      expect(exp).toBeInstanceOf(Date);
      expect(exp.getTime()).toBeGreaterThan(Date.now());
      
      const payload = await verifyToken(token);
      expect(payload.userId).toBe('user123');
      expect(payload.email).toBe('test@example.com');
      expect(payload.role).toBe('ADMIN');
    });

    it('should handle user with string role', async () => {
      const user = { 
        id: 'user123', 
        email: 'test@example.com', 
        role: 'CUSTOMER'
      };
      
      const { token } = await generateToken(user, '15m');
      const payload = await verifyToken(token);
      expect(payload.role).toBe('CUSTOMER');
    });

    it('should handle userId vs id property', async () => {
      const user = { 
        userId: 'user456', 
        email: 'test2@example.com', 
        role: 'USER'
      };
      
      const { token } = await generateToken(user, '30m');
      const payload = await verifyToken(token);
      expect(payload.userId).toBe('user456');
    });

    it('should throw error for expired tokens', async () => {
      const expiredPayload = {
        userId: 'user123',
        email: 'test@example.com',
        role: 'USER',
        exp: new Date(Date.now() - 1000).toISOString(),
        iat: new Date().toISOString()
      };
      
      const expiredToken = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
      
      await expect(verifyToken(expiredToken)).rejects.toThrow('Token has expired');
    });

    it('should throw error for malformed tokens', async () => {
      await expect(verifyToken('invalid-token')).rejects.toThrow();
      await expect(verifyToken('')).rejects.toThrow();
      await expect(verifyToken(null)).rejects.toThrow();
    });
  });

  describe('User Creation', () => {
    it('should create user with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'testPassword123!',
        name: 'Test User',
        role: 'CUSTOMER'
      };
      
      databaseService.getUserByEmail.mockResolvedValue(null);
      databaseService.createUser.mockResolvedValue({
        id: 'user123',
        email: userData.email,
        name: userData.name,
        role: userData.role
      });
      
      const result = await createUser(userData);
      
      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email);
      expect(databaseService.createUser).toHaveBeenCalled();
    });

    it('should throw error for existing user', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User'
      };
      
      databaseService.getUserByEmail.mockResolvedValue({
        id: 'existing123',
        email: userData.email
      });
      
      await expect(createUser(userData)).rejects.toThrow('User already exists');
    });
  });

  describe('Token Blacklisting', () => {
    it('should hash token and check blacklist status', async () => {
      const token = 'test-token-123';
      const hash = await hashToken(token);
      
      expect(hash).toBeDefined();
      expect(hash.length).toBe(64); // SHA256 hex length
      
      // Mock blacklisted token
      databaseService.findBlacklistedToken.mockResolvedValue({ id: 'bl1', tokenHash: hash });
      
      const isBlacklisted = await isTokenBlacklisted(token);
      expect(isBlacklisted).toBe(true);
      // The function calls findBlacklistedToken with hash and an expiresAt filter
      expect(databaseService.findBlacklistedToken).toHaveBeenCalledWith(hash, expect.objectContaining({
        expiresAt: expect.objectContaining({
          gte: expect.any(Date)
        })
      }));
    });

    it('should return false for non-blacklisted tokens', async () => {
      databaseService.findBlacklistedToken.mockResolvedValue(null);
      
      const isBlacklisted = await isTokenBlacklisted('clean-token');
      expect(isBlacklisted).toBe(false);
    });

    it('should blacklist token with expiration', async () => {
      const token = 'token-to-blacklist';
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour
      
      databaseService.createBlacklistedToken.mockResolvedValue({
        id: 'bl2',
        tokenHash: await hashToken(token),
        expiresAt
      });
      
      const result = await blacklistToken(token, expiresAt);
      
      expect(result).toBeDefined();
      expect(result.id).toBe('bl2');
      expect(databaseService.createBlacklistedToken).toHaveBeenCalled();
    });
  });

  describe('User Login', () => {
    it('should login user with valid credentials', async () => {
      const email = 'user@example.com';
      const password = 'correctPassword';
      
      // Create a proper bcrypt hash for the password
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const mockUser = {
        id: 'user123',
        email: email,
        password: hashedPassword,
        role: 'CUSTOMER'
      };
      
      databaseService.getUserByEmail.mockResolvedValue(mockUser);
      databaseService.createRefreshToken.mockResolvedValue({
        id: 'refresh123',
        token: 'refresh-token-value'
      });
      
      const result = await login(email, password);
      
      expect(result).toBeDefined();
      expect(databaseService.getUserByEmail).toHaveBeenCalledWith(email, { isActive: true });
    });

    it('should throw error for invalid email', async () => {
      databaseService.getUserByEmail.mockResolvedValue(null);
      
      await expect(login('nonexistent@example.com', 'password'))
        .rejects.toThrow('Invalid email or password');
    });
  });

  describe('Token Refresh', () => {
    it('should refresh tokens successfully', async () => {
      // Create a valid base64url encoded token for testing
      const tokenPayload = {
        userId: 'user123',
        email: 'user@example.com',
        role: 'CUSTOMER',
        exp: new Date(Date.now() + 3600000).toISOString(),
        iat: new Date().toISOString()
      };
      const refreshTokenValue = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
      
      const mockRefreshTokenRecord = {
        id: 'refresh123',
        token: refreshTokenValue,
        userId: 'user123',
        expiresAt: new Date(Date.now() + 3600000),
        user: {
          id: 'user123',
          email: 'user@example.com',
          role: 'CUSTOMER'
        }
      };
      
      // Mock the hash function call
      const { createHash } = await import('node:crypto');
      const expectedHash = createHash('sha256').update(refreshTokenValue).digest('hex');
      
      databaseService.getRefreshToken.mockResolvedValue(mockRefreshTokenRecord);
      databaseService.getUserById.mockResolvedValue({
        id: 'user123',
        email: 'user@example.com',
        role: 'CUSTOMER',
        isActive: true
      });
      databaseService.createRefreshToken.mockResolvedValue({
        id: 'new-refresh123',
        token: 'new-refresh-token'
      });
      
      const result = await refreshToken(refreshTokenValue);
      
      expect(result).toBeDefined();
      expect(databaseService.getRefreshToken).toHaveBeenCalledWith(expectedHash);
    });

    it('should throw error for invalid refresh token', async () => {
      databaseService.getRefreshToken.mockResolvedValue(null);
      
      await expect(refreshToken('invalid-token')).rejects.toThrow('Invalid or expired refresh token');
    });
  });

  describe('Logout Operations', () => {
    it('should logout user successfully', async () => {
      // Create a valid token for logout
      const tokenPayload = {
        userId: 'user123',
        email: 'user@example.com',
        role: 'CUSTOMER',
        exp: new Date(Date.now() + 3600000).toISOString(),
        iat: new Date().toISOString()
      };
      const accessToken = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
      
      // Mock successful blacklisting
      databaseService.createBlacklistedToken.mockResolvedValue({
        id: 'bl123',
        tokenHash: 'hash123'
      });
      
      await logout(accessToken);
      
      // Verify that blacklistToken was called (via createBlacklistedToken)
      expect(databaseService.createBlacklistedToken).toHaveBeenCalled();
    });
  });

  describe('User Retrieval', () => {
    it('should get user by ID', async () => {
      const userId = 'user123';
      const mockUser = {
        id: userId,
        email: 'user@example.com',
        role: 'CUSTOMER'
      };
      
      databaseService.getUserById.mockResolvedValue(mockUser);
      
      const result = await getUserById(userId);
      
      expect(result).toBeDefined();
      expect(result.id).toBe(userId);
      expect(databaseService.getUserById).toHaveBeenCalledWith(userId, expect.any(Object));
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      databaseService.getUserByEmail.mockRejectedValue(new Error('Database connection failed'));
      
      await expect(login('test@example.com', 'password'))
        .rejects.toThrow('Database connection failed');
    });

    it('should handle token generation errors', async () => {
      // Test with missing required user properties
      await expect(generateToken({}, '1h')).rejects.toThrow();
      await expect(generateToken(null, '1h')).rejects.toThrow();
    });
  });
});
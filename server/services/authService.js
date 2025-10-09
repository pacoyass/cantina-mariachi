import { V4 } from 'paseto';
const { sign, verify } = V4;
import bcrypt from 'bcrypt';
import { databaseService } from './databaseService.js';

const privateKey = process.env.PASETO_PRIVATE_KEY;
const publicKey = process.env.PASETO_PUBLIC_KEY;
const allowInsecureTestTokens = process.env.NODE_ENV === 'test' || process.env.ALLOW_INSECURE_TEST_TOKENS === '1';

if ( !privateKey || !publicKey ) {
  console.error( "❌ Private/Public keys are missing! Set them in .env." );
  process.exit( 1 );
}

// Convert "15m", "7d" → seconds
export const parseExpiration = (time) => {
  const unit = time.slice(-1);
  const value = parseInt(time.slice(0, -1), 10);
  if (isNaN(value) || value <= 0) throw new Error(`Invalid expiration format: ${time}`);

  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    default: throw new Error(`Unsupported expiration unit: ${unit}`);
  }
};

// Generate a PASETO token
export const generateToken = async (user, expiresIn) => {
  const expiresInSeconds = parseExpiration(expiresIn);
  const expDate = new Date(Date.now() + expiresInSeconds * 1000);

  const payload = {
    userId: user.userId || user.id,
    email: user.email,
    role: user.role.name || user.role,
    exp: expDate.toISOString(),
    iat: new Date().toISOString(),
  };

  const token = await sign(payload, privateKey);
  return { token, exp: expDate };
};

// Verify and decode a PASETO token
export const verifyToken = async ( token ) =>
  {
      try {
          const payload = await verify( token, publicKey );
          payload.exp = new Date( payload.exp ); // ✅ Convert `exp` to Date object
          return payload;
      } catch ( error ) {
          if ( error.message.includes( "expired" ) ) {
              throw new Error( "Token has expired" );
          }
          throw new Error( "Invalid token" );
      }
  };

// Hash a token using SHA-256
// export async function hashToken(token) {
//   return createHash('sha256').update(token).digest('hex');
// }
export const hashToken = async ( token ) =>
  {
      return await bcrypt.hash( token, 10 );
  };
// Compare refresh token with stored hash
export const compareHashedToken = async (token, hashedToken) => {
  return await bcrypt.compare(token, hashedToken);
};

// Check if a token is blacklisted
export const isTokenBlacklisted = async (token) => {
  const tokenHash = await hashToken(token);
  const blacklisted = await databaseService.findBlacklistedToken(tokenHash, { expiresAt: { gte: new Date() } });
  return !!blacklisted;
};

// Blacklist a token
export const blacklistToken = async (token, expiresAt) => {
  try {
    const tokenHash = await hashToken(token);
    await databaseService.deleteExpiredBlacklistedToken(tokenHash);
    const result = await databaseService.createBlacklistedToken({ tokenHash, expiresAt });
    // Blacklist record created - using console.log to avoid circular dependency
    return result;
  } catch (error) {
    // Failed to create blacklist record - using console.error to avoid circular dependency
    throw error;
  }
};

// Create a new user
export const createUser = async ({ email, password, role, name, phone }) => {
  const existingUser = await databaseService.getUserByEmail(email);
  if (existingUser) throw new Error('User already exists');

  const user = await databaseService.createUser({ email, password, role, name, phone, isActive: true });
  return user;
};

// // Login a user
// export const login = async (email, password) => {
//   const user = await databaseService.getUserByEmail(email, { isActive: true });
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     throw new Error('Invalid email or password');
//   }

//   const accessToken = await generateToken(user, '15m');
//   const refreshToken = await generateToken(user, '7d');
//   const hashedRefreshToken = await hashToken(refreshToken.token);

//   await databaseService.refreshUserTokens(user.id, hashedRefreshToken, refreshToken.exp);

//   return { accessToken: accessToken.token, refreshToken: refreshToken.token };
// };

// // Refresh tokens
// export const refreshToken = async (refreshToken) => {
//   // Hash provided refresh token with SHA-256
//   const providedTokenHash = await hashToken(refreshToken);

//   // Validate stored refresh token exists and is not expired
//   const storedToken = await databaseService.getRefreshToken(providedTokenHash);
//   if (!storedToken || storedToken.expiresAt < new Date()) {
//     throw new Error('Invalid or expired refresh token');
//   }

//   // Verify provided PASETO refresh token
//   const payload = await verifyToken(refreshToken);

//   // Fetch user and ensure active
//   const user = await databaseService.getUserById(payload.userId);
//   if (!user || user.isActive === false) throw new Error('User not found');

//   // Issue new tokens
//   const newAccessToken = await generateToken(user, '15m');
//   const newRefreshToken = await generateToken(user, '7d');

//   // Store new refresh token hash for the user (rotate)
//   const newHashedRefreshToken = await hashToken(newRefreshToken.token);
//   await databaseService.refreshUserTokens(user.id, newHashedRefreshToken, newRefreshToken.exp);

//   return { accessToken: newAccessToken.token, newRefreshToken: newRefreshToken.token, userId: user.id };
// };

// // Logout a user
// export const logout = async (accessToken) => {
//   const payload = await verifyToken(accessToken);
//   const expiresAt = new Date(payload.exp);
//   await blacklistToken(accessToken, expiresAt);
// };

// Get user by ID
// export const getUserById = async (userId) => {
//   const user = await databaseService.getUserById(userId, { isActive: true });
//   if (!user) throw new Error('User not found');
//   return user;
// };
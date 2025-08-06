import { V4 } from 'paseto';
const { sign, verify } = V4;
import bcrypt from 'bcrypt';

const privateKey = process.env.PASETO_PRIVATE_KEY;
const publicKey = process.env.PASETO_PUBLIC_KEY;

if ( !privateKey || !publicKey ) {
    console.error( "❌ Private/Public keys are missing! Set them in .env." );
    process.exit( 1 );
}

// Convert "15m", "7d" → seconds
export const parseExpiration = ( time ) =>
{
    const unit = time.slice( -1 );
    const value = parseInt( time.slice( 0, -1 ), 10 );
    if ( isNaN( value ) || value <= 0 ) throw new Error( `Invalid expiration format: ${time}` );

    switch ( unit ) {
        case 's': return value; // Seconds
        case 'm': return value * 60; // Minutes
        case 'h': return value * 3600; // Hours
        case 'd': return value * 86400; // Days
        default: throw new Error( `Unsupported expiration unit: ${unit}` );
    }
};

//Generate a PASETO token
export const generateToken = async ( user, expiresIn ) =>
{
    const expiresInSeconds = parseExpiration( expiresIn );
    const expDate = new Date( Date.now() + expiresInSeconds * 1000 ); // ✅ Store as Date object
 

    const payload = {
        userId: user.userId || user.id,
        email: user.email,
        role: user.role.name || user.role,
        exp: expDate.toISOString(), // ✅ Keep ISO string inside token for PASETO
        iat: new Date().toISOString()
    };

    const token = await sign( payload, privateKey );
    return { token, exp: expDate }; // ✅ Return Date object for Prisma
};







// Verify and decode a PASETO token
export const verifyToken = async ( token ) =>
{
    try {
        const payload = await verify( token, publicKey );
        payload.exp = new Date( payload.exp ); // ✅ Convert `exp` to Date object
        return payload;
    } catch ( error ) {
        console.log("❌ Token verification failed:", error.message );
        
        if ( error.message.includes( "expired" ) ) {
               

            throw new Error( "Token has expired and needs to be refreshed" );
        }
        throw new Error( "Invalid token" );
    }
};





// // Hash a refresh token before storing it
// export const hashToken = async ( token ) =>
// {
//     return await bcrypt.hash( token, 10 );
// };

// Compare refresh token with stored hash
export const compareHashedToken = async ( token, hashedToken ) =>
{
    return await bcrypt.compare( token, hashedToken );
};

// In utils/authService.js
export async function hashToken(token) {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const tokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return tokenHash;
}

export const isTokenBlacklisted = async (token) => {
  const tokenHash = await hashToken(token);
  const blacklisted = await prisma.blacklistedToken.findFirst({
    where: { tokenHash, expiresAt: { gte: new Date() } },
  });
  return !!blacklisted;
};
export const blacklistToken = async (token, expiresAt) => {
  try {
    const tokenHash = await hashToken(token);
    // Delete any expired records with the same tokenHash
    await prisma.blacklistedToken.deleteMany({
      where: {
        tokenHash,
        expiresAt: { lt: new Date() },
      },
    });
    const result = await prisma.blacklistedToken.create({
      data: {
        tokenHash,
        expiresAt,
      },
    });
    console.log('🔹 Blacklist record created:', { result });
    return result;
  } catch (error) {
    console.error('❌ Failed to create blacklist record:', error.message);
    throw error;
  }
};


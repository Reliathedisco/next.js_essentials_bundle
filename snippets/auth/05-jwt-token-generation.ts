// JWT token generation and verification
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export async function generateToken(
  payload: TokenPayload,
  expiresIn: string = '7d'
): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
  
  return token;
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function refreshToken(oldToken: string): Promise<string | null> {
  const payload = await verifyToken(oldToken);
  
  if (!payload) {
    return null;
  }
  
  // Generate new token with same payload
  return generateToken({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  });
}

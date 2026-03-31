// Two-factor authentication (TOTP)
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

interface TwoFactorSecret {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export async function generateTwoFactorSecret(
  email: string,
  appName: string = 'Your App'
): Promise<TwoFactorSecret> {
  const secret = speakeasy.generateSecret({
    name: `${appName} (${email})`,
    length: 32,
  });
  
  const qrCode = await QRCode.toDataURL(secret.otpauth_url!);
  
  // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () =>
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );
  
  return {
    secret: secret.base32,
    qrCode,
    backupCodes,
  };
}

export function verifyTwoFactorToken(
  token: string,
  secret: string
): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 2 time steps of tolerance
  });
}

export function verifyBackupCode(
  code: string,
  backupCodes: string[]
): boolean {
  const index = backupCodes.indexOf(code.toUpperCase());
  
  if (index === -1) {
    return false;
  }
  
  // Remove used backup code
  backupCodes.splice(index, 1);
  return true;
}

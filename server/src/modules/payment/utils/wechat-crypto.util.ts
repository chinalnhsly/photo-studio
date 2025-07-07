import * as crypto from 'crypto';

export class WechatCrypto {
  static decrypt(encryptedData: string, key: string, iv: string): string {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  static generateSign(data: Record<string, any>, apiKey: string): string {
    const sortedParams = Object.keys(data)
      .filter(key => data[key] !== undefined && data[key] !== null && key !== 'sign')
      .sort()
      .map(key => `${key}=${data[key]}`)
      .join('&') + `&key=${apiKey}`;
      
    return crypto
      .createHash('md5')
      .update(sortedParams)
      .digest('hex')
      .toUpperCase();
  }
}

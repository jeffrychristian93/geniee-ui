import { urlBase64Decode } from '../../helpers';

export interface NbAuthToken {
  getValue(): string;
  isValid(): boolean;
  toString(): string;
}

export interface NbTokenClass {
  new (raw: string): NbAuthToken
}

export function nbCreateToken(tokenClass: NbTokenClass, token: string) {
  return new tokenClass(token);
}

/**
 * Wrapper for simple (text) token
 */
export class NbAuthSimpleToken implements NbAuthToken {

  constructor(readonly token: string) {
  }

  /**
   * Returns the token value
   * @returns string
   */
  getValue(): string {
    return this.token;
  }

  /**
   * Is non empty and valid
   * @returns {boolean}
   */
  isValid(): boolean {
    return !!this.token;
  }

  /**
   * Validate value and convert to string, if value is not valid return empty string
   * @returns {string}
   */
  toString(): string {
    return !!this.token ? this.token : '';
  }
}

/**
 * Wrapper for JWT token with additional methods.
 */
export class NbAuthJWTToken extends NbAuthSimpleToken {

  /**
   * Returns payload object
   * @returns any
   */
  getPayload(): any {

    if (!this.token) {
      console.log("gagal extract token");
      throw new Error('Cannot extract payload from an empty token.');
    }

    const parts = this.token.split('.');

    console.log("parts :"+parts.length);
    if (parts.length !== 3) {
      console.log("bagian JWT token tidak lengkap");
      throw new Error(`The token ${this.token} is not valid JWT token and must consist of three parts.`);
    }

    let decoded;
    try {
      decoded = urlBase64Decode(parts[1]);
      console.log("berhasil decoded : " + decoded);
    } catch (e) {
      console.log("JWT token tidak valid");
      throw new Error(`The token ${this.token} is not valid JWT token and cannot be parsed.`);
    }

    console.log("JWT 1");
    if (!decoded) {
      console.log("JWT 2");
      throw new Error(`The token ${this.token} is not valid JWT token and cannot be decoded.`);
    }

    console.log("JWT 3");
    return JSON.parse(decoded);
  }

  /**
   * Returns expiration date
   * @returns Date
   */
  getTokenExpDate(): Date {
    const decoded = this.getPayload();
    if (!decoded.hasOwnProperty('exp')) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    return date;
  }

  /**
   * Is data expired
   * @returns {boolean}
   */
  isValid(): boolean {
    return super.isValid() && (!this.getTokenExpDate() || new Date() < this.getTokenExpDate());
  }
}

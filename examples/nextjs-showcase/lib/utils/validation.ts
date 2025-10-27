/**
 * Validation Utilities
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate numeric value against FHE type constraints
 */
export function validateNumericValue(value: number | bigint, type: string): ValidationResult {
  const num = typeof value === 'bigint' ? Number(value) : value;

  if (!Number.isFinite(num) && type !== 'uint64') {
    return { valid: false, error: 'Value must be a finite number' };
  }

  switch (type) {
    case 'uint8':
      if (num < 0 || num > 255 || !Number.isInteger(num)) {
        return { valid: false, error: 'Value must be an integer between 0 and 255' };
      }
      break;

    case 'uint16':
      if (num < 0 || num > 65535 || !Number.isInteger(num)) {
        return { valid: false, error: 'Value must be an integer between 0 and 65535' };
      }
      break;

    case 'uint32':
      if (num < 0 || num > 4294967295 || !Number.isInteger(num)) {
        return { valid: false, error: 'Value must be an integer between 0 and 4294967295' };
      }
      break;

    case 'uint64':
      if (typeof value === 'bigint') {
        if (value < 0n || value > 18446744073709551615n) {
          return { valid: false, error: 'Value must be between 0 and 2^64-1' };
        }
      } else if (num < 0) {
        return { valid: false, error: 'Value must be positive' };
      }
      break;

    default:
      return { valid: false, error: 'Invalid type for numeric value' };
  }

  return { valid: true };
}

/**
 * Validate Ethereum address
 */
export function validateAddress(address: string): ValidationResult {
  if (typeof address !== 'string') {
    return { valid: false, error: 'Address must be a string' };
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { valid: false, error: 'Invalid Ethereum address format' };
  }

  return { valid: true };
}

/**
 * Validate boolean value
 */
export function validateBoolean(value: any): ValidationResult {
  if (typeof value !== 'boolean') {
    return { valid: false, error: 'Value must be a boolean' };
  }

  return { valid: true };
}

/**
 * Validate encrypted data format
 */
export function validateEncryptedData(data: any): ValidationResult {
  if (!data) {
    return { valid: false, error: 'Encrypted data is required' };
  }

  if (typeof data !== 'object') {
    return { valid: false, error: 'Encrypted data must be an object' };
  }

  if (!data.data || typeof data.data !== 'string') {
    return { valid: false, error: 'Encrypted data must contain a data field' };
  }

  if (!data.signature || typeof data.signature !== 'string') {
    return { valid: false, error: 'Encrypted data must contain a signature field' };
  }

  return { valid: true };
}

/**
 * Validate computation operation
 */
export function validateOperation(operation: string): ValidationResult {
  const validOperations = ['add', 'subtract', 'multiply', 'compare'];

  if (!validOperations.includes(operation)) {
    return {
      valid: false,
      error: `Invalid operation. Must be one of: ${validOperations.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Validate operands for computation
 */
export function validateOperands(operands: any[]): ValidationResult {
  if (!Array.isArray(operands)) {
    return { valid: false, error: 'Operands must be an array' };
  }

  if (operands.length < 2) {
    return { valid: false, error: 'At least two operands are required' };
  }

  for (let i = 0; i < operands.length; i++) {
    if (typeof operands[i] !== 'string') {
      return { valid: false, error: `Operand at index ${i} must be a string` };
    }
  }

  return { valid: true };
}

/**
 * Validate permit structure
 */
export function validatePermit(permit: any): ValidationResult {
  if (!permit || typeof permit !== 'object') {
    return { valid: false, error: 'Permit must be an object' };
  }

  if (!permit.signature || typeof permit.signature !== 'string') {
    return { valid: false, error: 'Permit must contain a signature' };
  }

  if (!permit.publicKey || typeof permit.publicKey !== 'string') {
    return { valid: false, error: 'Permit must contain a public key' };
  }

  if (permit.expiresAt) {
    const expiryDate = new Date(permit.expiresAt);
    if (isNaN(expiryDate.getTime())) {
      return { valid: false, error: 'Invalid expiration date' };
    }
    if (expiryDate < new Date()) {
      return { valid: false, error: 'Permit has expired' };
    }
  }

  return { valid: true };
}

/**
 * Validate API request body
 */
export function validateRequestBody(body: any, requiredFields: string[]): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be an object' };
  }

  for (const field of requiredFields) {
    if (!(field in body)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  return { valid: true };
}

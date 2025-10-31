/**
 * React Hooks for FHEVM SDK
 *
 * This module exports all React hooks for easy integration of FHEVM
 * functionality into React applications.
 */

export { useFhevm, FhevmProvider } from './useFhevm';
export { useEncryption } from './useEncryption';
export { useComputation } from './useComputation';

// Re-export from React adapter
export { useEncrypt, useDecrypt } from '../adapters/react';

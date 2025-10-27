import { useState, useCallback } from 'react';

export type ComputationOperation = 'add' | 'subtract' | 'multiply' | 'compare';

export interface ComputationResult {
  operation: string;
  encryptedResult: string;
  timestamp: string;
}

export function useComputation() {
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<ComputationResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const compute = useCallback(async (
    operation: ComputationOperation,
    operands: string[]
  ): Promise<ComputationResult> => {
    if (operands.length < 2) {
      throw new Error('At least two operands are required');
    }

    setIsComputing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, operands }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Computation failed');
      }

      const data = await response.json();
      const computationResult = data.computation;
      setResult(computationResult);
      return computationResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsComputing(false);
    }
  }, []);

  const add = useCallback(async (operands: string[]) => {
    return compute('add', operands);
  }, [compute]);

  const subtract = useCallback(async (operands: string[]) => {
    return compute('subtract', operands);
  }, [compute]);

  const multiply = useCallback(async (operands: string[]) => {
    return compute('multiply', operands);
  }, [compute]);

  const compare = useCallback(async (operands: string[]) => {
    return compute('compare', operands);
  }, [compute]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    compute,
    add,
    subtract,
    multiply,
    compare,
    reset,
    isComputing,
    result,
    error,
  };
}

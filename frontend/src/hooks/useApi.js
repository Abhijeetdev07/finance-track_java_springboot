import { useState, useCallback } from 'react';
import * as api from '../services/api';
import { getErrorMessage, logError } from '../utils/errorHandler';

/**
 * Custom React Hook for API calls with loading and error states
 * Provides a consistent way to handle async API operations
 * 
 * @returns {Object} - Object containing loading state, error state, and API functions
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);

  /**
   * Wrapper function to handle API calls with loading and error states
   * @param {Function} apiCall - Async function that makes the API call
   * @param {string} context - Context for error logging
   * @returns {Promise} - Result of the API call
   */
  const executeApiCall = useCallback(async (apiCall, context = '') => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      logError(err, context);
      setLoading(false);
      throw err; // Re-throw so caller can handle if needed
    }
  }, []);

  // Helper to refresh transactions
  const refreshTransactions = useCallback(async () => {
    try {
      const result = await api.getAllTransactions();
      setTransactions(result);
    } catch (err) {
      console.error('Error refreshing transactions:', err);
    }
  }, []);

  // API functions with loading and error handling
  const getAllTransactions = useCallback(async () => {
    const result = await executeApiCall(() => api.getAllTransactions(), 'getAllTransactions');
    setTransactions(result);
    return result;
  }, [executeApiCall]);

  const getTransactionById = useCallback(async (id) => {
    return executeApiCall(() => api.getTransactionById(id), 'getTransactionById');
  }, [executeApiCall]);

  const createTransaction = useCallback(async (transaction) => {
    const result = await executeApiCall(() => api.createTransaction(transaction), 'createTransaction');
    // Refresh transactions list
    await refreshTransactions();
    return result;
  }, [executeApiCall, refreshTransactions]);

  const updateTransaction = useCallback(async (id, transaction) => {
    const result = await executeApiCall(() => api.updateTransaction(id, transaction), 'updateTransaction');
    // Refresh transactions list
    await refreshTransactions();
    return result;
  }, [executeApiCall, refreshTransactions]);

  const deleteTransaction = useCallback(async (id) => {
    await executeApiCall(() => api.deleteTransaction(id), 'deleteTransaction');
    // Refresh transactions list
    await refreshTransactions();
  }, [executeApiCall, refreshTransactions]);

  const getBalance = useCallback(async () => {
    const result = await executeApiCall(() => api.getBalance(), 'getBalance');
    setBalance(result);
    return result;
  }, [executeApiCall]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    clearError,
    transactions,
    balance,
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getBalance,
  };
}


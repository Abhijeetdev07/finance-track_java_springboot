// API Base URL
const API_BASE_URL = 'http://localhost:8080/api/transactions';

/**
 * API Service for Transaction CRUD Operations
 * Handles all HTTP requests to the backend API
 */

/**
 * Generic fetch wrapper with error handling
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} - Response data or throws error
 */
async function fetchAPI(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle error responses
    if (!response.ok) {
      const error = {
        status: response.status,
        statusText: response.statusText,
        message: data.error || data.message || `HTTP error! status: ${response.status}`,
        data: data,
      };
      throw error;
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw {
        status: 0,
        statusText: 'Network Error',
        message: 'Unable to connect to the server. Please check if the backend is running.',
        data: null,
      };
    }
    // Re-throw API errors
    throw error;
  }
}

/**
 * Get all transactions
 * @returns {Promise<Array>} - Array of transaction objects
 */
export async function getAllTransactions() {
  return fetchAPI(API_BASE_URL);
}

/**
 * Get a single transaction by ID
 * @param {string} id - Transaction ID
 * @returns {Promise<Object>} - Transaction object
 */
export async function getTransactionById(id) {
  return fetchAPI(`${API_BASE_URL}/${id}`);
}

/**
 * Create a new transaction
 * @param {Object} transaction - Transaction data
 * @param {string} transaction.description - Transaction description
 * @param {number} transaction.amount - Transaction amount (must be positive)
 * @param {string} transaction.type - Transaction type ('INCOME' or 'EXPENSE')
 * @param {string} transaction.date - Transaction date (YYYY-MM-DD format)
 * @param {string} [transaction.category] - Transaction category (optional)
 * @returns {Promise<Object>} - Created transaction object with ID
 */
export async function createTransaction(transaction) {
  return fetchAPI(API_BASE_URL, {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
}

/**
 * Update an existing transaction
 * @param {string} id - Transaction ID to update
 * @param {Object} transaction - Updated transaction data
 * @returns {Promise<Object>} - Updated transaction object
 */
export async function updateTransaction(id, transaction) {
  return fetchAPI(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(transaction),
  });
}

/**
 * Delete a transaction by ID
 * @param {string} id - Transaction ID to delete
 * @returns {Promise<Object>} - Success message object
 */
export async function deleteTransaction(id) {
  return fetchAPI(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Get current balance
 * @returns {Promise<Object>} - Balance object with balance value
 * @example { balance: 4850.50 }
 */
export async function getBalance() {
  return fetchAPI(`${API_BASE_URL}/balance`);
}

// Export API base URL for reference
export { API_BASE_URL };


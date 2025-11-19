/**
 * Error Handler Utility
 * Provides consistent error handling and user-friendly error messages
 */

/**
 * Get user-friendly error message from API error
 * @param {Object} error - Error object from API
 * @returns {string} - User-friendly error message
 */
export function getErrorMessage(error) {
  // Network errors
  if (error.status === 0 || error.statusText === 'Network Error') {
    return 'Unable to connect to the server. Please check if the backend is running on http://localhost:8080';
  }

  // HTTP status code errors
  if (error.status === 404) {
    return 'Transaction not found. It may have been deleted.';
  }

  if (error.status === 400) {
    return error.message || 'Invalid data. Please check your input and try again.';
  }

  if (error.status === 500) {
    return 'Server error. Please try again later.';
  }

  // Validation errors from backend
  if (error.message) {
    return error.message;
  }

  // Generic error
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Log error to console (for debugging)
 * @param {Object} error - Error object
 * @param {string} context - Context where error occurred
 */
export function logError(error, context = '') {
  console.error(`[Error${context ? ` in ${context}` : ''}]:`, {
    status: error.status,
    statusText: error.statusText,
    message: error.message,
    data: error.data,
  });
}

/**
 * Check if error is a network error
 * @param {Object} error - Error object
 * @returns {boolean} - True if network error
 */
export function isNetworkError(error) {
  return error.status === 0 || error.statusText === 'Network Error';
}

/**
 * Check if error is a validation error
 * @param {Object} error - Error object
 * @returns {boolean} - True if validation error (400)
 */
export function isValidationError(error) {
  return error.status === 400;
}

/**
 * Check if error is a not found error
 * @param {Object} error - Error object
 * @returns {boolean} - True if not found (404)
 */
export function isNotFoundError(error) {
  return error.status === 404;
}


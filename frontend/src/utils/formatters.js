/**
 * Utility functions for formatting data
 */

/**
 * Format number as currency
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
}

/**
 * Format date string to readable format
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} - Formatted date (e.g., "Jan 15, 2024")
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} - Today's date
 */
export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


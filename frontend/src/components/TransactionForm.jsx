import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { getTodayDate } from '../utils/formatters';

function TransactionForm({ transaction, onSuccess, onCancel }) {
  const { loading, error, createTransaction, updateTransaction } = useApi();
  const isEditing = !!transaction;

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'EXPENSE',
    date: getTodayDate(),
    category: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description || '',
        amount: transaction.amount || '',
        type: transaction.type || 'EXPENSE',
        date: transaction.date || getTodayDate(),
        category: transaction.category || '',
      });
    }
  }, [transaction]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.type) {
      errors.type = 'Type is required';
    }
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const transactionData = {
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        type: formData.type,
        date: formData.date,
        category: formData.category.trim() || undefined,
      };

      if (isEditing) {
        await updateTransaction(transaction.id, transactionData);
      } else {
        await createTransaction(transactionData);
      }

      // Reset form
      setFormData({
        description: '',
        amount: '',
        type: 'EXPENSE',
        date: getTodayDate(),
        category: '',
      });
      setFormErrors({});

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Error is handled by useApi hook
      console.error('Transaction save error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              formErrors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter description"
          />
          {formErrors.description && (
            <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            className={`w-full px-3 py-2 border rounded-md ${
              formErrors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {formErrors.amount && (
            <p className="text-red-500 text-sm mt-1">{formErrors.amount}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="INCOME"
                checked={formData.type === 'INCOME'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-green-600 font-medium">Income</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="EXPENSE"
                checked={formData.type === 'EXPENSE'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-red-600 font-medium">Expense</span>
            </label>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              formErrors.date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.date && (
            <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category (Optional)
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., Food, Salary, Rent"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEditing ? 'Update' : 'Add Transaction'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;


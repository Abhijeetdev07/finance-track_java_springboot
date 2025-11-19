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
    <section className="glass-panel p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{isEditing ? 'Update Entry' : 'Log entry'}</p>
          <h2 className="text-3xl font-semibold text-white mt-3">
            {isEditing ? 'Tune transaction parameters' : 'Add a new data point'}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Provide precise numbers to keep the dashboard telemetry in sync.
          </p>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="neon-outline whitespace-nowrap">
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Description *</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 ${
                formErrors.description ? 'border-red-500/70' : ''
              }`}
              placeholder="e.g., Salary drop, Rent pulse"
            />
            {formErrors.description && (
              <p className="text-red-400 text-sm">{formErrors.description}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              className={`w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 ${
                formErrors.amount ? 'border-red-500/70' : ''
              }`}
              placeholder="0.00"
            />
            {formErrors.amount && (
              <p className="text-red-400 text-sm">{formErrors.amount}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Type *</label>
            <div className="grid grid-cols-2 gap-3">
              {[{
                label: 'Income',
                value: 'INCOME',
                accent: 'from-emerald-400 to-sky-400',
              }, {
                label: 'Expense',
                value: 'EXPENSE',
                accent: 'from-rose-400 to-fuchsia-500',
              }].map((option) => (
                <label key={option.value} className={`rounded-2xl border border-white/15 px-4 py-3 cursor-pointer transition-colors ${
                  formData.type === option.value ? 'bg-gradient-to-r text-white ' + option.accent : 'bg-white/5 text-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value={option.value}
                    checked={formData.type === option.value}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="text-sm font-semibold tracking-wide text-center">
                    {option.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:outline-none focus:border-indigo-400 ${
                formErrors.date ? 'border-red-500/70' : ''
              }`}
            />
            {formErrors.date && (
              <p className="text-red-400 text-sm">{formErrors.date}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Category (optional)</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
              placeholder="Food, Utilities, Freelance, etc."
            />
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3">
          <button type="submit" disabled={loading} className="neon-button text-center">
            {loading ? 'Syncing...' : isEditing ? 'Update transaction' : 'Add transaction'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default TransactionForm;


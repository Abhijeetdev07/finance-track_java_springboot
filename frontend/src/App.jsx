import { useState, useEffect } from 'react';
import { useApi } from './hooks/useApi';
import BalanceDisplay from './components/BalanceDisplay';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

function App() {
  const {
    loading,
    error,
    transactions,
    balance,
    getAllTransactions,
    getBalance,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useApi();

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([getAllTransactions(), getBalance()]);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleAddClick = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        await getBalance(); // Refresh balance after deletion
      } catch (err) {
        console.error('Error deleting transaction:', err);
      }
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingTransaction(null);
    await getBalance(); // Refresh balance after create/update
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Personal Finance Tracker
          </h1>
          <p className="text-gray-600">Manage your income and expenses</p>
        </div>

        {/* Balance Display */}
        <BalanceDisplay balance={balance} loading={loading} error={error} />

        {/* Add Transaction Button */}
        {!showForm && (
          <div className="mb-6">
            <button
              onClick={handleAddClick}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors font-semibold"
            >
              + Add New Transaction
            </button>
          </div>
        )}

        {/* Transaction Form */}
        {showForm && (
          <TransactionForm
            transaction={editingTransaction}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}

        {/* Transactions List */}
        {!showForm && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Transactions
            </h2>
            <TransactionList
              transactions={transactions}
              loading={loading}
              error={error}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

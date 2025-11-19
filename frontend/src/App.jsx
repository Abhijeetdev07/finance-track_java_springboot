import { useState, useEffect, useMemo } from 'react';
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

  const { incomeTotal, expenseTotal, netFlow, transactionCount } = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return { incomeTotal: 0, expenseTotal: 0, netFlow: 0, transactionCount: 0 };
    }

    const incomeTotal = transactions
      .filter((tx) => tx.type === 'INCOME')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    const expenseTotal = transactions
      .filter((tx) => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    return {
      incomeTotal,
      expenseTotal,
      netFlow: incomeTotal - expenseTotal,
      transactionCount: transactions.length,
    };
  }, [transactions]);

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
    <div className="min-h-screen cyber-grid py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="glass-panel px-8 py-10 relative overflow-hidden">
          <div className="absolute inset-y-0 right-14 w-56 bg-emerald-400/10 blur-3xl rotate-12" />
          <div className="absolute -bottom-12 left-10 w-64 h-64 bg-sky-500/20 blur-3xl rounded-full" />
          <div className="relative z-10 space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-sky-300">Finance Command Center</p>
              <h1 className="text-4xl md:text-5xl font-semibold text-white mt-3">
                Personal Finance Tracker
              </h1>
              <p className="text-slate-300 mt-3 max-w-3xl">
                Monitor income, expenses, and balance through a sleek control deck built for clarity and speed.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button onClick={showForm ? handleFormCancel : handleAddClick} className="neon-button">
                {showForm ? 'Close transaction form' : '+ Log new transaction'}
              </button>
              <button onClick={loadData} className="neon-outline">
                Refresh data
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-slate-100">
              {[{
                label: 'Total entries',
                value: transactionCount,
                accent: 'from-sky-400 to-blue-500',
              }, {
                label: 'Income inflow',
                value: `$${incomeTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                accent: 'from-emerald-400 to-teal-500',
              }, {
                label: 'Expense outflow',
                value: `$${expenseTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                accent: 'from-rose-400 to-fuchsia-500',
              }, {
                label: 'Net flow',
                value: `${netFlow >= 0 ? '+' : '-'}$${Math.abs(netFlow).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                accent: 'from-indigo-400 to-purple-500',
              }].map((card) => (
                <div key={card.label} className="rounded-2xl p-[1px] bg-gradient-to-br from-white/40 via-white/10 to-transparent">
                  <div className="rounded-[22px] bg-slate-900/60 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">{card.label}</p>
                    <p className={`text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r ${card.accent}`}>
                      {card.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        <BalanceDisplay balance={balance} loading={loading} error={error} />

        {showForm && (
          <TransactionForm
            transaction={editingTransaction}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}

        {!showForm && (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Transaction timeline</h2>
                <p className="text-slate-400 text-sm">Tap any card to edit or remove entries.</p>
              </div>
              <button onClick={handleAddClick} className="hidden md:block neon-outline">
                Add entry
              </button>
            </div>
            <TransactionList
              transactions={transactions}
              loading={loading}
              error={error}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </section>
        )}
      </div>
    </div>
  );
}

export default App;

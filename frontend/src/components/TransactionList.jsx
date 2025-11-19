import TransactionItem from './TransactionItem';

function TransactionList({ transactions, loading, error, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-500">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-md p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Transactions</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">No transactions found.</p>
        <p className="text-gray-400 text-sm mt-2">Add your first transaction to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TransactionList;


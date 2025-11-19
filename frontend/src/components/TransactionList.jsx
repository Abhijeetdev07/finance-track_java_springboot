import TransactionItem from './TransactionItem';

function TransactionList({ transactions, loading, error, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="glass-panel p-10 text-center">
        <div className="mx-auto h-12 w-56 rounded-full bg-white/5 animate-pulse" />
        <p className="text-slate-400 mt-4 tracking-wide">Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel border border-red-500/30 p-8">
        <h3 className="text-red-300 font-semibold mb-2 uppercase tracking-[0.3em] text-xs">Error</h3>
        <p className="text-red-200 text-lg">{error}</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="glass-panel p-10 text-center space-y-4">
        <div className="mx-auto w-24 h-24 rounded-full border border-white/20 flex items-center justify-center">
          <span className="text-3xl text-white/40">∞</span>
        </div>
        <p className="text-slate-100 text-lg font-semibold">No transactions yet</p>
        <p className="text-slate-400 text-sm">Log your first entry to activate insights.</p>
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


import { formatCurrency, formatDate } from '../utils/formatters';

function TransactionItem({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'INCOME';
  const gradient = isIncome
    ? 'from-emerald-400/80 via-sky-400/70 to-blue-400/60'
    : 'from-rose-500/80 via-fuchsia-500/70 to-purple-500/60';

  return (
    <article className="relative rounded-3xl p-[1px] bg-gradient-to-r from-white/30 via-white/5 to-transparent hover:scale-[1.01] transition-transform">
      <div className="glass-panel px-6 py-5 flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold text-white">
              {transaction.description}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${gradient}`}>
              {transaction.type}
            </span>
            {transaction.category && (
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400 border border-white/10 rounded-full px-3 py-1">
                {transaction.category}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
            <span className="text-2xl font-semibold text-white">
              {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
            </span>
            <span>{formatDate(transaction.date)}</span>
          </div>
        </div>

        <div className="flex gap-3 self-start md:self-center">
          <button
            onClick={() => onEdit(transaction)}
            className="rounded-full border border-white/20 p-2 text-sky-200 hover:border-sky-400/60 hover:text-white"
            aria-label="Edit transaction"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="rounded-full border border-white/20 p-2 text-rose-200 hover:border-rose-400/60 hover:text-white"
            aria-label="Delete transaction"
          >
            ✕
          </button>
        </div>
      </div>
    </article>
  );
}

export default TransactionItem;


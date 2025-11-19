import { formatCurrency } from '../utils/formatters';

const ringGradients = balance => balance >= 0
  ? 'from-emerald-400 via-sky-500 to-blue-500'
  : 'from-rose-500 via-fuchsia-500 to-purple-500';

function BalanceDisplay({ balance, loading, error }) {
  const balanceValue = balance?.balance || 0;

  return (
    <section className="glass-panel overflow-hidden px-8 py-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-center">
        <div className="flex-1 space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Current Balance</p>
          {loading ? (
            <div className="h-12 w-60 rounded-full bg-white/5 animate-pulse" />
          ) : error ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : (
            <div>
              <span className={`text-4xl md:text-5xl font-semibold bg-gradient-to-r ${ringGradients(balanceValue)} bg-clip-text text-transparent`}>
                {formatCurrency(balanceValue)}
              </span>
              <p className="text-slate-400 mt-2">{balanceValue >= 0 ? 'You are in the green. Keep stacking.' : 'Negative flow detected. Course-correct soon.'}</p>
            </div>
          )}
        </div>

        <div className="relative w-48 h-48 mx-auto">
          <div className="absolute inset-0 rounded-full border border-white/20 blur-2xl" />
          <div className={`absolute inset-6 rounded-full bg-gradient-to-tr ${ringGradients(balanceValue)} opacity-20 blur-2xl`} />
          <div className="absolute inset-3 rounded-full border border-white/10" />
          <div className="relative h-full w-full rounded-full bg-slate-950/70 flex flex-col items-center justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Status</p>
            <p className="text-lg font-semibold text-white mt-1">
              {loading ? 'Syncing...' : balanceValue >= 0 ? 'Surplus' : 'Deficit'}
            </p>
            <p className="text-sm text-slate-400 mt-2">Live telemetry</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BalanceDisplay;


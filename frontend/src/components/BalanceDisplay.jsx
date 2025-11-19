import { formatCurrency } from '../utils/formatters';

function BalanceDisplay({ balance, loading, error }) {
  const balanceValue = balance?.balance || 0;
  const balanceColor = balanceValue >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Current Balance</h2>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <div className={`text-3xl font-bold ${balanceColor}`}>
          {formatCurrency(balanceValue)}
        </div>
      )}
    </div>
  );
}

export default BalanceDisplay;


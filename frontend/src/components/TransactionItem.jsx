import { formatCurrency, formatDate } from '../utils/formatters';

function TransactionItem({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'INCOME';
  const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
  const typeBadgeColor = isIncome 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {transaction.description}
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${typeBadgeColor}`}>
              {transaction.type}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className={`text-xl font-bold ${amountColor}`}>
              {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
            </span>
            <span>{formatDate(transaction.date)}</span>
            {transaction.category && (
              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                {transaction.category}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(transaction)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionItem;


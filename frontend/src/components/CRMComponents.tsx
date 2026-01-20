// Composant réutilisable de carte de statistique
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
}

export function StatCard({ title, value, subtitle, icon, trend, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    indigo: 'from-indigo-500 to-indigo-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-lg shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm opacity-90">{title}</span>
        <div className="opacity-80">{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      {subtitle && <div className="text-xs opacity-80">{subtitle}</div>}
      {trend && (
        <div className={`text-xs mt-2 ${trend.isPositive ? 'text-white' : 'text-red-200'}`}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}
        </div>
      )}
    </div>
  );
}

// Composant de graphique simple en barres
interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  height?: number;
  color?: string;
}

export function SimpleBarChart({ data, height = 200, color = '#3b82f6' }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end justify-between gap-2" style={{ height: `${height}px` }}>
      {data.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center">
          <div
            className="w-full rounded-t transition-all hover:opacity-80"
            style={{
              height: `${(item.value / maxValue) * 100}%`,
              backgroundColor: color,
              minHeight: '4px',
            }}
          />
          <div className="text-xs text-gray-600 mt-2 text-center">{item.label}</div>
          <div className="text-xs font-semibold text-gray-900">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

// Composant de tableau de données
interface DataTableProps {
  headers: string[];
  rows: Array<Array<React.ReactNode>>;
  emptyMessage?: string;
}

export function DataTable({ headers, rows, emptyMessage = 'Aucune donnée' }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.length > 0 ? (
            rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Badge de statut
interface StatusBadgeProps {
  status: string;
  type?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

export function StatusBadge({ status, type = 'default' }: StatusBadgeProps) {
  const typeClasses = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeClasses[type]}`}>
      {status}
    </span>
  );
}

// Carte de métrique avec progression
interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, change, icon }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>
      <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
          style={{ width: `${Math.min(Math.abs(change), 100)}%` }}
        />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { AlertFeed } from '../components/AlertFeed';
import { mockAlerts, Alert } from '../services/mockData';
import { Search, Download } from 'lucide-react';
import { format } from 'date-fns';

export const AlertsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredAlerts = mockAlerts.filter((alert) => {
    const matchesSearch = alert.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.attackType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Device', 'Severity', 'Attack Type', 'Anomaly Score', 'Description'];
    const rows = filteredAlerts.map(alert => [
      format(alert.timestamp, 'yyyy-MM-dd HH:mm:ss'),
      alert.deviceName,
      alert.severity,
      alert.attackType,
      alert.anomalyScore,
      alert.description
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alerts-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const severityCounts = {
    high: mockAlerts.filter(a => a.severity === 'high').length,
    medium: mockAlerts.filter(a => a.severity === 'medium').length,
    low: mockAlerts.filter(a => a.severity === 'low').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Security Alerts</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage security events</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-100 dark:bg-red-900/30 rounded-2xl p-6 border border-red-200 dark:border-red-800">
          <h3 className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">High Severity</h3>
          <p className="text-3xl font-bold text-red-900 dark:text-red-300">{severityCounts.high}</p>
        </div>
        <div className="bg-orange-100 dark:bg-orange-900/30 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
          <h3 className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-1">Medium Severity</h3>
          <p className="text-3xl font-bold text-orange-900 dark:text-orange-300">{severityCounts.medium}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-1">Low Severity</h3>
          <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-300">{severityCounts.low}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by device name or attack type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Showing {filteredAlerts.length} of {mockAlerts.length} alerts
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <AlertFeed alerts={filteredAlerts} maxItems={50} />
      </div>
    </div>
  );
};

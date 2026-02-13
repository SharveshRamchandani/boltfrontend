import { Device, generateTrafficData, mockProtocolData } from '../services/mockData';
import { X } from 'lucide-react';
import { TrafficChart } from './TrafficChart';
import { ProtocolPieChart } from './ProtocolPieChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface DeviceDetailModalProps {
  device: Device;
  onClose: () => void;
}

export const DeviceDetailModal = ({ device, onClose }: DeviceDetailModalProps) => {
  const trafficData = generateTrafficData(30);

  const anomalyTrend = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    score: Math.floor(Math.random() * 40) + device.behaviorScore - 20
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'suspicious':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Device Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Device Name</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{device.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Device Type</label>
                <p className="text-lg text-gray-900 dark:text-white">{device.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">IP Address</label>
                <p className="text-lg font-mono text-gray-900 dark:text-white">{device.ipAddress}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">MAC Address</label>
                <p className="text-lg font-mono text-gray-900 dark:text-white">{device.macAddress}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                <div>
                  <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(device.status)}`}>
                    {device.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Behavior Score</label>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{device.behaviorScore}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Anomaly Score Trend (24h)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={anomalyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
                <XAxis dataKey="time" className="text-gray-600 dark:text-gray-400" tick={{ fill: 'currentColor' }} />
                <YAxis className="text-gray-600 dark:text-gray-400" tick={{ fill: 'currentColor' }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrafficChart data={trafficData} title="Traffic Pattern" dataKey="packetsPerMinute" />
            <ProtocolPieChart data={mockProtocolData} title="Protocol Usage" />
          </div>
        </div>
      </div>
    </div>
  );
};

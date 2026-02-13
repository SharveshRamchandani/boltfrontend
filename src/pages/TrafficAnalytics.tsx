import { useState } from 'react';
import { TrafficChart } from '../components/TrafficChart';
import { ProtocolPieChart } from '../components/ProtocolPieChart';
import { generateTrafficData, mockProtocolData } from '../services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

type TimeRange = 'hour' | 'day' | 'week';

export const TrafficAnalytics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('hour');

  const getDataPoints = () => {
    switch (timeRange) {
      case 'hour':
        return 60;
      case 'day':
        return 24;
      case 'week':
        return 168;
      default:
        return 60;
    }
  };

  const trafficData = generateTrafficData(getDataPoints());

  const connectionSpikeData = trafficData.map(item => ({
    time: format(item.timestamp, timeRange === 'hour' ? 'HH:mm' : 'MM/dd HH:mm'),
    connections: item.connections,
    packets: Math.floor(item.packetsPerMinute / 100)
  }));

  const avgPackets = Math.floor(
    trafficData.reduce((sum, d) => sum + d.packetsPerMinute, 0) / trafficData.length
  );
  const avgBandwidth = Math.floor(
    trafficData.reduce((sum, d) => sum + d.bandwidth, 0) / trafficData.length
  );
  const avgConnections = Math.floor(
    trafficData.reduce((sum, d) => sum + d.connections, 0) / trafficData.length
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Traffic Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Network traffic patterns and metrics</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('hour')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              timeRange === 'hour'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Last Hour
          </button>
          <button
            onClick={() => setTimeRange('day')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              timeRange === 'day'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Last Day
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              timeRange === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Last Week
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Avg Packets/Min</h3>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">{avgPackets.toLocaleString()}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-6 border border-green-200 dark:border-green-800">
          <h3 className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">Avg Bandwidth</h3>
          <p className="text-3xl font-bold text-green-900 dark:text-green-300">{avgBandwidth} Mbps</p>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
          <h3 className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">Avg Connections</h3>
          <p className="text-3xl font-bold text-purple-900 dark:text-purple-300">{avgConnections}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrafficChart data={trafficData} title="Packets Per Minute" dataKey="packetsPerMinute" />
        <TrafficChart data={trafficData} title="Bandwidth Usage" dataKey="bandwidth" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connection Spikes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={connectionSpikeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
              <XAxis
                dataKey="time"
                className="text-gray-600 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis className="text-gray-600 dark:text-gray-400" tick={{ fill: 'currentColor' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ccc',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="connections" name="Connections" fill="#8b5cf6" />
              <Bar dataKey="packets" name="Packets (x100)" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <ProtocolPieChart data={mockProtocolData} />
      </div>
    </div>
  );
};

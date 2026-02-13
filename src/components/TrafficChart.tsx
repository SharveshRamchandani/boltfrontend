import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrafficData } from '../services/mockData';
import { format } from 'date-fns';

interface TrafficChartProps {
  data: TrafficData[];
  title?: string;
  dataKey?: 'packetsPerMinute' | 'bandwidth' | 'connections';
}

export const TrafficChart = ({ data, title = 'Real-Time Traffic Monitor', dataKey = 'packetsPerMinute' }: TrafficChartProps) => {
  const chartData = data.map(item => ({
    time: format(item.timestamp, 'HH:mm'),
    value: item[dataKey]
  }));

  const getLabel = () => {
    switch (dataKey) {
      case 'bandwidth':
        return 'Bandwidth (Mbps)';
      case 'connections':
        return 'Active Connections';
      default:
        return 'Packets/Min';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
          <XAxis
            dataKey="time"
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          <YAxis
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name={getLabel()}
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

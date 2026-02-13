import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ProtocolData } from '../services/mockData';

interface ProtocolPieChartProps {
  data: ProtocolData[];
  title?: string;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

export const ProtocolPieChart = ({ data, title = 'Protocol Distribution' }: ProtocolPieChartProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ protocol, percentage }) => `${protocol}: ${percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="percentage"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {data.map((protocol, index) => (
          <div key={protocol.protocol} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {protocol.protocol}: <span className="font-semibold">{protocol.count}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

import { Alert } from '../services/mockData';
import { AlertTriangle, Shield, AlertOctagon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AlertFeedProps {
  alerts: Alert[];
  maxItems?: number;
  showSearch?: boolean;
}

export const AlertFeed = ({ alerts, maxItems = 10, showSearch = false }: AlertFeedProps) => {
  const displayAlerts = alerts.slice(0, maxItems);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          border: 'border-red-300 dark:border-red-700',
          text: 'text-red-700 dark:text-red-400',
          icon: AlertOctagon
        };
      case 'medium':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/30',
          border: 'border-orange-300 dark:border-orange-700',
          text: 'text-orange-700 dark:text-orange-400',
          icon: AlertTriangle
        };
      default:
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          border: 'border-yellow-300 dark:border-yellow-700',
          text: 'text-yellow-700 dark:text-yellow-400',
          icon: Shield
        };
    }
  };

  return (
    <div className="space-y-3">
      {displayAlerts.map((alert) => {
        const style = getSeverityStyle(alert.severity);
        const Icon = style.icon;

        return (
          <div
            key={alert.id}
            className={`${style.bg} ${style.border} border rounded-xl p-4 transition-all hover:shadow-md`}
          >
            <div className="flex items-start gap-3">
              <div className={`${style.text} mt-1`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className={`font-semibold ${style.text}`}>{alert.attackType}</h4>
                  <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <span className="font-medium">{alert.deviceName}</span> - {alert.description}
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <span className={`font-semibold ${style.text}`}>
                    Score: {alert.anomalyScore}
                  </span>
                  <span className={`px-2 py-1 rounded-full ${style.bg} ${style.text} font-medium uppercase`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

import { useEffect, useState } from 'react';
import { StatCard } from '../components/StatCard';
import { RiskGauge } from '../components/RiskGauge';
import { AlertFeed } from '../components/AlertFeed';
import { TrafficChart } from '../components/TrafficChart';
import { SimulationControlPanel } from '../components/SimulationControlPanel';
import { Monitor, Wifi, AlertTriangle, Shield } from 'lucide-react';
import {
  mockDevices,
  mockAlerts,
  mockTrafficData,
  TrafficData,
  Alert
} from '../services/mockData';
import { simulationService } from '../services/simulationService';
import { Toast } from '../components/Toast';

export const Dashboard = () => {
  const [trafficData, setTrafficData] = useState<TrafficData[]>(mockTrafficData);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [recentToasts, setRecentToasts] = useState<Alert[]>([]);

  useEffect(() => {
    simulationService.start();

    const unsubscribe = simulationService.subscribe((data) => {
      setTrafficData((prev) => {
        const newData = [...prev.slice(-59), data.traffic];
        return newData;
      });

      if (data.alerts) {
        setAlerts((prev) => [...data.alerts!, ...prev]);
        setRecentToasts((prev) => [...prev, ...data.alerts!]);

        setTimeout(() => {
          setRecentToasts((prev) => prev.filter(a => !data.alerts!.includes(a)));
        }, 5000);
      }
    });

    return () => {
      unsubscribe();
      simulationService.stop();
    };
  }, []);

  const activeDevices = mockDevices.filter(d => d.status !== 'critical').length;
  const todayAlerts = alerts.filter(a => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return a.timestamp >= today;
  }).length;

  const riskScore = Math.floor(
    (alerts.filter(a => a.severity === 'high').length / alerts.length) * 100
  );

  return (
    <div className="space-y-6">
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {recentToasts.slice(-3).map((alert) => (
          <Toast
            key={alert.id}
            alert={alert}
            onClose={() => setRecentToasts(prev => prev.filter(a => a.id !== alert.id))}
          />
        ))}
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Real-time monitoring and threat detection</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Devices"
          value={mockDevices.length}
          icon={Monitor}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Active Devices"
          value={activeDevices}
          icon={Wifi}
        />
        <StatCard
          title="Alerts Today"
          value={todayAlerts}
          icon={AlertTriangle}
          trend={{ value: 12, isPositive: false }}
        />
        <StatCard
          title="Network Risk"
          value={`${riskScore}%`}
          icon={Shield}
        />
      </div>

      <SimulationControlPanel />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrafficChart data={trafficData} title="Real-Time Network Traffic" />
        </div>
        <div>
          <RiskGauge score={riskScore} />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Alerts</h3>
        <AlertFeed alerts={alerts} maxItems={5} />
      </div>
    </div>
  );
};

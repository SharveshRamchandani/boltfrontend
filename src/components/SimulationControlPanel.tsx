import { Play, Zap, Scan, Bot } from 'lucide-react';
import { simulationService, SimulationType } from '../services/simulationService';
import { useState } from 'react';

export const SimulationControlPanel = () => {
  const [activeSimulation, setActiveSimulation] = useState<SimulationType | null>(null);

  const handleSimulation = (type: SimulationType) => {
    setActiveSimulation(type);
    simulationService.simulateAttack(type);

    setTimeout(() => {
      setActiveSimulation(null);
    }, 15000);
  };

  const buttons = [
    { type: 'normal' as SimulationType, label: 'Normal Traffic', icon: Play, color: 'bg-green-600 hover:bg-green-700' },
    { type: 'attack' as SimulationType, label: 'Attack Burst', icon: Zap, color: 'bg-red-600 hover:bg-red-700' },
    { type: 'port-scan' as SimulationType, label: 'Port Scan', icon: Scan, color: 'bg-orange-600 hover:bg-orange-700' },
    { type: 'bot' as SimulationType, label: 'Bot Activity', icon: Bot, color: 'bg-purple-600 hover:bg-purple-700' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Simulation Controls</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {buttons.map((button) => {
          const Icon = button.icon;
          const isActive = activeSimulation === button.type;

          return (
            <button
              key={button.type}
              onClick={() => handleSimulation(button.type)}
              disabled={activeSimulation !== null}
              className={`${button.color} text-white px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isActive ? 'ring-4 ring-blue-300 dark:ring-blue-700' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:inline">{button.label}</span>
            </button>
          );
        })}
      </div>
      {activeSimulation && (
        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
            Simulation active - traffic patterns will return to normal in 15 seconds
          </p>
        </div>
      )}
    </div>
  );
};

import { Device, Alert, TrafficData, generateAlerts, mockDevices } from './mockData';

export type SimulationType = 'normal' | 'attack' | 'port-scan' | 'bot';

class SimulationService {
  private listeners: ((data: { traffic: TrafficData; alerts?: Alert[] }) => void)[] = [];
  private interval: number | null = null;
  private currentMode: SimulationType = 'normal';

  subscribe(callback: (data: { traffic: TrafficData; alerts?: Alert[] }) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notify(data: { traffic: TrafficData; alerts?: Alert[] }) {
    this.listeners.forEach(cb => cb(data));
  }

  start() {
    if (this.interval) return;

    this.interval = window.setInterval(() => {
      const traffic = this.generateTrafficPoint();
      const alerts = Math.random() > 0.7 ? this.generateAlert() : undefined;
      this.notify({ traffic, alerts });
    }, 3000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  setMode(mode: SimulationType) {
    this.currentMode = mode;
  }

  private generateTrafficPoint(): TrafficData {
    const basePackets = 3500;
    const baseBandwidth = 35;
    const baseConnections = 75;

    let multiplier = 1;
    let noise = 0.2;

    switch (this.currentMode) {
      case 'attack':
        multiplier = 3;
        noise = 0.5;
        break;
      case 'port-scan':
        multiplier = 2;
        noise = 0.3;
        break;
      case 'bot':
        multiplier = 1.5;
        noise = 0.4;
        break;
    }

    return {
      timestamp: new Date(),
      packetsPerMinute: Math.floor(basePackets * multiplier * (1 + (Math.random() - 0.5) * noise)),
      bandwidth: Math.floor(baseBandwidth * multiplier * (1 + (Math.random() - 0.5) * noise)),
      connections: Math.floor(baseConnections * multiplier * (1 + (Math.random() - 0.5) * noise))
    };
  }

  private generateAlert(): Alert[] {
    const device = mockDevices[Math.floor(Math.random() * mockDevices.length)];
    const attackTypes = ['Port Scan', 'DDoS Attack', 'Unauthorized Access', 'Brute Force'];
    const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)];

    const severity = this.currentMode === 'normal' ? 'low' :
                     this.currentMode === 'attack' ? 'high' : 'medium';

    return [{
      id: `alert-${Date.now()}`,
      timestamp: new Date(),
      deviceId: device.id,
      deviceName: device.name,
      severity: severity as 'low' | 'medium' | 'high',
      anomalyScore: severity === 'high' ? Math.floor(Math.random() * 20) + 80 :
                    severity === 'medium' ? Math.floor(Math.random() * 30) + 50 :
                    Math.floor(Math.random() * 30) + 20,
      attackType,
      description: `${attackType} detected from ${device.ipAddress}. Unusual traffic pattern observed.`
    }];
  }

  simulateAttack(type: SimulationType) {
    this.setMode(type);

    setTimeout(() => {
      this.setMode('normal');
    }, 15000);
  }
}

export const simulationService = new SimulationService();

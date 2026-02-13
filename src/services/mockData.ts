export interface Device {
  id: string;
  name: string;
  type: string;
  ipAddress: string;
  status: 'safe' | 'suspicious' | 'critical';
  behaviorScore: number;
  lastSeen: Date;
  macAddress: string;
}

export interface Alert {
  id: string;
  timestamp: Date;
  deviceId: string;
  deviceName: string;
  severity: 'low' | 'medium' | 'high';
  anomalyScore: number;
  attackType: string;
  description: string;
}

export interface TrafficData {
  timestamp: Date;
  packetsPerMinute: number;
  bandwidth: number;
  connections: number;
}

export interface ProtocolData {
  protocol: string;
  percentage: number;
  count: number;
}

const deviceTypes = ['Smart TV', 'Security Camera', 'Smart Lock', 'Thermostat', 'Smart Speaker', 'Light Bulb', 'Door Sensor', 'Motion Detector', 'Smart Plug'];
const attackTypes = ['Port Scan', 'DDoS Attack', 'Unauthorized Access', 'Data Exfiltration', 'Brute Force', 'Man-in-the-Middle', 'Malware Activity', 'DNS Tunneling'];

export const generateDevices = (count: number = 15): Device[] => {
  const devices: Device[] = [];
  for (let i = 0; i < count; i++) {
    const status = Math.random() > 0.85 ? 'suspicious' : Math.random() > 0.95 ? 'critical' : 'safe';
    devices.push({
      id: `device-${i + 1}`,
      name: `${deviceTypes[i % deviceTypes.length]} ${Math.floor(i / deviceTypes.length) + 1}`,
      type: deviceTypes[i % deviceTypes.length],
      ipAddress: `192.168.1.${10 + i}`,
      status,
      behaviorScore: status === 'critical' ? Math.floor(Math.random() * 20) + 80 :
                     status === 'suspicious' ? Math.floor(Math.random() * 30) + 50 :
                     Math.floor(Math.random() * 40) + 10,
      lastSeen: new Date(Date.now() - Math.random() * 3600000),
      macAddress: `AA:BB:CC:DD:EE:${i.toString(16).padStart(2, '0').toUpperCase()}`
    });
  }
  return devices;
};

export const generateAlerts = (devices: Device[], count: number = 50): Alert[] => {
  const alerts: Alert[] = [];
  for (let i = 0; i < count; i++) {
    const device = devices[Math.floor(Math.random() * devices.length)];
    const severity = Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low';
    const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)];

    alerts.push({
      id: `alert-${i + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000),
      deviceId: device.id,
      deviceName: device.name,
      severity,
      anomalyScore: severity === 'high' ? Math.floor(Math.random() * 20) + 80 :
                    severity === 'medium' ? Math.floor(Math.random() * 30) + 50 :
                    Math.floor(Math.random() * 30) + 20,
      attackType,
      description: `${attackType} detected from ${device.ipAddress}. Unusual traffic pattern observed.`
    });
  }
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const generateTrafficData = (points: number = 60): TrafficData[] => {
  const data: TrafficData[] = [];
  const now = Date.now();

  for (let i = points - 1; i >= 0; i--) {
    data.push({
      timestamp: new Date(now - i * 60000),
      packetsPerMinute: Math.floor(Math.random() * 5000) + 3000,
      bandwidth: Math.floor(Math.random() * 50) + 20,
      connections: Math.floor(Math.random() * 100) + 50
    });
  }
  return data;
};

export const generateProtocolData = (): ProtocolData[] => {
  return [
    { protocol: 'HTTP', percentage: 35, count: 3500 },
    { protocol: 'HTTPS', percentage: 30, count: 3000 },
    { protocol: 'MQTT', percentage: 15, count: 1500 },
    { protocol: 'CoAP', percentage: 10, count: 1000 },
    { protocol: 'DNS', percentage: 7, count: 700 },
    { protocol: 'Other', percentage: 3, count: 300 }
  ];
};

export const mockDevices = generateDevices();
export const mockAlerts = generateAlerts(mockDevices);
export const mockTrafficData = generateTrafficData();
export const mockProtocolData = generateProtocolData();

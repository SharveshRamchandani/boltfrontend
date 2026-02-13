import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { DeviceMonitor } from './pages/DeviceMonitor';
import { AlertsPage } from './pages/Alerts';
import { TrafficAnalytics } from './pages/TrafficAnalytics';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/devices" element={<DeviceMonitor />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/analytics" element={<TrafficAnalytics />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

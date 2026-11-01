import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { FloodMapPage } from './pages/FloodMapPage';
import { SimulationPage } from './pages/SimulationPage';
import { ScenarioComparisonPage } from './pages/ScenarioComparisonPage';
import { RiskAssessmentPage } from './pages/RiskAssessmentPage';
import { InfrastructurePage } from './pages/InfrastructurePage';
import { EvacuationPage } from './pages/EvacuationPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="map" element={<FloodMapPage />} />
          <Route path="simulation" element={<SimulationPage />} />
          <Route path="scenarios" element={<ScenarioComparisonPage />} />
          <Route path="risk" element={<RiskAssessmentPage />} />
          <Route path="infrastructure" element={<InfrastructurePage />} />
          <Route path="evacuation" element={<EvacuationPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="data-sources" element={<DataSourcesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

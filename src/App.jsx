import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/shared/Sidebar";

import DashboardPage from "./pages/DashboardPage";
import ShipsPage from "./pages/ShipsPage";
import UsersPage from "./pages/UsersPage";
import WeatherPage from "./pages/WeatherPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Background with blur */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        <main className="flex-1 relative overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/ships" element={<ShipsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

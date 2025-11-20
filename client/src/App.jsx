import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { MiniaturasBasePage } from './pages/MiniaturasBasePage';
import { USAStockPage } from './pages/USAStockPage';
import { ReadyStockPage } from './pages/ReadyStockPage';
import './index.css';

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/miniaturas-base"
          element={
            <PrivateRoute>
              <MiniaturasBasePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/usa-stock"
          element={
            <PrivateRoute>
              <USAStockPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/ready-stock"
          element={
            <PrivateRoute>
              <ReadyStockPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

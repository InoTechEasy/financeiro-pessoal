import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/Comum/ErrorBoundary';
import { Header } from './components/Comum/Header';
import { Sidebar } from './components/Comum/Sidebar';
import { Footer } from './components/Comum/Footer';
import { Loading } from './components/Comum/Loading';
import { useAuth } from './hooks/useAuth';
import { Financeiro } from './pages/Financeiro';
import { Gestao } from './pages/Gestao';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen">
                  <Sidebar />
                  <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-1 bg-gray-100">
                      <Routes>
                        <Route path="/financeiro" element={<Financeiro />} />
                        <Route path="/gestao" element={<Gestao />} />
                        <Route path="/" element={<Navigate to="/financeiro" replace />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;

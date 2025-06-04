import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ApplicationsProvider } from "./contexts/ApplicationsContext";
import { RestaurantProvider } from "./contexts/RestaurantContext";
import { SalesProvider } from "./contexts/SalesContext";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ProfilePage } from "./pages/ProfilePage";
import RestaurantProfile from "./pages/RestaurantProfile";
import { SalesModule } from "./pages/SalesModule";
import { SalesRegister } from "./pages/SalesRegister";
import { SaiposImport } from "./pages/SaiposImport";
import { FinancialModule } from "./pages/FinancialModule";
import { BenchmarkingModule } from "./pages/BenchmarkingModule";
import { SuppliersModule } from "./pages/SuppliersModule";
import { JobsModule } from "./pages/JobsModule";
import { SupplierDashboard } from "./pages/SupplierDashboard";
import { SupplierProfile } from "./pages/SupplierProfile";
import { SupplierCatalog } from "./pages/SupplierCatalog";
import { SupplierRestaurants } from "./pages/SupplierRestaurants";
import { SubscriptionPlans } from "./pages/SubscriptionPlans";
import { JobSeekerDashboard } from "./pages/JobSeekerDashboard";
import { AvailabilityPage } from "./pages/AvailabilityPage";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { NotFound } from "./pages/NotFound";
import { AdminPanel } from "./pages/AdminPanel";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ApplicationsProvider>
        <RestaurantProvider>
          <SalesProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminPanel />} />

                {/* Rotas para Restaurantes */}
                <Route
                  path="/"
                  element={
                    <PrivateRoute userType="restaurant">
                      <Layout />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="profile" element={<RestaurantProfile />} />
                  <Route path="sales" element={<SalesModule />} />
                  <Route path="sales/register" element={<SalesRegister />} />
                  <Route
                    path="sales/import-saipos"
                    element={<SaiposImport />}
                  />
                  <Route path="financial" element={<FinancialModule />} />
                  <Route path="benchmarking" element={<BenchmarkingModule />} />
                  <Route path="suppliers" element={<SuppliersModule />} />
                  <Route path="jobs" element={<JobsModule />} />
                </Route>

                {/* Rotas para Fornecedores */}
                <Route
                  path="/supplier"
                  element={
                    <PrivateRoute userType="supplier">
                      <Layout />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<SupplierDashboard />} />
                  <Route path="profile" element={<SupplierProfile />} />
                  <Route path="catalog" element={<SupplierCatalog />} />
                  <Route path="restaurants" element={<SupplierRestaurants />} />
                  <Route path="plans" element={<SubscriptionPlans />} />
                </Route>

                {/* Rotas para Candidatos */}
                <Route
                  path="/jobseeker"
                  element={
                    <PrivateRoute userType="jobseeker">
                      <Layout />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<JobSeekerDashboard />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="availability" element={<AvailabilityPage />} />
                  <Route path="jobs" element={<JobsModule />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </SalesProvider>
        </RestaurantProvider>
      </ApplicationsProvider>
    </AuthProvider>
  );
}

export default App;

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { authService } from "../services/authService";

// Layout elements
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { Footer } from "../components/layout/Footer";

// Auth Pages
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { ForgotPassword } from "../pages/auth/ForgotPassword";

// Main Flow Pages (Layers 1–4)
import { Dashboard } from "../pages/dashboard/Dashboard";
import { InventionInput } from "../pages/invention/InventionInput";
import { PatentSearch } from "../pages/search/PatentSearch";
import { SearchHistory } from "../pages/search/SearchHistory";
import { SavedPatents } from "../pages/patents/SavedPatents";
import { PatentDetails } from "../pages/patents/PatentDetails";
import { PatentTrends } from "../pages/trends/PatentTrends";
import { ResearchWorkspace } from "../pages/workspace/ResearchWorkspace";
import { UserProfile } from "../pages/profile/UserProfile";
import { Settings } from "../pages/profile/Settings";

// Admin Pages (Layer 5 — Modules 18–22)
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { UserManagement } from "../pages/admin/UserManagement";

/**
 * Admin guard — redirect non-admins to dashboard
 */
function AdminGuard({ element }) {
  const currentUser = authService.getCurrentUser();
  if (!currentUser || currentUser.role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return element;
}

/**
 * Protected layout — requires valid session
 */
function ProtectedLayout() {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to={currentUser?.role === "Admin" ? "/admin" : "/dashboard"} replace />} />

            {/* === Layer 1: User === */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />

            {/* === Layer 2: Invention Input === */}
            <Route path="/invention" element={<InventionInput />} />

            {/* === Layer 3: AI Search === */}
            <Route path="/search" element={<PatentSearch />} />
            <Route path="/history" element={<SearchHistory />} />
            <Route path="/workspace" element={<ResearchWorkspace />} />

            {/* === Layer 4: Results & Analysis === */}
            <Route path="/saved" element={<SavedPatents />} />
            <Route path="/patents/details" element={<PatentDetails />} />
            <Route path="/trends" element={<PatentTrends />} />

            {/* === Layer 5: Admin === */}
            <Route path="/admin" element={<AdminGuard element={<AdminDashboard />} />} />
            <Route path="/admin/users" element={<AdminGuard element={<UserManagement />} />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to={currentUser?.role === "Admin" ? "/admin" : "/dashboard"} replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Layout */}
      <Route path="*" element={<ProtectedLayout />} />
    </Routes>
  );
}

export default AppRoutes;

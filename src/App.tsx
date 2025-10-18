import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Properties from "@/pages/Properties";
import PropertyPublicDetails from "@/pages/PropertyPublicDetails";
import Dashboard from "@/pages/Dashboard";
import MyProperties from "@/pages/MyProperties";
import PropertyForm from "@/pages/PropertyForm";
import PropertyDetails from "@/pages/PropertyDetails";
import Favorites from "@/pages/Favorites";
import Viewings from "@/pages/Viewings";
import NewBuildings from "@/pages/NewBuildings";
import Docs from "@/pages/Docs";
import Admin from "@/pages/Admin";
import Audit from "@/pages/Audit";
import ReferenceDataManager from "@/pages/ReferenceDataManager";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id/public" element={<PropertyPublicDetails />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-properties" element={<MyProperties />} />
              <Route path="/properties/new" element={<PropertyForm />} />
              <Route path="/properties/:id/edit" element={<PropertyForm />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/viewings" element={<Viewings />} />
              <Route path="/new-buildings" element={<NewBuildings />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/reference-data" element={<ReferenceDataManager />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

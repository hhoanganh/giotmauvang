

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Centers from "./pages/Centers";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Faq from "./pages/Faq";
import News from "./pages/News";
import Gallery from "./pages/Gallery";
import GalleryGroup from "./pages/GalleryGroup";
import NewsDetail from "./pages/NewsDetail";
import AdminNews from "./pages/AdminNews";
import Donate from "./pages/Donate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<Events />} />
            <Route path="/centers" element={<Centers />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:groupId" element={<GalleryGroup />} />
            <Route 
              path="/admin/news" 
              element={
                <ProtectedRoute requiredRole="system_admin">
                  <AdminNews />
                </ProtectedRoute>
              } 
            />
            {/* 
              ADMIN ROUTES PATTERN:
              All admin routes should use ProtectedRoute with requiredRole="system_admin"
              This ensures proper authentication and authorization before rendering admin components.
              
              Example for future admin routes:
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requiredRole="system_admin">
                    <AdminUsers />
                  </ProtectedRoute>
                } 
              />
            */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

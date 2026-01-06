import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "@/contexts/SocketContext";
import { AppLayout } from "@/components/layout/AppLayout";
import ConnectPage from "./pages/ConnectPage";
import ChatPage from "./pages/ChatPage";
import AccountsPage from "./pages/AccountsPage";
import ProxiesPage from "./pages/ProxiesPage";
import MovementPage from "./pages/MovementPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SocketProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<ConnectPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/proxies" element={<ProxiesPage />} />
              <Route path="/movement" element={<MovementPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </SocketProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

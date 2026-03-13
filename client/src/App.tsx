import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { isAuthEnabled } from "./lib/auth";
import Home from "./pages/Home";
import Login from "./pages/Login";

// 与 Vite base 一致，用于 GitHub Pages 子路径 /xuncha-manual/
const basePath = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "") || "/";

function Routes() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/chapter/:id"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (!isAuthEnabled()) {
    return <>{children}</>;
  }
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.965 0.004 80)" }}
      >
        <p style={{ color: "oklch(0.5 0.015 250)", fontFamily: "'Noto Sans SC', sans-serif" }}>
          加载中…
        </p>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Login />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router base={basePath}>
              <AuthGuard>
                <Routes />
              </AuthGuard>
            </Router>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import SharedNav from "@/components/SharedNav";
import SharedFooter from "@/components/SharedFooter";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import BrandKit from "./pages/BrandKit";
import Session from "./pages/Session";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import OnboardingProfile from "./pages/OnboardingProfile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProfileGuard } from "./components/ProfileGuard";
import Dashboard from "./pages/Dashboard";
import CreateRoom from "./pages/CreateRoom";
import RoomView from "./pages/RoomView";
import { AppLayout } from "./components/AppLayout";
import Rights from "./pages/Rights";
import InvestorBrief from "./pages/InvestorBrief";
import Rooms from "./pages/Rooms";
import Profile from "./pages/Profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/discover" component={Discover} />
      <Route path="/session" component={Session} />
      <Route path="/brand" component={BrandKit} />
      <Route path="/rooms" component={Rooms} />
      <Route path="/rights" component={Rights} />
      <Route path="/investor" component={InvestorBrief} />
      <Route path="/u/:handle" component={Profile} />
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={Login} />
      <Route path="/onboarding/profile">
        <ProtectedRoute>
          <ProfileGuard requireProfile={false}>
            <OnboardingProfile />
          </ProfileGuard>
        </ProtectedRoute>
      </Route>
      <Route path="/app">
        <ProtectedRoute>
          <ProfileGuard requireProfile={true}>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProfileGuard>
        </ProtectedRoute>
      </Route>
      <Route path="/app/rooms/create">
        <ProtectedRoute>
          <ProfileGuard requireProfile={true}>
            <AppLayout>
              <CreateRoom />
            </AppLayout>
          </ProfileGuard>
        </ProtectedRoute>
      </Route>
      <Route path="/app/rooms/:id">
        <ProtectedRoute>
          <ProfileGuard requireProfile={true}>
            <AppLayout>
              <RoomView />
            </AppLayout>
          </ProfileGuard>
        </ProtectedRoute>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  // Investor Brief is a standalone document — no shared nav or footer
  const isStandalonePage = location === "/investor";

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          {!isStandalonePage && <SharedNav />}
          <Router />
          {!isStandalonePage && <SharedFooter />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

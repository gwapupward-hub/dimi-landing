import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import SharedNav from "@/components/SharedNav";
import SharedFooter from "@/components/SharedFooter";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import BrandKit from "./pages/BrandKit";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/discover"} component={Discover} />
      <Route path={"/brand"} component={BrandKit} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <SharedNav />
          <Router />
          <SharedFooter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

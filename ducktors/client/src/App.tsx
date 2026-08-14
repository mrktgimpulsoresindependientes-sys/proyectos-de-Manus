import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Assistant from "./pages/Assistant";
import Booking from "./pages/Booking";
import Directory from "./pages/Directory";
import ExpertQuestions from "./pages/ExpertQuestions";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import Professionals from "./pages/Professionals";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import { Route, Switch } from "wouter";
function Router() { return <Switch><Route path="/" component={Home} /><Route path="/directorio" component={Directory} /><Route path="/pregunta-al-experto" component={ExpertQuestions} /><Route path="/profesionales" component={Professionals} /><Route path="/agenda-profesional" component={ProfessionalDashboard} /><Route path="/asistente" component={Assistant} /><Route path="/profesional/:slug/reservar" component={Booking} /><Route path="/profesional/:slug" component={ProfessionalProfile} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }

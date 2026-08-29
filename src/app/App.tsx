import { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Operations } from './components/Operations';
import { Clients } from './components/Clients';
import { ClientDetail } from './components/ClientDetail';
import { Technicians } from './components/Technicians';
import { Equipment } from './components/Equipment';
import { Reports } from './components/Reports';
import { AssignTechnician } from './components/AssignTechnician';
import { Budgets } from './components/Budgets';
import { ServiceOrders } from './components/ServiceOrders';
import { Projects } from './components/Projects';
import { TechnicianSchedule } from './components/TechnicianSchedule';
import { TechnicianTracking } from './components/TechnicianTracking';
import { BudgetSimulator } from './components/BudgetSimulator';
import { MaintenanceDetail } from './components/MaintenanceDetail';
import { Settings } from './components/Settings';
import { Toaster } from './components/ui/sonner';
import { MobileApp, type User as MobileUser } from './components/mobile/MobileApp';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Package, 
  FileText, 
  Menu,
  X,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  ChevronRight,
  Calendar,
  DollarSign,
  Database,
  Briefcase
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';

type View = 'dashboard' | 'operations' | 'clients' | 'client-detail' | 'technicians' | 'equipment' | 'reports' | 'assign-technician' | 'budgets' | 'service-orders' | 'projects' | 'settings' | 'technician-schedule' | 'technician-tracking' | 'budget-simulator' | 'maintenance-detail';

interface Crumb {
  label: string;
  view: View;
}

const MOBILE_PREVIEW_USERS: Record<'client' | 'technician', MobileUser> = {
  client: {
    id: 'client-1',
    name: 'Juan Martínez',
    email: 'juan.martinez@empresa.com',
    role: 'client',
    company: 'Empresa XYZ S.A.S',
    avatar: 'JM',
  },
  technician: {
    id: 'tech-1',
    name: 'Carlos Ramírez',
    email: 'carlos.ramirez@ingelectri.com',
    role: 'technician',
    avatar: 'CR',
  },
};

function App() {
  const previewParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isMobilePreview = previewParams?.get('mobilePreview') === '1';
  const previewRole = previewParams?.get('role');
  const previewUser =
    previewRole === 'client' || previewRole === 'technician' ? MOBILE_PREVIEW_USERS[previewRole] : undefined;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([{ label: 'Dashboard', view: 'dashboard' }]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState<string>('');

  // Documento embebido en el PhoneFrame del login (?mobilePreview=1&role=client|technician):
  // solo la app móvil, sin el shell de escritorio. El rol ya se elige antes de abrir el celular.
  if (isMobilePreview) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-muted">
        <MobileApp initialUser={previewUser} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const navigation = [
    { id: 'dashboard' as View, name: 'Dashboard', icon: LayoutDashboard },
    { id: 'operations' as View, name: 'Operaciones', icon: Calendar, badge: 8 },
    { id: 'projects' as View, name: 'Proyectos', icon: Briefcase, badge: 12 },
    { id: 'service-orders' as View, name: 'Órdenes Servicio', icon: FileText, badge: 24 },
    { id: 'clients' as View, name: 'Clientes', icon: Users },
    { id: 'equipment' as View, name: 'Equipos', icon: Package },
    { id: 'technicians' as View, name: 'Técnicos', icon: Wrench },
    { id: 'budgets' as View, name: 'Presupuestos', icon: DollarSign, badge: 2 },
    { id: 'reports' as View, name: 'Reportes', icon: Database },
  ];

  const rootViewIds = navigation.map((item) => item.id);

  const navigateTo = (view: View, label?: string, clientId?: string, maintenanceId?: string) => {
    setCurrentView(view);
    if (clientId) setSelectedClientId(clientId);
    if (maintenanceId) setSelectedMaintenanceId(maintenanceId);
    if (!label) return;
    if (rootViewIds.includes(view)) {
      setBreadcrumbs([{ label, view }]);
    } else {
      setBreadcrumbs((prev) =>
        prev[prev.length - 1]?.label === label ? prev : [...prev, { label, view }]
      );
    }
  };

  const navigateToBreadcrumb = (index: number) => {
    const crumb = breadcrumbs[index];
    if (!crumb) return;
    setCurrentView(crumb.view);
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'operations':
        return <Operations />;
      case 'projects':
        return <Projects />;
      case 'service-orders':
        return <ServiceOrders onViewMaintenance={(id) => navigateTo('maintenance-detail', 'Detalle de Trabajo', undefined, id)} />;
      case 'clients':
        return <Clients onViewClient={(id, name) => navigateTo('client-detail', name, id)} />;
      case 'client-detail':
        return (
          <ClientDetail 
            clientId={selectedClientId} 
            onBack={() => navigateTo('clients', 'Clientes')}
            onAssignTechnician={(equipmentId) => navigateTo('assign-technician', 'Asignar Técnico')}
          />
        );
      case 'technicians':
        return (
          <Technicians 
            onViewSchedule={() => navigateTo('technician-schedule', 'Agenda de Técnicos')}
            onViewTracking={() => navigateTo('technician-tracking', 'Rastreo de Técnicos')}
          />
        );
      case 'technician-schedule':
        return <TechnicianSchedule />;
      case 'technician-tracking':
        return <TechnicianTracking />;
      case 'equipment':
        return <Equipment onAssignTechnician={(id) => navigateTo('assign-technician', 'Asignar Técnico')} />;
      case 'reports':
        return <Reports />;
      case 'assign-technician':
        return <AssignTechnician onBack={() => navigateTo('equipment', 'Equipos')} />;
      case 'budgets':
        return <Budgets onSimulate={() => navigateTo('budget-simulator', 'Simulador de Presupuestos')} />;
      case 'budget-simulator':
        return <BudgetSimulator />;
      case 'maintenance-detail':
        return <MaintenanceDetail maintenanceId={selectedMaintenanceId} onBack={() => navigateTo('service-orders', 'Órdenes de Servicio')} />;
      case 'settings':
        return <Settings onLogout={() => setIsAuthenticated(false)} />;
      default:
        return <Dashboard onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-72 backdrop-blur-xl bg-sidebar/95 text-sidebar-foreground transition-transform border-r border-sidebar-border ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 shadow-2xl`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-brand flex items-center justify-center shadow-lg">
                    <Wrench className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-sidebar-foreground">
                      Ingelectri
                    </h1>
                    <p className="text-xs text-sidebar-foreground/50">A&E S.A.S.</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Cerrar menú"
                className="lg:hidden text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id, item.name)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all relative ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <Badge className={`h-5 w-5 flex items-center justify-center p-0 text-xs ${
                      isActive ? 'bg-white/20 text-white' : 'bg-sidebar-accent text-sidebar-foreground/70'
                    }`}>
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4 space-y-1">
            <button
              onClick={() => navigateTo('settings', 'Configuración')}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
            >
              <SettingsIcon className="h-5 w-5" />
              Configuración
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
            >
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
            <div className="pt-3 text-center text-xs text-sidebar-foreground/40">
              © 2026 Ingelectri A&E S.A.S.
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-card/80 border-b border-border shadow-sm">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir menú"
                className="lg:hidden hover:bg-muted"
              >
                <Menu className="h-6 w-6" />
              </Button>

              {/* Breadcrumbs */}
              <nav className="flex items-center gap-1.5 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                    <button
                      onClick={() => navigateToBreadcrumb(index)}
                      className={`${
                        index === breadcrumbs.length - 1
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      } transition-colors`}
                      disabled={index === breadcrumbs.length - 1}
                    >
                      {crumb.label}
                    </button>
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" aria-label="Notificaciones: 3 sin leer" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4.5 w-4.5 flex items-center justify-center p-0 bg-danger text-white text-[10px]">
                  3
                </Badge>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger className="hidden md:flex items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">Admin Usuario</p>
                    <p className="text-xs text-muted-foreground">admin@ingelectri.com</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-brand flex items-center justify-center text-white font-bold shadow-lg">
                    AU
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-semibold text-foreground">Admin Usuario</p>
                    <p className="text-xs text-muted-foreground font-normal">admin@ingelectri.com</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigateTo('settings', 'Configuración')}>
                    <SettingsIcon className="h-4 w-4" />
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={() => setIsAuthenticated(false)}>
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
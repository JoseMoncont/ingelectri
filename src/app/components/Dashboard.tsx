import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Activity, Users, Wrench, Package, TrendingUp, AlertTriangle, CheckCircle2, Clock, DollarSign, MapPin, Radio } from 'lucide-react';
import { kpiData, recentMaintenances, monthlyStats, activeOrders, serviceLocations, pendingRequests } from '../data/mockData';
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ACCENT_STYLES, type AccentKey } from '../lib/accentColor';

interface DashboardProps {
  onNavigate: (view: string, label: string) => void;
}

// Posiciones aproximadas sobre el mapa de Cartagena (no georreferenciadas, solo visuales).
// Calibradas a mano sobre el recorte real del mapa embebido para caer sobre tierra firme
// (península de Cartagena, Turbaco, Villanueva) y no sobre la bahía ni los canales.
const MAP_MARKER_POSITIONS = [
  { top: '55%', left: '74%' }, // Torre Empresarial
  { top: '31%', left: '86%' }, // Hotel El Dorado
  { top: '28%', left: '41%' }, // CC Andino
  { top: '48%', left: '47%' }, // Plaza Mayor
  { top: '75%', left: '69%' }, // Hospital San Rafael
];

const CARTAGENA_MAP_EMBED_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=-75.5820%2C10.3300%2C-75.4000%2C10.4600&layer=mapnik';

export function Dashboard({ onNavigate }: DashboardProps) {
  const completionRate = ((kpiData.maintenancesCompleted / kpiData.maintenancesScheduled) * 100).toFixed(1);
  const technicianUtilization = ((kpiData.activeTechnicians / kpiData.totalTechnicians) * 100).toFixed(0);
  const monthlyRevenueGoal = 55000000;
  const revenueProgress = Math.min(100, (kpiData.monthlyRevenue / monthlyRevenueGoal) * 100);
  const urgentShare = ((kpiData.urgentAlerts / kpiData.maintenancesScheduled) * 100).toFixed(1);
  const approvalShare = ((kpiData.pendingApprovals / kpiData.maintenancesScheduled) * 100).toFixed(1);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyCompact = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'on-site': 'bg-steel',
      'scheduled': 'bg-muted-foreground',
      'in-progress': 'bg-warning',
      'urgent': 'bg-danger',
      'completed': 'bg-success',
    };
    return colors[status] || 'bg-muted-foreground';
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { color: string, label: string }> = {
      high: { color: 'bg-danger/10 text-danger border-danger/20', label: 'Alta' },
      medium: { color: 'bg-warning/10 text-warning border-warning/20', label: 'Media' },
      low: { color: 'bg-success/10 text-success border-success/20', label: 'Baja' },
    };
    const { color, label } = config[priority] || config.medium;
    return <Badge variant="outline" className={`${color} border`}>{label}</Badge>;
  };

  const kpiCards: {
    key: string;
    label: string;
    icon: typeof CheckCircle2;
    accent: AccentKey;
    value: string;
    subtitle: string;
    progress: number;
    caption: string;
    actionLabel: string;
    view: string;
    navLabel: string;
  }[] = [
    {
      key: 'completed',
      label: 'Completados',
      icon: CheckCircle2,
      accent: 'success',
      value: String(kpiData.maintenancesCompleted),
      subtitle: `de ${kpiData.maintenancesScheduled} programados`,
      progress: Number(completionRate),
      caption: `${completionRate}% cumplimiento`,
      actionLabel: 'Ver operaciones',
      view: 'operations',
      navLabel: 'Operaciones',
    },
    {
      key: 'revenue',
      label: 'Ingresos Mes',
      icon: DollarSign,
      accent: 'brand',
      value: formatCurrency(kpiData.monthlyRevenue),
      subtitle: '+12% vs mes anterior',
      progress: revenueProgress,
      caption: `${revenueProgress.toFixed(0)}% de la meta mensual`,
      actionLabel: 'Ver reportes',
      view: 'reports',
      navLabel: 'Reportes',
    },
    {
      key: 'technicians',
      label: 'Técnicos',
      icon: Wrench,
      accent: 'steel',
      value: String(kpiData.activeTechnicians),
      subtitle: `de ${kpiData.totalTechnicians} disponibles`,
      progress: Number(technicianUtilization),
      caption: `${technicianUtilization}% utilización`,
      actionLabel: 'Ver técnicos',
      view: 'technicians',
      navLabel: 'Técnicos',
    },
    {
      key: 'alerts',
      label: 'Alertas Urgentes',
      icon: AlertTriangle,
      accent: 'danger',
      value: String(kpiData.urgentAlerts),
      subtitle: `de ${kpiData.maintenancesScheduled} programados`,
      progress: Number(urgentShare),
      caption: `${urgentShare}% del total`,
      actionLabel: 'Ver alertas',
      view: 'operations',
      navLabel: 'Operaciones',
    },
    {
      key: 'approvals',
      label: 'Por Aprobar',
      icon: Clock,
      accent: 'warning',
      value: String(kpiData.pendingApprovals),
      subtitle: `de ${kpiData.maintenancesScheduled} programados`,
      progress: Number(approvalShare),
      caption: `${approvalShare}% del total`,
      actionLabel: 'Revisar',
      view: 'operations',
      navLabel: 'Operaciones',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Centro de Control Operativo
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <Radio className="h-3.5 w-3.5 text-success animate-pulse" />
            Sistema en vivo • {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* KPIs en Tiempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const styles = ACCENT_STYLES[card.accent];
          return (
            <Card key={card.key} className="shadow-sm">
              <CardHeader className="px-4 pt-4 pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                  <div className={`h-8 w-8 rounded-lg ${styles.iconBg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${styles.icon}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-2">
                <div className={`font-bold text-foreground ${card.key === 'revenue' ? 'text-xl' : 'text-2xl'}`}>
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                <Progress
                  value={card.progress}
                  className={`mt-2 h-1.5 ${styles.progressTrack}`}
                  indicatorClassName={styles.progressIndicator}
                />
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-muted-foreground">{card.caption}</p>
                  <button
                    onClick={() => onNavigate(card.view, card.navLabel)}
                    className={`text-xs font-medium ${styles.text} hover:underline`}
                  >
                    {card.actionLabel} →
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mapa de Calor y Órdenes Activas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Mapa de Calor */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="px-4 pt-4 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand" />
                  Mapa de Calor - Servicios Activos
                </CardTitle>
                <CardDescription className="text-xs">Cartagena de Indias • Distribución geográfica en tiempo real</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3">
            <div className="bg-muted rounded-xl h-[320px] relative overflow-hidden">
              <iframe
                src={CARTAGENA_MAP_EMBED_URL}
                className="absolute inset-0 h-full w-full border-0 pointer-events-none grayscale-[10%] opacity-90"
                loading="lazy"
                title="Mapa de servicios activos en Cartagena"
              />
              <div className="absolute inset-0 bg-background/5" />

              {serviceLocations.map((location, index) => (
                <div
                  key={index}
                  className="absolute animate-pulse"
                  style={MAP_MARKER_POSITIONS[index]}
                >
                  <div className={`h-4 w-4 rounded-full ${getStatusColor(location.status)} shadow-lg ring-2 ring-white`} />
                  <div className={`h-8 w-8 rounded-full ${getStatusColor(location.status)} opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping`} />
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-card px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
                    {location.name} ({location.count})
                  </div>
                </div>
              ))}

              <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <p className="text-xs font-semibold mb-2 text-foreground">Leyenda:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-steel" />
                    <span>En sitio</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-warning" />
                    <span>En progreso</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-danger" />
                    <span>Urgente</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    <span>Completado</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Órdenes Activas */}
        <Card className="shadow-sm">
          <CardHeader className="px-4 pt-4 pb-0">
            <CardTitle className="text-base font-semibold text-foreground">Órdenes Activas</CardTitle>
            <CardDescription className="text-xs">En tiempo real</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3 space-y-2.5">
            {activeOrders.map((order) => (
              <div key={order.id} className="border border-border rounded-lg p-2.5 hover:border-foreground/20 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{order.equipment}</p>
                    <p className="text-xs text-muted-foreground">{order.clientName}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      order.status === 'on-site' ? 'bg-steel/10 text-steel border-steel/20' :
                      order.status === 'in-progress' ? 'bg-warning/10 text-warning border-warning/20' :
                      'bg-muted text-muted-foreground border-transparent'
                    }
                  >
                    {order.status === 'on-site' ? 'En Sitio' :
                     order.status === 'in-progress' ? 'En Progreso' :
                     'Programado'}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Wrench className="h-3 w-3" />
                    {order.technician}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(order.scheduledTime).toLocaleString('es-CO', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                {order.progress > 0 && (
                  <div className="mt-2">
                    <Progress value={order.progress} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">{order.progress}% completado</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Urgencia */}
      <Card className="shadow-sm">
        <CardHeader className="px-4 pt-4 pb-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-danger" />
            <CardTitle className="text-base font-semibold text-foreground">Solicitudes Críticas Pendientes</CardTitle>
          </div>
          <CardDescription className="text-xs">Requieren atención inmediata</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex items-start justify-between gap-4 border border-border rounded-lg p-3 hover:border-foreground/20 transition-colors bg-card">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm text-foreground">{request.clientName}</h3>
                    {getPriorityBadge(request.priority)}
                  </div>
                  <p className="text-sm text-foreground/80">{request.equipmentType}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-2">{request.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {request.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(request.estimatedCost)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <Button size="sm" className="bg-success hover:bg-success/90 text-white">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    Aprobar
                  </Button>
                  <Button size="sm" variant="outline">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráficas de Tendencias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="px-4 pt-4 pb-0">
            <CardTitle className="text-base font-semibold text-foreground">Ingresos Mensuales</CardTitle>
            <CardDescription className="text-xs">Últimos 7 meses</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyStats}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef8f5f" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#ef8f5f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="month" stroke="#6b6d76" />
                <YAxis stroke="#6b6d76" tickFormatter={formatCurrencyCompact} width={48} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e4e4e7',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ef8f5f"
                  strokeWidth={2.5}
                  fill="url(#colorRevenue)"
                  name="Ingresos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="px-4 pt-4 pb-0">
            <CardTitle className="text-base font-semibold text-foreground">Preventivo vs Correctivo</CardTitle>
            <CardDescription className="text-xs">Distribución mensual</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="month" stroke="#6b6d76" />
                <YAxis stroke="#6b6d76" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e4e4e7',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
                  }}
                />
                <Legend />
                <Bar key="bar-preventive" dataKey="preventive" fill="#6fa4bc" name="Preventivos" radius={[8, 8, 0, 0]} />
                <Bar key="bar-corrective" dataKey="corrective" fill="#ef8f5f" name="Correctivos" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

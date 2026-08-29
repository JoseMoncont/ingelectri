import { MaintenanceFormComplete } from './MaintenanceFormComplete';
import { TechnicianOrders } from './TechnicianOrders';
import { TechnicianInventoryAndQuotes } from './TechnicianInventoryAndQuotes';
import { EquipmentTechnicalSheet } from './EquipmentTechnicalSheet';
import { MaintenanceService } from './MaintenanceService';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { Home, 
  Calendar, 
  QrCode, 
  FileText, 
  User,
  MapPin,
  Navigation,
  CheckCircle2,
  Clock,
  Camera,
  Mic,
  Video,
  Award,
  TrendingUp,
  LogOut,
  Wrench,
  AlertCircle,
  Package,
  Zap,
  Download,
  Upload,
  WifiOff,
  Wifi,
  MessageSquare,
  Star,
  Phone,
  Plus,
  Trophy,
  Send,
  X,
  ChevronRight,
  Save,
  Image as ImageIcon
} from 'lucide-react';

interface TechnicianMobileAppProps {
  user: any;
  onLogout: () => void;
}

type TabType = 'home' | 'agenda' | 'scan' | 'reports' | 'profile' | 'orders' | 'inventory' | 'maintenance' | 'technical-sheet';

export function TechnicianMobileApp({ user, onLogout }: TechnicianMobileAppProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isOnline, setIsOnline] = useState(true);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [checkInStatus, setCheckInStatus] = useState<{[key: string]: boolean}>({});
  const [showChatbot, setShowChatbot] = useState(false);
  const [showARSupport, setShowARSupport] = useState(false);

  // Mock data
  const todayServices = [
    {
      id: 'S001',
      time: '08:00 AM',
      client: 'Empresa XYZ S.A.S',
      equipment: 'Chiller Industrial',
      type: 'Preventivo',
      location: 'Calle 100 #15-20, Bogotá',
      address: 'Planta Baja - Cuarto de Máquinas',
      duration: '2 horas',
      status: 'pending',
      coordinates: { lat: 4.6813, lng: -74.0583 }
    },
    {
      id: 'S002',
      time: '11:00 AM',
      client: 'Hotel Plaza Real',
      equipment: 'Sistema HVAC Central',
      type: 'Correctivo',
      location: 'Carrera 7 #72-50, Bogotá',
      address: 'Piso 10 - Área Técnica',
      duration: '3 horas',
      status: 'pending',
      coordinates: { lat: 4.6545, lng: -74.0605 }
    },
    {
      id: 'S003',
      time: '03:00 PM',
      client: 'Centro Comercial Norte',
      equipment: 'Cuarto Frío Supermercado',
      type: 'Preventivo',
      location: 'Autopista Norte Km 5',
      address: 'Bodega - Área de Refrigeración',
      duration: '1.5 horas',
      status: 'pending',
      coordinates: { lat: 4.7110, lng: -74.0721 }
    }
  ];

  const stats = {
    completedToday: 5,
    pendingToday: 3,
    totalWeek: 28,
    rating: 4.8,
    rank: 3
  };

  const handleCheckIn = (serviceId: string) => {
    setCheckInStatus(prev => ({ ...prev, [serviceId]: true }));
    alert('✅ Check-in registrado\nUbicación GPS guardada: 4.6813, -74.0583');
  };

  const handleStartService = (service: any) => {
    if (!checkInStatus[service.id]) {
      alert('⚠️ Debes hacer check-in primero');
      return;
    }
    setSelectedService(service);
    setActiveTab('maintenance');
  };

  const handleScanQR = () => {
    setTimeout(() => {
      alert('✅ QR Escaneado Exitosamente!\n\nEquipo: Chiller Industrial CH-001\nÚltimo mantenimiento: 08/12/2025\n\nCargando ficha técnica...');
      setShowQRScanner(false);
      setActiveTab('technical-sheet');
    }, 2000);
  };

  const renderHome = () => (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-success to-emerald-600 p-7 pb-9 text-white">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="mb-0.5 text-sm text-white/80">Hola de nuevo,</p>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <div className="mt-2 flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
              {isOnline ? (
                <><Wifi className="h-3 w-3" /><span className="text-xs font-medium">En línea</span></>
              ) : (
                <><WifiOff className="h-3 w-3" /><span className="text-xs font-medium">Offline</span></>
              )}
            </div>
          </div>
          <Avatar className="h-14 w-14 border-2 border-white/40 bg-white text-success shadow-lg">
            <AvatarFallback className="text-lg font-bold">{user.avatar}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="-mt-4 px-6">
        <div className="rounded-3xl bg-card p-4 shadow-lg">
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Acciones Rápidas
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: QrCode, label: 'Escanear', onClick: () => setShowQRScanner(true), color: 'bg-steel/10 text-steel' },
              { icon: Calendar, label: 'Agenda', onClick: () => setActiveTab('agenda'), color: 'bg-success/10 text-success' },
              { icon: MessageSquare, label: 'Chatbot', onClick: () => setShowChatbot(true), color: 'bg-brand/10 text-brand' },
              { icon: Video, label: 'Soporte AR', onClick: () => setShowARSupport(true), color: 'bg-steel/10 text-steel' },
              { icon: TrendingUp, label: 'Reportes', onClick: () => setActiveTab('reports'), color: 'bg-warning/10 text-warning' },
              { icon: Package, label: 'Inventario', onClick: () => setActiveTab('inventory'), color: 'bg-brand-dark/10 text-brand-dark' },
              { icon: Trophy, label: 'Ranking', onClick: () => alert('🏆 Gamificación activada'), color: 'bg-warning/10 text-warning' },
            ].map(({ icon: Icon, label, onClick, color }) => (
              <button
                key={label}
                onClick={onClick}
                className="flex flex-col items-center gap-1.5 rounded-2xl py-2 transition-transform active:scale-95"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-center text-[11px] font-medium leading-tight text-foreground/80">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Service Nearby Section */}
      {todayServices.length > 0 && (
        <div className="px-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Servicio más cercano</h2>
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
              {/* Placeholder for equipment image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Wrench className="h-20 w-20 text-gray-300" />
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-brand text-white font-bold px-3 py-1">
                  {todayServices[0].type}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2">
                  <p className="text-xs text-gray-600">Inicia en</p>
                  <p className="text-xl font-bold text-gray-900">{todayServices[0].time}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{todayServices[0].client}</h3>
              <p className="text-gray-600 mb-3">{todayServices[0].equipment}</p>
              <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{todayServices[0].location}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => handleCheckIn(todayServices[0].id)}
                  variant="outline"
                  className="rounded-full font-semibold"
                  disabled={checkInStatus[todayServices[0].id]}
                >
                  {checkInStatus[todayServices[0].id] ? (
                    <><CheckCircle2 className="h-4 w-4 mr-2" />Listo</>
                  ) : (
                    <><MapPin className="h-4 w-4 mr-2" />Check-in</>
                  )}
                </Button>
                <Button 
                  onClick={() => handleStartService(todayServices[0])}
                  className="rounded-full font-semibold bg-gradient-to-r from-brand to-orange-600 hover:from-brand hover:to-orange-700"
                >
                  Iniciar
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Section */}
      <div className="px-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Tu desempeño hoy</h2>
        <div className="grid grid-cols-4 gap-2 rounded-2xl border border-border py-3">
          <div className="text-center">
            <div className="bg-success/10 w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-1.5">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <p className="text-lg font-bold text-gray-900">{stats.completedToday}</p>
            <p className="text-[11px] text-gray-500">Completados</p>
          </div>
          <div className="text-center">
            <div className="bg-warning/10 w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-1.5">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <p className="text-lg font-bold text-gray-900">{stats.pendingToday}</p>
            <p className="text-[11px] text-gray-500">Pendientes</p>
          </div>
          <div className="text-center">
            <div className="bg-steel/10 w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-1.5">
              <Star className="h-5 w-5 text-steel" />
            </div>
            <p className="text-lg font-bold text-gray-900">{stats.rating}</p>
            <p className="text-[11px] text-gray-500">Rating</p>
          </div>
          <div className="text-center">
            <div className="bg-brand/10 w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-1.5">
              <Award className="h-5 w-5 text-brand" />
            </div>
            <p className="text-lg font-bold text-gray-900">#{stats.rank}</p>
            <p className="text-[11px] text-gray-500">Posición</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAgenda = () => (
    <div className="space-y-4 pb-24 pt-4 px-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mi Agenda</h2>
        <p className="text-gray-600">Servicios programados para hoy</p>
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-brand to-orange-600 text-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">{new Date().getDate()}</p>
            <p className="text-lg">
              {new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
            </p>
            <p className="text-sm opacity-90 mt-2">
              {todayServices.length} servicios programados
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {todayServices.map((service, index) => (
          <Card key={service.id} className="border-0 shadow-lg">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="text-center flex-shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-1">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-xs font-bold text-gray-900">{service.time}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-900">{service.client}</p>
                      <p className="text-sm text-gray-600">{service.equipment}</p>
                    </div>
                    <Badge className={
                      service.type === 'Preventivo' ? 'bg-blue-500' : 'bg-orange-500'
                    }>
                      {service.type}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {service.location}
                    </p>
                    <p className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {service.address}
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Duración estimada: {service.duration}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      onClick={() => handleCheckIn(service.id)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      disabled={checkInStatus[service.id]}
                    >
                      {checkInStatus[service.id] ? '✓' : <MapPin className="h-3 w-3" />}
                    </Button>
                    <Button 
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${service.coordinates.lat},${service.coordinates.lng}`, '_blank')}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Navigation className="h-3 w-3" />
                    </Button>
                    <Button 
                      onClick={() => handleStartService(service)}
                      size="sm"
                      className="text-xs bg-brand hover:bg-brand"
                    >
                      <Wrench className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderScan = () => (
    <div className="space-y-4 pb-24 pt-4 px-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Escanear Equipo</h2>
        <p className="text-gray-600">Accede a la ficha técnica con QR</p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-64 w-64 border-4 border-brand rounded-2xl animate-pulse"></div>
            </div>
            <QrCode className="h-24 w-24 text-white z-10" />
          </div>
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Apunta la cámara al código QR del equipo
            </p>
            <Badge className="bg-brand">Cámara Activa</Badge>
          </div>
          <Button 
            onClick={handleScanQR}
            className="w-full bg-success hover:bg-green-600"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Simular Escaneo Exitoso
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Registrar Nuevo Equipo</CardTitle>
          <CardDescription>Genera un QR para equipos sin código</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => alert('🎯 Generando código QR...\n\nSe puede imprimir vía Bluetooth en impresora térmica portátil.')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Generar Código QR
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-4 pb-24 pt-4 px-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mis Reportes</h2>
        <p className="text-gray-600">Servicios completados</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-green-700">{stats.totalWeek}</p>
            <p className="text-sm text-green-600">Esta Semana</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="pt-4 text-center">
            <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-700">{stats.rating}</p>
            <p className="text-sm text-blue-600">Calificación</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-brand" />
            Ranking de Técnicos
          </CardTitle>
          <CardDescription>Top 5 del mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Ana Morales', services: 42, rating: 4.9, rank: 1 },
              { name: 'Pedro Sánchez', services: 38, rating: 4.85, rank: 2 },
              { name: 'Carlos Ramírez', services: 35, rating: 4.8, rank: 3 },
              { name: 'Luis Torres', services: 33, rating: 4.75, rank: 4 },
              { name: 'Juan Pérez', services: 30, rating: 4.7, rank: 5 },
            ].map((tech, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  tech.name === user.name ? 'bg-gradient-to-r from-brand/10 to-orange-500/10 border-2 border-brand' : 'bg-gray-50'
                }`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                  index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                  'bg-gradient-to-br from-blue-500 to-blue-700'
                }`}>
                  #{tech.rank}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{tech.name}</p>
                  <p className="text-xs text-gray-600">{tech.services} servicios • ★ {tech.rating}</p>
                </div>
                {tech.name === user.name && (
                  <Badge className="bg-brand">Tú</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Datos Pendientes de Sincronizar</span>
            <Badge variant="outline" className={isOnline ? 'text-green-600' : 'text-orange-600'}>
              {isOnline ? 'En Línea' : 'Offline'}
            </Badge>
          </CardTitle>
          <CardDescription>Modo Offline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-3">No hay datos pendientes</p>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => alert('🔄 Sincronización manual completada')}
            >
              Sincronizar Ahora
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-4 pb-24 pt-4 px-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mi Perfil</h2>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <Avatar className="h-24 w-24 mx-auto mb-4 bg-gradient-to-br from-brand to-orange-600 text-white text-2xl">
              <AvatarFallback>{user.avatar}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand">{stats.rating}</p>
                <p className="text-xs text-gray-600">Rating</p>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand">#{stats.rank}</p>
                <p className="text-xs text-gray-600">Ranking</p>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand">{stats.totalWeek}</p>
                <p className="text-xs text-gray-600">Servicios</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={() => setIsOnline(!isOnline)}
              variant="outline" 
              className="w-full justify-start"
            >
              {isOnline ? <Wifi className="h-4 w-4 mr-3" /> : <WifiOff className="h-4 w-4 mr-3" />}
              {isOnline ? 'Modo En Línea' : 'Modo Offline'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => alert('🏆 Logros desbloqueados: 12/25\n• Servicio perfecto x5\n• Puntualidad master\n• Cliente satisfecho x10')}
            >
              <Award className="h-4 w-4 mr-3" />
              Mis Logros
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => alert('📜 Certificaciones:\n• Técnico HVAC Nivel 2\n• Refrigeración Industrial\n• Válida hasta: 12/2026')}
            >
              <FileText className="h-4 w-4 mr-3" />
              Certificaciones
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => alert('📞 Soporte Técnico\nLínea directa: +57 300 123 4567\nDisponible 24/7')}
            >
              <Phone className="h-4 w-4 mr-3" />
              Soporte Técnico
            </Button>
            <Button 
              onClick={onLogout}
              variant="outline" 
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Cerrar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrders = () => (
    <TechnicianOrders onSelectService={handleStartService} />
  );

  const renderInventoryAndQuotes = () => (
    <TechnicianInventoryAndQuotes />
  );

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto bg-white min-h-full">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'agenda' && renderAgenda()}
          {activeTab === 'scan' && renderScan()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'inventory' && renderInventoryAndQuotes()}
          {activeTab === 'maintenance' && selectedService && (
            <MaintenanceService
              service={selectedService}
              onBack={() => setActiveTab('agenda')}
            />
          )}
          {activeTab === 'technical-sheet' && (
            <EquipmentTechnicalSheet 
              onClose={() => setActiveTab('home')}
            />
          )}
        </div>
      </div>

      {/* Bottom Navigation - Fixed */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-gray-100 flex-shrink-0">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-5 gap-1 p-2">
            {[
              { id: 'home' as TabType, icon: Home, label: 'Inicio' },
              { id: 'agenda' as TabType, icon: Calendar, label: 'Agenda' },
              { id: 'orders' as TabType, icon: Package, label: 'Órdenes' },
              { id: 'scan' as TabType, icon: QrCode, label: 'QR' },
              { id: 'profile' as TabType, icon: User, label: 'Perfil' },
            ].map(({ id, icon: Icon, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-2xl transition-all ${
                    isActive ? 'bg-success text-white shadow-md shadow-success/30' : 'text-gray-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[11px] font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* QR Scanner Modal */}
      <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Escanear Código QR</DialogTitle>
            <DialogDescription>Apunta al código del equipo</DialogDescription>
          </DialogHeader>
          <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-48 w-48 border-4 border-brand rounded-2xl animate-pulse"></div>
            </div>
            <QrCode className="h-16 w-16 text-white z-10" />
          </div>
          <Button 
            onClick={handleScanQR}
            className="w-full bg-success hover:bg-green-600"
          >
            Simular Escaneo
          </Button>
        </DialogContent>
      </Dialog>

      {/* Chatbot Modal */}
      <Dialog open={showChatbot} onOpenChange={setShowChatbot}>
        <DialogContent className="max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Asistente de Manuales
            </DialogTitle>
            <DialogDescription>
              Busca manuales técnicos y códigos de error
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">💬 Ejemplo:</p>
              <p className="text-sm italic">"Manual de Chiller Carrier 30RB"</p>
              <p className="text-sm italic">"Código de error E05 MiniSplit LG"</p>
            </div>
            <Input 
              placeholder="Escribe tu consulta..." 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  alert('🤖 Bot: Encontré el manual del Chiller Carrier 30RB:\n\n📄 Manual de Servicio (PDF - 45 páginas)\n🔧 Códigos de Error\n📊 Diagrama Eléctrico\n🎥 Video de Mantenimiento');
                }
              }}
            />
            <Button className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AR Support Modal */}
      <Dialog open={showARSupport} onOpenChange={setShowARSupport}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-purple-600" />
              Soporte con Realidad Aumentada
            </DialogTitle>
            <DialogDescription>
              Videollamada con ingeniero senior
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg flex items-center justify-center">
              <Video className="h-16 w-16 text-white" />
            </div>
            <p className="text-sm text-gray-600">
              🎯 El ingeniero podrá dibujar sobre tu pantalla en tiempo real para guiarte
            </p>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => alert('📞 Conectando con Ingeniero Senior...\n\n✅ El ingeniero podrá ver lo que ves y dibujar sobre tu pantalla para guiarte.')}
            >
              <Phone className="h-4 w-4 mr-2" />
              Iniciar Videollamada
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Maintenance Form Modal */}
      {showMaintenanceForm && selectedService && (
        <MaintenanceFormComplete 
          service={selectedService}
          onClose={() => setShowMaintenanceForm(false)}
        />
      )}
    </div>
  );
}
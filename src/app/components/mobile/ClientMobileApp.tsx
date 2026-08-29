import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ClientProjectsAndOrders } from './ClientProjectsAndOrders';
import { ClientQuotations } from './ClientQuotations';
import { ClientTrackingAndRating } from './ClientTrackingAndRating';
import {
  Home,
  ClipboardList,
  FileText,
  MapPin,
  Star,
  User,
  Bell,
  Calendar,
  MessageSquare,
  Phone,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  LogOut,
  Settings,
  HelpCircle,
  Package
} from 'lucide-react';

interface ClientMobileAppProps {
  user: any;
  onLogout: () => void;
}

type TabType = 'home' | 'orders' | 'quotations' | 'tracking' | 'profile';

export function ClientMobileApp({ user, onLogout }: ClientMobileAppProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const stats = {
    activeOrders: 2,
    pendingQuotations: 1,
    completedThisMonth: 5,
    totalSpent: 12500000
  };

  const recentActivity = [
    {
      id: 1,
      type: 'order_completed',
      title: 'Servicio Completado',
      description: 'Mantenimiento Sistema HVAC - OS-2025-003',
      time: 'Hace 2 horas',
      icon: CheckCircle2,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 2,
      type: 'quotation_received',
      title: 'Nueva Cotización',
      description: 'COT-2025-001 - $1,100,750',
      time: 'Hace 5 horas',
      icon: FileText,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 3,
      type: 'technician_assigned',
      title: 'Técnico Asignado',
      description: 'Carlos Ramírez - Mañana 10:00 AM',
      time: 'Ayer',
      icon: User,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatCurrencyCompact = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1
    }).format(value);
  };

  const renderHome = () => (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-dark to-[#1c1e21] px-7 pt-9 pb-9 text-white">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-brand/20 blur-2xl" />
        <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="mb-0.5 text-sm text-white/60">Bienvenido,</p>
            <h1 className="text-2xl font-bold">{user.company || user.name}</h1>
            <p className="text-sm text-white/60">{user.name}</p>
          </div>
          <div className="relative">
            <Avatar className="h-14 w-14 border-2 border-white/20 bg-white text-brand shadow-lg">
              <AvatarFallback className="text-lg font-bold">{user.avatar}</AvatarFallback>
            </Avatar>
            {notifications > 0 && (
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-danger rounded-full flex items-center justify-center text-[11px] font-bold ring-2 ring-brand-dark">
                {notifications}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="-mt-4 px-6">
        <div className="grid grid-cols-4 gap-2 rounded-2xl border border-border bg-card p-3 shadow-lg">
          <div className="text-center">
            <div className="bg-steel/10 w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-1.5">
              <ClipboardList className="h-5 w-5 text-steel" />
            </div>
            <p className="text-lg font-bold text-gray-900">{stats.activeOrders}</p>
            <p className="text-[11px] text-gray-500">Órdenes</p>
          </div>
          <div className="text-center">
            <div className="bg-warning/10 w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-1.5">
              <FileText className="h-5 w-5 text-warning" />
            </div>
            <p className="text-lg font-bold text-gray-900">{stats.pendingQuotations}</p>
            <p className="text-[11px] text-gray-500">Cotiz.</p>
          </div>
          <div className="text-center">
            <div className="bg-success/10 w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-1.5">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <p className="text-lg font-bold text-gray-900">{stats.completedThisMonth}</p>
            <p className="text-[11px] text-gray-500">Este mes</p>
          </div>
          <div className="text-center">
            <div className="bg-brand/10 w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-1.5">
              <DollarSign className="h-5 w-5 text-brand" />
            </div>
            <p className="text-lg font-bold text-gray-900">{formatCurrencyCompact(stats.totalSpent)}</p>
            <p className="text-[11px] text-gray-500">Inversión</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6">
        <div className="rounded-3xl bg-card p-4 shadow-sm border border-border">
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Acciones Rápidas
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: ClipboardList, label: 'Nueva Orden', onClick: () => toast.success('Solicitud de orden enviada. Te contactaremos pronto.'), color: 'bg-steel/10 text-steel' },
              { icon: MapPin, label: 'Rastrear', onClick: () => setActiveTab('tracking'), color: 'bg-success/10 text-success' },
              { icon: FileText, label: 'Cotizaciones', onClick: () => setActiveTab('quotations'), color: 'bg-brand/10 text-brand' },
              { icon: Phone, label: 'Soporte', onClick: () => toast.info('Soporte 24/7', { description: '+57 300 123 4567 · soporte@ingelectri.com' }), color: 'bg-brand-dark/10 text-brand-dark' },
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

      {/* Recent Activity */}
      <div className="px-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Actividad Reciente</h2>
        <div className="space-y-3">
          {recentActivity.map((activity) => {
            const Icon = activity.icon;
            return (
              <Card key={activity.id} className="border-0 shadow-lg">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${activity.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{activity.title}</p>
                      <p className="text-xs text-gray-600 mb-1">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="px-6">
        <Card className="border-0 shadow-lg bg-danger text-white rounded-3xl overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold mb-1">¿Emergencia?</p>
                <p className="text-sm opacity-90 mb-3">Servicio técnico disponible 24/7</p>
                <Button
                  onClick={() => toast.success('Llamando a la línea de emergencias', { description: '+57 300 999 9999 · Respuesta en 30 min' })}
                  className="bg-white text-danger hover:bg-gray-100 rounded-full"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar Ahora
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-4 pb-24 pt-9 px-4">
      <h2 className="text-xl font-bold text-gray-900">Mi Perfil</h2>

      <Card className="border-0 shadow-lg rounded-3xl">
        <CardContent className="pt-6 text-center">
          <Avatar className="h-20 w-20 mx-auto mb-3 bg-brand text-white text-xl shadow-md">
            <AvatarFallback>{user.avatar}</AvatarFallback>
          </Avatar>
          <h3 className="font-bold text-gray-900">{user.company || user.name}</h3>
          <p className="text-sm text-gray-500">{user.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>

          <div className="mt-5 grid grid-cols-3 divide-x divide-gray-100 border-y border-gray-100 py-3">
            <div>
              <p className="text-lg font-bold text-steel">{stats.activeOrders}</p>
              <p className="text-[11px] text-gray-500">Activas</p>
            </div>
            <div>
              <p className="text-lg font-bold text-success">{stats.completedThisMonth}</p>
              <p className="text-[11px] text-gray-500">Completadas</p>
            </div>
            <div>
              <p className="text-lg font-bold text-brand">{stats.pendingQuotations}</p>
              <p className="text-[11px] text-gray-500">Cotizaciones</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden py-0 gap-0">
        {[
          { icon: Settings, label: 'Configuración', onClick: () => toast.info('Configuración de cuenta próximamente') },
          { icon: TrendingUp, label: 'Historial de Servicios', onClick: () => toast.info('48 servicios · $45.850.000 invertidos') },
          { icon: Bell, label: 'Notificaciones', onClick: () => toast.info('Email, SMS y WhatsApp Business activos') },
          { icon: HelpCircle, label: 'Centro de Ayuda', onClick: () => toast.info('Soporte disponible 24/7') },
        ].map(({ icon: Icon, label, onClick }, i) => (
          <button
            key={label}
            onClick={onClick}
            className={`flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors ${i > 0 ? 'border-t border-gray-100' : ''}`}
          >
            <Icon className="h-4 w-4 text-gray-400" />
            {label}
          </button>
        ))}
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3.5 text-left text-sm font-medium text-danger hover:bg-danger/5 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </Card>

      {/* Company Info */}
      <Card className="border-0 shadow-lg rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Información de la Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">Razón Social</p>
            <p className="font-semibold text-gray-900">{user.company || 'Empresa Demo S.A.S'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">NIT</p>
            <p className="font-semibold text-gray-900">900.123.456-7</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Contacto Principal</p>
            <p className="font-semibold text-gray-900">{user.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Cliente desde</p>
            <p className="font-semibold text-gray-900">Enero 2023</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto bg-white min-h-full">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'orders' && <ClientProjectsAndOrders />}
          {activeTab === 'quotations' && <ClientQuotations />}
          {activeTab === 'tracking' && <ClientTrackingAndRating />}
          {activeTab === 'profile' && renderProfile()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-gray-100 flex-shrink-0">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-5 gap-1 p-2">
            {[
              { id: 'home' as TabType, icon: Home, label: 'Inicio' },
              { id: 'orders' as TabType, icon: ClipboardList, label: 'Órdenes' },
              { id: 'quotations' as TabType, icon: FileText, label: 'Cotizar' },
              { id: 'tracking' as TabType, icon: MapPin, label: 'Rastreo' },
              { id: 'profile' as TabType, icon: User, label: 'Perfil' },
            ].map(({ id, icon: Icon, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`relative flex flex-col items-center gap-1 py-2 rounded-2xl transition-all ${
                    isActive ? 'bg-brand text-white shadow-md shadow-brand/30' : 'text-gray-400'
                  }`}
                >
                  {id === 'profile' && notifications > 0 && (
                    <div className="absolute top-1 right-4 h-4 w-4 bg-danger rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                      {notifications}
                    </div>
                  )}
                  <Icon className="h-5 w-5" />
                  <span className="text-[11px] font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

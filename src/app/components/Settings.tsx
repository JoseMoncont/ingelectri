import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Settings as SettingsIcon,
  User,
  Building2,
  Bell,
  Palette,
  ShieldCheck,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';

interface SettingsProps {
  onLogout: () => void;
}

const NOTIFICATION_OPTIONS = [
  {
    key: 'newOrders',
    label: 'Nuevas órdenes asignadas',
    description: 'Recibe un aviso cuando se te asigne una nueva orden de servicio.',
  },
  {
    key: 'urgentAlerts',
    label: 'Alertas urgentes',
    description: 'Notificaciones inmediatas ante fallas críticas o solicitudes urgentes.',
  },
  {
    key: 'budgetApprovals',
    label: 'Presupuestos pendientes de aprobación',
    description: 'Avisa cuando un cliente aprueba, rechaza o queda pendiente una cotización.',
  },
  {
    key: 'maintenanceReminders',
    label: 'Recordatorios de mantenimiento programado',
    description: 'Recordatorio un día antes de un mantenimiento preventivo agendado.',
  },
  {
    key: 'weeklySummary',
    label: 'Resumen semanal por correo',
    description: 'Un correo con el balance de operaciones, ingresos y alertas de la semana.',
  },
] as const;

export function Settings({ onLogout }: SettingsProps) {
  const [profile, setProfile] = useState({
    name: 'Admin Usuario',
    email: 'admin@ingelectri.com',
    phone: '+57 300 000 0000',
  });

  const [company, setCompany] = useState({
    name: 'Ingelectri A&E S.A.S.',
    nit: '900.000.000-1',
    address: 'Diagonal 22 #42-2, Barrio El Bosque, Cartagena, Bolívar',
    phone: '+57 605 000 0000',
    email: 'contacto@ingelectri.com',
    activity: 'Mantenimiento y reparación especializado de equipo eléctrico e instalaciones de refrigeración',
  });

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    newOrders: true,
    urgentAlerts: true,
    budgetApprovals: true,
    maintenanceReminders: true,
    weeklySummary: false,
  });

  const [darkMode, setDarkMode] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  const handleToggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle('dark', checked);
    localStorage.setItem('ui-theme', checked ? 'dark' : 'light');
  };

  const handleSaveProfile = () => {
    toast.success('Perfil actualizado correctamente.');
  };

  const handleSaveCompany = () => {
    toast.success('Información de la empresa actualizada.');
  };

  const handleUpdatePassword = () => {
    if (!passwords.current || !passwords.next) {
      toast.error('Completa la contraseña actual y la nueva.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error('La confirmación no coincide con la nueva contraseña.');
      return;
    }
    setPasswords({ current: '', next: '', confirm: '' });
    toast.success('Contraseña actualizada correctamente.');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-brand" />
          Configuración
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Administra tu perfil, la empresa y las preferencias del sistema
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="profile">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="company">
            <Building2 className="h-4 w-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4" />
            Apariencia
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldCheck className="h-4 w-4" />
            Seguridad
          </TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="profile" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader className="px-5 pt-5 pb-0">
              <CardTitle className="text-base font-semibold">Información Personal</CardTitle>
              <CardDescription className="text-xs">
                Estos datos se muestran en la barra superior y en tus asignaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-brand flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tus iniciales se generan automáticamente a partir de tu nombre.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Nombre completo</Label>
                  <Input
                    id="profile-name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-phone">Teléfono</Label>
                  <Input
                    id="profile-phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="profile-email">Correo electrónico</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-border">
                <Button onClick={handleSaveProfile} className="bg-brand hover:bg-brand/90 text-white">
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Empresa */}
        <TabsContent value="company" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader className="px-5 pt-5 pb-0">
              <CardTitle className="text-base font-semibold">Datos de la Empresa</CardTitle>
              <CardDescription className="text-xs">
                Información legal y de contacto que aparece en cotizaciones y reportes
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="company-name">Razón social</Label>
                  <Input
                    id="company-name"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-nit">NIT</Label>
                  <Input
                    id="company-nit"
                    value={company.nit}
                    onChange={(e) => setCompany({ ...company, nit: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Teléfono</Label>
                  <Input
                    id="company-phone"
                    value={company.phone}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="company-email">Correo de contacto</Label>
                  <Input
                    id="company-email"
                    type="email"
                    value={company.email}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="company-address">Dirección</Label>
                  <Input
                    id="company-address"
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="company-activity">Actividad económica</Label>
                  <Input
                    id="company-activity"
                    value={company.activity}
                    onChange={(e) => setCompany({ ...company, activity: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-border">
                <Button onClick={handleSaveCompany} className="bg-brand hover:bg-brand/90 text-white">
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificaciones */}
        <TabsContent value="notifications" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader className="px-5 pt-5 pb-0">
              <CardTitle className="text-base font-semibold">Preferencias de Notificación</CardTitle>
              <CardDescription className="text-xs">
                Elige qué avisos quieres recibir dentro de la plataforma y por correo
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-4 divide-y divide-border">
              {NOTIFICATION_OPTIONS.map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                  </div>
                  <Switch
                    checked={notifications[key]}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, [key]: checked })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Apariencia */}
        <TabsContent value="appearance" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader className="px-5 pt-5 pb-0">
              <CardTitle className="text-base font-semibold">Apariencia</CardTitle>
              <CardDescription className="text-xs">
                Ajusta cómo se ve el panel para ti en este dispositivo
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-4 space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                    {darkMode ? (
                      <Moon className="h-4 w-4 text-brand" />
                    ) : (
                      <Sun className="h-4 w-4 text-brand" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Modo oscuro</p>
                    <p className="text-xs text-muted-foreground">
                      Reduce el brillo de la interfaz, ideal para turnos nocturnos
                    </p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={handleToggleDarkMode} />
              </div>

              <p className="text-xs text-muted-foreground">
                El color de marca y la tipografía están definidos por la identidad de Ingelectri A&E
                y no son personalizables.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seguridad */}
        <TabsContent value="security" className="mt-4">
          <div className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader className="px-5 pt-5 pb-0">
                <CardTitle className="text-base font-semibold">Cambiar Contraseña</CardTitle>
                <CardDescription className="text-xs">
                  Usa una contraseña de al menos 8 caracteres que no compartas con nadie
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña actual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva contraseña</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwords.next}
                      onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2 border-t border-border">
                  <Button onClick={handleUpdatePassword} className="bg-brand hover:bg-brand/90 text-white">
                    Actualizar Contraseña
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="px-5 pt-5 pb-0">
                <CardTitle className="text-base font-semibold">Sesión</CardTitle>
                <CardDescription className="text-xs">
                  Cierra tu sesión en este equipo
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-4">
                <Button variant="outline" onClick={onLogout} className="text-danger border-danger/30 hover:bg-danger/5">
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

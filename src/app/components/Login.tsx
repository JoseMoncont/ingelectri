import { useState, type FormEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { PhoneFrame } from './mobile/PhoneFrame';
import logo from '../../assets/logo/logo.png';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  MapPin,
  Zap,
  Snowflake,
  Factory,
  ArrowRight,
  ArrowLeft,
  Building2,
  Wrench,
} from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

type MobileRole = 'client' | 'technician';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=1400&q=80';

const HIGHLIGHTS = [
  { icon: Zap, label: 'Eléctrico' },
  { icon: Snowflake, label: 'Refrigeración' },
  { icon: Factory, label: 'Sistemas Industriales' },
];

const MOBILE_ROLES: {
  id: MobileRole;
  title: string;
  description: string;
  icon: typeof Building2;
  gradient: string;
}[] = [
  {
    id: 'client',
    title: 'Empresa Socia',
    description: 'Consulta y gestiona tu infraestructura',
    icon: Building2,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'technician',
    title: 'Técnico de Campo',
    description: 'Registra servicios y evidencias',
    icon: Wrench,
    gradient: 'from-brand to-orange-600',
  },
];

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [mobileRole, setMobileRole] = useState<MobileRole | null>(null);

  const closeMobilePreview = (open: boolean) => {
    setShowMobilePreview(open);
    if (!open) setMobileRole(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => onLogin(), 600);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Panel de marca */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden p-12">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/95 via-brand-dark/85 to-brand/30" />

        <div className="relative z-10 flex items-center gap-3">
          <img src={logo} alt="Ingelectri A&E" className="h-11 w-11 object-contain" />
          <div className="leading-tight">
            <p className="font-bold text-white">Ingelectri A&E</p>
            <p className="text-xs text-white/60">S.A.S.</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <h1 className="text-4xl font-bold leading-[1.1] text-white">
            Ingeniería del futuro.
          </h1>
          <p className="text-white/80">
            Mantenimiento eléctrico, refrigeración industrial y sistemas de climatización
            para plantas y comercios.
          </p>
          <div className="flex flex-wrap gap-2">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-white/60">
          <MapPin className="h-4 w-4" />
          Sede en Cartagena, Bolívar
        </div>
      </div>

      {/* Panel de acceso */}
      <div className="flex flex-1 items-center justify-center bg-gray-200 p-6 pb-28 sm:p-10 sm:pb-28">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <img src={logo} alt="Ingelectri A&E" className="mb-3 h-16 w-16 object-contain" />
            <h1 className="font-bold text-foreground">Ingelectri A&E S.A.S.</h1>
            <p className="text-sm text-muted-foreground">Ingeniería del futuro.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Bienvenido de nuevo</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Inicia sesión para gestionar tus operaciones
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="tu@ingelectri.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                Recordarme
              </label>
              <button type="button" className="text-sm text-brand hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-full bg-brand text-white hover:bg-brand/90"
            >
              {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>

      {/* Botón flotante hacia la demo de la app móvil */}
      <button
        onClick={() => setShowMobilePreview(true)}
        className="fixed bottom-6 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-brand-dark py-3 pl-4 pr-5 text-white shadow-2xl transition-transform hover:scale-105 hover:bg-brand-dark/90"
      >
        <Smartphone className="h-4 w-4" />
        <span className="text-sm font-medium">Ver app móvil</span>
      </button>

      <Dialog open={showMobilePreview} onOpenChange={closeMobilePreview}>
        <DialogContent
          className="flex max-h-[92vh] max-w-lg flex-col items-center gap-5 overflow-y-auto border-none bg-transparent p-0 shadow-none [&>button]:rounded-full [&>button]:bg-white/10 [&>button]:p-1.5 [&>button]:text-white [&>button]:opacity-100 [&>button]:hover:bg-white/20"
        >
          {mobileRole && (
            <button
              onClick={() => setMobileRole(null)}
              className="absolute left-4 top-4 z-10 rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20"
              aria-label="Elegir otro perfil"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          {!mobileRole ? (
            <>
              <DialogHeader className="px-8 text-center">
                <DialogTitle className="text-white">Así se ve nuestra app móvil</DialogTitle>
                <DialogDescription className="text-white/70">
                  Elige un perfil para ver cómo viven el servicio nuestros clientes y técnicos en
                  campo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid w-full max-w-sm grid-cols-1 gap-3 sm:grid-cols-2">
                {MOBILE_ROLES.map(({ id, title, description, icon: Icon, gradient }) => (
                  <button
                    key={id}
                    onClick={() => setMobileRole(id)}
                    className="flex flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center shadow-xl transition-transform hover:scale-105"
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{title}</p>
                      <p className="text-xs text-gray-600">{description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <DialogHeader className="px-10 text-center">
                <DialogTitle className="text-white">
                  {mobileRole === 'client' ? 'App Empresa Socia' : 'App Técnico de Campo'}
                </DialogTitle>
                <DialogDescription className="text-white/70">
                  Ejemplo interactivo de la experiencia móvil.
                </DialogDescription>
              </DialogHeader>
              <PhoneFrame src={`?mobilePreview=1&role=${mobileRole}`} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

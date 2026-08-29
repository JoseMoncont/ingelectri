import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Building2, Wrench, Lock, Mail, Fingerprint, ArrowLeft, Eye, EyeOff, ChevronRight } from 'lucide-react';
import logo from '../../../assets/logo/logo.png';

interface MobileLoginProps {
  onLogin: (user: any) => void;
  onExitMobileView?: () => void;
}

export function MobileLogin({ onLogin, onExitMobileView }: MobileLoginProps) {
  const [selectedRole, setSelectedRole] = useState<'client' | 'technician' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [useBiometric, setUseBiometric] = useState(false);

  const handleBiometricLogin = () => {
    // Simulación de autenticación biométrica
    setTimeout(() => {
      if (selectedRole === 'client') {
        onLogin({
          id: 'client-1',
          name: 'Juan Martínez',
          email: 'juan.martinez@empresa.com',
          role: 'client',
          company: 'Empresa XYZ S.A.S',
          avatar: 'JM'
        });
      } else {
        onLogin({
          id: 'tech-1',
          name: 'Carlos Ramírez',
          email: 'carlos.ramirez@ingelectri.com',
          role: 'technician',
          avatar: 'CR'
        });
      }
    }, 1000);
  };

  const handleEmailLogin = () => {
    if (selectedRole === 'client') {
      onLogin({
        id: 'client-1',
        name: 'Juan Martínez',
        email: email || 'juan.martinez@empresa.com',
        role: 'client',
        company: 'Empresa XYZ S.A.S',
        avatar: 'JM'
      });
    } else {
      onLogin({
        id: 'tech-1',
        name: 'Carlos Ramírez',
        email: email || 'carlos.ramirez@ingelectri.com',
        role: 'technician',
        avatar: 'CR'
      });
    }
  };

  if (!selectedRole) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-dark to-[#1c1e21] flex flex-col items-center justify-center p-6">
        <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 w-full max-w-md space-y-10">
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl">
              <img src={logo} alt="Ingelectri A&E" className="h-12 w-12 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-white">Ingelectri A&E</h1>
            <p className="mt-1 text-sm text-white/60">Ingeniería del futuro.</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <p className="px-1 text-xs font-semibold uppercase tracking-wide text-white/50">
              Ingresa como
            </p>
            <button
              onClick={() => setSelectedRole('client')}
              className="w-full rounded-3xl bg-white p-4 text-left shadow-xl transition-transform active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-steel to-cyan-500">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">Empresa Socia</h3>
                  <p className="text-sm text-gray-500">Consulta y gestiona tu infraestructura</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-gray-300" />
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('technician')}
              className="w-full rounded-3xl bg-white p-4 text-left shadow-xl transition-transform active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-orange-600">
                  <Wrench className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">Técnico de Campo</h3>
                  <p className="text-sm text-gray-500">Registra servicios y evidencias</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-gray-300" />
              </div>
            </button>
          </div>

          {onExitMobileView && (
            <button
              onClick={onExitMobileView}
              className="mx-auto flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white/80"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Salir de la vista previa
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-dark to-[#1c1e21] flex items-center justify-center p-6">
      <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <Card className="rounded-3xl border-0 shadow-2xl py-0 overflow-hidden gap-0">
          <div className="px-6 pt-8 pb-6 text-center">
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
                selectedRole === 'client'
                  ? 'bg-gradient-to-br from-steel to-cyan-500'
                  : 'bg-gradient-to-br from-brand to-orange-600'
              }`}
            >
              {selectedRole === 'client' ? (
                <Building2 className="h-8 w-8 text-white" />
              ) : (
                <Wrench className="h-8 w-8 text-white" />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {selectedRole === 'client' ? 'Acceso de Empresa' : 'Acceso de Técnico'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">Inicia sesión para continuar</p>
          </div>

          <CardContent className="space-y-4 px-6 pb-8 pt-0">
            {!useBiometric ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleEmailLogin}
                  className={`h-12 w-full rounded-full text-base font-semibold shadow-lg ${
                    selectedRole === 'client'
                      ? 'bg-gradient-to-r from-steel to-cyan-500 hover:opacity-90'
                      : 'bg-gradient-to-r from-brand to-orange-600 hover:opacity-90'
                  }`}
                >
                  Iniciar Sesión
                </Button>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-gray-400">O continúa con</span>
                  </div>
                </div>

                <Button
                  onClick={() => setUseBiometric(true)}
                  variant="outline"
                  className="h-12 w-full rounded-full border-2 text-base"
                >
                  <Fingerprint className="mr-2 h-5 w-5" />
                  Huella Digital / Face ID
                </Button>
              </>
            ) : (
              <div className="space-y-6 py-4 text-center">
                <div className="animate-pulse">
                  <Fingerprint className="mx-auto h-24 w-24 text-brand" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Autenticación Biométrica</h3>
                  <p className="text-gray-600">Coloca tu dedo en el sensor o mira a la cámara</p>
                </div>
                <Button
                  onClick={handleBiometricLogin}
                  className="rounded-full bg-success hover:bg-success/90"
                >
                  Simular Autenticación
                </Button>
                <Button onClick={() => setUseBiometric(false)} variant="ghost" className="w-full">
                  Volver
                </Button>
              </div>
            )}

            <div className="flex items-center justify-center gap-4 pt-1">
              <button
                onClick={() => setSelectedRole(null)}
                className="text-xs font-medium text-gray-400 hover:text-gray-600"
              >
                Cambiar de rol
              </button>
              {onExitMobileView && (
                <>
                  <span className="text-gray-300">•</span>
                  <button
                    onClick={onExitMobileView}
                    className="text-xs font-medium text-gray-400 hover:text-gray-600"
                  >
                    Salir
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

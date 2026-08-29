import { useState } from 'react';
import { Toaster } from '../ui/sonner';
import { MobileLogin } from './MobileLogin';
import { ClientMobileApp } from './ClientMobileApp';
import { TechnicianMobileApp } from './TechnicianMobileApp';

type UserRole = 'client' | 'technician' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'technician';
  company?: string;
  avatar?: string;
}

interface MobileAppProps {
  onExitMobileView?: () => void;
  initialUser?: User;
}

export function MobileApp({ onExitMobileView, initialUser }: MobileAppProps) {
  const [user, setUser] = useState<User | null>(initialUser ?? null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <>
        <MobileLogin onLogin={handleLogin} onExitMobileView={onExitMobileView} />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === 'client' ? (
        <ClientMobileApp user={user} onLogout={handleLogout} />
      ) : (
        <TechnicianMobileApp user={user} onLogout={handleLogout} />
      )}
      <Toaster position="top-center" />
    </div>
  );
}
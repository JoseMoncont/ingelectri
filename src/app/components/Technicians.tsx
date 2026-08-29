import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Users,
  Search,
  Phone,
  Mail,
  Award,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Navigation,
  Plus,
  Star,
  X,
  Check
} from 'lucide-react';
import { technicians } from '../data/mockData';
import { CreateTechnicianForm } from './CreateTechnicianForm';
import { getAvatarAccentClass } from '../lib/accentColor';

interface TechniciansProps {
  onViewSchedule?: () => void;
  onViewTracking?: () => void;
}

export function Technicians({ onViewSchedule, onViewTracking }: TechniciansProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSaveTechnician = (newTechnician: any) => {
    console.log('Nuevo técnico creado:', newTechnician);
    // Aquí se integraría con el estado global o API
  };

  const filteredTechnicians = technicians.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, label: string, icon: any }> = {
      'active': { color: 'bg-success/10 text-success border-success/20', label: 'Disponible', icon: CheckCircle2 },
      'on-break': { color: 'bg-warning/10 text-warning border-warning/20', label: 'En Descanso', icon: Clock },
      'off': { color: 'bg-muted text-muted-foreground border-transparent', label: 'No Disponible', icon: AlertCircle },
    };
    const { color, label, icon: Icon } = config[status] || config.active;
    return (
      <Badge variant="outline" className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getDocumentBadge = (status: 'valid' | 'expiring' | 'expired') => {
    if (status === 'valid') return <Check className="h-4 w-4 text-success" />;
    if (status === 'expiring') return <AlertCircle className="h-4 w-4 text-warning" />;
    return <X className="h-4 w-4 text-danger" />;
  };

  const activeCount = technicians.filter(t => t.status === 'active').length;
  const onBreakCount = technicians.filter(t => t.status === 'on-break').length;
  const offCount = technicians.filter(t => t.status === 'off').length;
  const totalActiveJobs = technicians.reduce((sum, t) => sum + t.activeJobs, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Gestión de Técnicos
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            Administración del equipo de trabajo
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar técnicos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-sm"
            />
          </div>
          {onViewSchedule && (
            <Button
              variant="outline"
              onClick={onViewSchedule}
              className="border-border"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Ver Agenda
            </Button>
          )}
          {onViewTracking && (
            <Button
              variant="outline"
              onClick={onViewTracking}
              className="border-border"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Rastrear Técnicos
            </Button>
          )}
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Técnico
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-success font-medium">Activos</p>
                <p className="text-2xl font-bold text-foreground mt-1">{activeCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-warning font-medium">En Descanso</p>
                <p className="text-2xl font-bold text-foreground mt-1">{onBreakCount}</p>
              </div>
              <Clock className="h-8 w-8 text-warning opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">No Disponibles</p>
                <p className="text-2xl font-bold text-foreground mt-1">{offCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-muted-foreground opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-steel font-medium">Trabajos Activos</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalActiveJobs}</p>
              </div>
              <FileText className="h-8 w-8 text-steel opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTechnicians.map((tech) => (
          <Card key={tech.id} className="shadow-sm hover:shadow-md transition-all group overflow-hidden gap-0 py-0">
            <CardContent className="px-5 pt-6 pb-5 text-center">
              <Avatar className="h-16 w-16 mx-auto shadow-md">
                <AvatarFallback className={`${getAvatarAccentClass(tech.id)} text-white text-lg font-bold`}>
                  {getInitials(tech.name)}
                </AvatarFallback>
              </Avatar>
              <h3 className="mt-3 font-semibold text-foreground group-hover:text-brand transition-colors">
                {tech.name}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                <Award className="h-3.5 w-3.5" />
                {tech.specialty}
              </p>
              <div className="mt-2.5 flex justify-center">
                {getStatusBadge(tech.status)}
              </div>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 truncate">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {tech.phone}
                </span>
                <span className="flex items-center gap-1.5 truncate">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {tech.email}
                </span>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 divide-x divide-border border-y border-border py-3">
                <div>
                  <p className="text-lg font-bold text-brand">{tech.activeJobs}</p>
                  <p className="text-[11px] text-muted-foreground">Activos</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-success">{tech.completedJobs}</p>
                  <p className="text-[11px] text-muted-foreground">Completados</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-warning flex items-center justify-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-warning" />
                    {tech.rating}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Rating</p>
                </div>
              </div>

              {/* Documents Status */}
              <div className="mt-3.5 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  {getDocumentBadge(tech.documentsStatus.arl)} ARL
                </span>
                <span className="flex items-center gap-1.5">
                  {getDocumentBadge(tech.documentsStatus.eps)} EPS
                </span>
                <span className="flex items-center gap-1.5">
                  {getDocumentBadge(tech.documentsStatus.license)} Licencia
                </span>
              </div>
            </CardContent>

            {/* Actions */}
            <div className="grid grid-cols-2 border-t border-border">
              <button
                onClick={() => setSelectedTechnician(tech)}
                className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground/80 hover:bg-muted transition-colors border-r border-border"
              >
                <Calendar className="h-4 w-4" />
                Ver Agenda
              </button>
              <button
                onClick={() => onViewTracking?.()}
                className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground/80 hover:bg-muted transition-colors"
              >
                <Navigation className="h-4 w-4" />
                Rastrear
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Technician Detail Modal - Availability Calendar */}
      {selectedTechnician && (
        <Dialog open={!!selectedTechnician} onOpenChange={() => setSelectedTechnician(null)}>
          <DialogContent className="sm:max-w-[60vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-card shadow-sm">
                  <AvatarFallback className={`${getAvatarAccentClass(selectedTechnician.id)} text-white text-lg font-bold`}>
                    {getInitials(selectedTechnician.name)}
                  </AvatarFallback>
                </Avatar>
                Agenda de {selectedTechnician.name}
              </DialogTitle>
              <DialogDescription>
                {selectedTechnician.specialty} • {selectedTechnician.activeJobs} trabajos activos
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Availability Schedule */}
              <Card className="shadow-sm overflow-hidden">
                <CardHeader className="px-4 pt-4 pb-0 bg-muted">
                  <CardTitle className="text-base font-semibold">Disponibilidad Semanal</CardTitle>
                  <CardDescription className="text-xs">Horarios configurados para asignación</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-3">
                  {selectedTechnician.availability && selectedTechnician.availability.length > 0 ? (
                    <div className="space-y-2.5">
                      {selectedTechnician.availability.map((slot: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-steel/10 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-steel flex items-center justify-center text-white text-sm font-bold">
                              {slot.day.slice(0, 3)}
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-foreground">{slot.day}</p>
                              <p className="text-xs text-muted-foreground">
                                {slot.slots.length} franjas disponibles
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {slot.slots.map((time: string, i: number) => (
                              <Badge key={i} variant="outline" className="bg-card">
                                <Clock className="h-3 w-3 mr-1" />
                                {time}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Calendar className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No hay disponibilidad configurada</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Current Jobs */}
              <Card className="shadow-sm overflow-hidden">
                <CardHeader className="px-4 pt-4 pb-0 bg-muted">
                  <CardTitle className="text-base font-semibold">Trabajos Actuales</CardTitle>
                  <CardDescription className="text-xs">{selectedTechnician.activeJobs} servicios asignados</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-3">
                  {selectedTechnician.activeJobs > 0 ? (
                    <div className="space-y-2">
                      {Array.from({ length: selectedTechnician.activeJobs }).map((_, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 border border-border rounded-lg">
                          <div>
                            <p className="font-semibold text-sm text-foreground">Trabajo #{idx + 1}</p>
                            <p className="text-xs text-muted-foreground">En progreso</p>
                          </div>
                          <Badge variant="outline" className="bg-brand/10 text-brand border-brand/20">Activo</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <CheckCircle2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Sin trabajos asignados actualmente</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Technician Form */}
      <CreateTechnicianForm 
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSave={handleSaveTechnician}
      />
    </div>
  );
}
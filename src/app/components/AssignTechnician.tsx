import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon,
  Clock,
  Wrench,
  Star,
  CheckCircle2,
  User,
  FileText,
  Send,
  Mail,
  Phone,
  Lightbulb
} from 'lucide-react';
import { technicians, equipment } from '../data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AssignTechnicianProps {
  onBack: () => void;
}

export function AssignTechnician({ onBack }: AssignTechnicianProps) {
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    alert('Técnico asignado exitosamente!');
    onBack();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const selectedTech = technicians.find(t => t.id === selectedTechnician);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-1 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            Asignar Técnico
          </h1>
          <p className="text-muted-foreground text-sm">Programa un nuevo mantenimiento</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <Card className="lg:col-span-2 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted px-4 pt-4 pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand" />
              Detalles de la Asignación
            </CardTitle>
            <CardDescription className="text-xs">Complete la información del mantenimiento</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-4 space-y-4">
            {/* Equipment Selection */}
            <div className="space-y-1.5">
              <Label htmlFor="equipment" className="text-sm font-semibold">Equipo</Label>
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger id="equipment" className="h-10">
                  <SelectValue placeholder="Seleccione el equipo" />
                </SelectTrigger>
                <SelectContent>
                  {equipment.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{eq.type} - {eq.brand}</span>
                        <span className="text-xs text-muted-foreground">{eq.serial} | {eq.clientName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Maintenance Type */}
            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-sm font-semibold">Tipo de Mantenimiento</Label>
              <Select value={maintenanceType} onValueChange={setMaintenanceType}>
                <SelectTrigger id="type" className="h-10">
                  <SelectValue placeholder="Seleccione el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventivo">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-steel" />
                      Preventivo
                    </div>
                  </SelectItem>
                  <SelectItem value="correctivo">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-warning" />
                      Correctivo
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Technician Selection */}
            <div className="space-y-1.5">
              <Label htmlFor="technician" className="text-sm font-semibold">Técnico</Label>
              <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                <SelectTrigger id="technician" className="h-10">
                  <SelectValue placeholder="Seleccione el técnico" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.filter(t => t.status === 'active').map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold">
                          {getInitials(tech.name)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{tech.name}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {tech.specialty} • <Star className="h-3 w-3 fill-warning text-warning" /> {tech.rating}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-10 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="time" className="text-sm font-semibold">Hora</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger id="time" className="h-10">
                    <SelectValue placeholder="Seleccione la hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                      <SelectItem key={time} value={time}>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {time}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-sm font-semibold">Observaciones</Label>
              <Textarea
                id="notes"
                placeholder="Ingrese observaciones o instrucciones especiales..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[90px] resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!selectedEquipment || !selectedTechnician || !selectedDate || !selectedTime || !maintenanceType}
                className="bg-brand hover:bg-brand/90 text-white font-semibold shadow-sm"
              >
                <Send className="h-4 w-4 mr-2" />
                Asignar Técnico
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="space-y-4">
          {/* Selected Technician Card */}
          {selectedTech && (
            <Card className="shadow-sm bg-brand-dark text-white">
              <CardHeader className="px-4 pt-4 pb-0">
                <CardTitle className="text-base font-semibold text-white">Técnico Seleccionado</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-3 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-white/20">
                    <AvatarFallback className="bg-brand text-white text-lg font-bold">
                      {getInitials(selectedTech.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-base">{selectedTech.name}</h3>
                    <p className="text-xs text-white/70">{selectedTech.specialty}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Trabajos Activos</span>
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                      <Clock className="h-3 w-3 mr-1" />
                      {selectedTech.activeJobs}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Completados</span>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {selectedTech.completedJobs}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Calificación</span>
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                      <Star className="h-3 w-3 mr-1 fill-warning" />
                      {selectedTech.rating}
                    </Badge>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{selectedTech.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{selectedTech.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Tips */}
          <Card className="shadow-sm bg-steel/10">
            <CardHeader className="px-4 pt-4 pb-0">
              <CardTitle className="text-base font-semibold text-steel flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Consejos
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3 space-y-2 text-sm text-steel">
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-steel flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">1</span>
                </div>
                <p>Asigna técnicos según su especialidad</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-steel flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">2</span>
                </div>
                <p>Verifica la disponibilidad del técnico</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-steel flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">3</span>
                </div>
                <p>Incluye observaciones detalladas</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

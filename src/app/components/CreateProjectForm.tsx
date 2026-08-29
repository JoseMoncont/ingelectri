import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Briefcase, Calendar, DollarSign, FileText } from 'lucide-react';
import { clients } from '../data/mockData';

interface CreateProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (project: any) => void;
}

const STATUS_OPTIONS: Record<string, { label: string; className: string }> = {
  planning: { label: 'Planificación', className: 'bg-muted text-muted-foreground border-border' },
  active: { label: 'Activo', className: 'bg-steel/10 text-steel border-steel/20' },
  'on-hold': { label: 'En Espera', className: 'bg-warning/10 text-warning border-warning/20' },
  completed: { label: 'Completado', className: 'bg-success/10 text-success border-success/20' },
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};

export function CreateProjectForm({ open, onClose, onSave }: CreateProjectFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    manager: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'planning' as 'planning' | 'active' | 'completed' | 'on-hold',
  });

  const selectedClient = clients.find(c => c.id === formData.clientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProject = {
      id: `PROY-2026-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      name: formData.name,
      clientId: formData.clientId,
      clientName: selectedClient?.name || '',
      manager: formData.manager,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      budget: Number(formData.budget),
      spent: 0,
      progress: 0,
      serviceOrders: [],
      budgets: [],
      maintenances: [],
      equipment: [],
    };

    onSave(newProject);
    onClose();

    setFormData({
      name: '',
      clientId: '',
      manager: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
      status: 'planning',
    });
  };

  const status = STATUS_OPTIONS[formData.status];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[70vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="h-10 w-10 rounded-xl bg-brand flex items-center justify-center shrink-0">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            Crear Nuevo Proyecto
          </DialogTitle>
          <DialogDescription>
            Complete la información del proyecto empresarial
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 space-y-5">
              {/* Información General */}
              <div className="rounded-xl border border-border p-4 space-y-4">
                <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-brand/10 flex items-center justify-center">
                    <FileText className="h-3.5 w-3.5 text-brand" />
                  </div>
                  Información General
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="name">Nombre del Proyecto *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Mantenimiento Integral 2026"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientId">Cliente *</Label>
                    <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                      <SelectTrigger id="clientId">
                        <SelectValue placeholder="Seleccione cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manager">Gerente del Proyecto *</Label>
                    <Input
                      id="manager"
                      value={formData.manager}
                      onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                      placeholder="Ej: Ing. Juan Pérez"
                      required
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Descripción del Proyecto *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describa el alcance y objetivos del proyecto..."
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Cronograma */}
              <div className="rounded-xl border border-border p-4 space-y-4">
                <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-brand/10 flex items-center justify-center">
                    <Calendar className="h-3.5 w-3.5 text-brand" />
                  </div>
                  Cronograma
                </h3>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Fecha de Inicio *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Fecha de Finalización *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                      min={formData.startDate}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Estado Inicial *</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planificación</SelectItem>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="on-hold">En Espera</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Presupuesto */}
              <div className="rounded-xl border border-border p-4 space-y-4">
                <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-brand/10 flex items-center justify-center">
                    <DollarSign className="h-3.5 w-3.5 text-brand" />
                  </div>
                  Presupuesto
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="budget">Presupuesto Total (COP) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="Ej: 50000000"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.budget && `Valor: ${formatCurrency(Number(formData.budget))}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <div className="sticky top-0 rounded-xl border border-border bg-muted/40 p-4 space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Resumen del Proyecto</p>

                <div>
                  <p className="text-xs text-muted-foreground">Nombre</p>
                  <p className="font-semibold text-sm text-foreground truncate">{formData.name || 'Sin definir'}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Cliente</p>
                  <p className="font-semibold text-sm text-foreground truncate">{selectedClient?.name || 'Sin definir'}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Gerente</p>
                  <p className="font-semibold text-sm text-foreground truncate">{formData.manager || 'Sin definir'}</p>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">Presupuesto</p>
                  <p className="font-bold text-lg text-brand">
                    {formData.budget ? formatCurrency(Number(formData.budget)) : '—'}
                  </p>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Cronograma</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formData.startDate || '—'} → {formData.endDate || '—'}
                  </p>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1.5">Estado inicial</p>
                  <Badge variant="outline" className={`border ${status.className}`}>
                    {status.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-success hover:bg-success/90 text-white">
              <Briefcase className="h-4 w-4 mr-2" />
              Crear Proyecto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

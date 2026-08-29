import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FileText, Calendar, Users, Package, DollarSign, Shield, Wrench } from 'lucide-react';
import { clients, technicians, equipment, projects } from '../data/mockData';
import { Badge } from "./ui/badge";

interface CreateServiceOrderFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (order: any) => void;
}

export function CreateServiceOrderForm({ open, onClose, onSave }: CreateServiceOrderFormProps) {
  const [formData, setFormData] = useState({
    clientId: '',
    projectId: '',
    type: 'maintenance' as 'maintenance' | 'installation',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    description: '',
    scheduledDate: '',
    estimatedHours: '',
    totalCost: '',
    selectedTechnicians: [] as string[],
    selectedEquipment: [] as string[],
    hasWarranty: false,
    warrantyMonths: '3',
    observations: '',
  });

  const handleTechnicianToggle = (techId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTechnicians: prev.selectedTechnicians.includes(techId)
        ? prev.selectedTechnicians.filter(id => id !== techId)
        : [...prev.selectedTechnicians, techId]
    }));
  };

  const handleEquipmentToggle = (equipId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedEquipment: prev.selectedEquipment.includes(equipId)
        ? prev.selectedEquipment.filter(id => id !== equipId)
        : [...prev.selectedEquipment, equipId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedClient = clients.find(c => c.id === formData.clientId);
    const selectedProject = projects.find(p => p.id === formData.projectId);

    const warrantyExpiry = formData.hasWarranty && formData.scheduledDate
      ? new Date(new Date(formData.scheduledDate).getTime() + Number(formData.warrantyMonths) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : null;

    const newOrder = {
      id: `OS-2026-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      clientId: formData.clientId,
      clientName: selectedClient?.name || '',
      projectId: formData.projectId || null,
      projectName: selectedProject?.name || null,
      type: formData.type,
      status: 'pending' as const,
      priority: formData.priority,
      createdDate: new Date().toISOString().split('T')[0],
      scheduledDate: formData.scheduledDate,
      completedDate: null,
      technicians: formData.selectedTechnicians,
      equipmentIds: formData.selectedEquipment,
      description: formData.description,
      estimatedHours: Number(formData.estimatedHours),
      actualHours: 0,
      totalCost: Number(formData.totalCost),
      observations: formData.observations,
      hasWarranty: formData.hasWarranty,
      warrantyMonths: formData.hasWarranty ? Number(formData.warrantyMonths) : 0,
      warrantyExpiry: warrantyExpiry,
    };

    onSave(newOrder);
    onClose();

    // Reset form
    setFormData({
      clientId: '',
      projectId: '',
      type: 'maintenance',
      priority: 'medium',
      description: '',
      scheduledDate: '',
      estimatedHours: '',
      totalCost: '',
      selectedTechnicians: [],
      selectedEquipment: [],
      hasWarranty: false,
      warrantyMonths: '3',
      observations: '',
    });
  };

  const availableTechnicians = technicians.filter(t => t.status === 'active');
  const clientEquipment = equipment.filter(e => e.clientId === formData.clientId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[75vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-6 w-6 text-brand" />
            Crear Nueva Orden de Servicio
          </DialogTitle>
          <DialogDescription>
            Complete la información de la orden de servicio
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Tipo de Servicio */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2 border-b pb-2">
              <Wrench className="h-5 w-5 text-brand" />
              Tipo de Servicio
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Trabajo *</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                    <SelectItem value="installation">Instalación/Montaje</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad *</Label>
                <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Cliente y Proyecto */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2 border-b pb-2">
              <Users className="h-5 w-5 text-brand" />
              Cliente y Proyecto
            </h3>

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="projectId">Proyecto (Opcional)</Label>
                <Select
                  value={formData.projectId || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, projectId: value === 'none' ? '' : value })}
                >
                  <SelectTrigger id="projectId">
                    <SelectValue placeholder="Sin proyecto asociado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin proyecto</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción del Trabajo *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describa el trabajo a realizar..."
                rows={3}
                required
              />
            </div>
          </div>

          {/* Técnicos Asignados */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2 border-b pb-2">
              <Users className="h-5 w-5 text-brand" />
              Técnicos Asignados ({formData.selectedTechnicians.length} seleccionados)
            </h3>

            <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto p-4 bg-muted rounded-lg border border-border">
              {availableTechnicians.map((tech) => (
                <div
                  key={tech.id}
                  onClick={() => handleTechnicianToggle(tech.id)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.selectedTechnicians.includes(tech.id)
                      ? 'border-brand bg-brand/5'
                      : 'border-border bg-card hover:border-foreground/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.selectedTechnicians.includes(tech.id)}
                      onChange={() => {}}
                      className="h-4 w-4 text-brand rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{tech.name}</p>
                      <p className="text-xs text-muted-foreground">{tech.specialty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipos */}
          {formData.clientId && clientEquipment.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground flex items-center gap-2 border-b pb-2">
                <Package className="h-5 w-5 text-brand" />
                Equipos ({formData.selectedEquipment.length} seleccionados)
              </h3>

              <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 bg-muted rounded-lg border border-border">
                {clientEquipment.map((equip) => (
                  <div
                    key={equip.id}
                    onClick={() => handleEquipmentToggle(equip.id)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.selectedEquipment.includes(equip.id)
                        ? 'border-brand bg-brand/5'
                        : 'border-border bg-card hover:border-foreground/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.selectedEquipment.includes(equip.id)}
                        onChange={() => {}}
                        className="h-4 w-4 text-brand rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{equip.type}</p>
                        <p className="text-xs text-muted-foreground">{equip.serialNumber}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Programación y Costos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2 border-b pb-2">
              <Calendar className="h-5 w-5 text-brand" />
              Programación y Costos
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Fecha Programada *</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Horas Estimadas *</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  placeholder="Ej: 8"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalCost">Costo Total (COP) *</Label>
                <Input
                  id="totalCost"
                  type="number"
                  min="0"
                  value={formData.totalCost}
                  onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
                  placeholder="Ej: 2500000"
                  required
                />
              </div>
            </div>
          </div>

          {/* Garantía */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2 border-b pb-2">
              <Shield className="h-5 w-5 text-brand" />
              Garantía
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasWarranty"
                  checked={formData.hasWarranty}
                  onChange={(e) => setFormData({ ...formData, hasWarranty: e.target.checked })}
                  className="h-4 w-4 text-brand rounded border-border"
                />
                <Label htmlFor="hasWarranty" className="cursor-pointer">
                  Este servicio incluye garantía
                </Label>
              </div>

              {formData.hasWarranty && (
                <div className="space-y-2">
                  <Label htmlFor="warrantyMonths">Meses de Garantía *</Label>
                  <Select value={formData.warrantyMonths} onValueChange={(value) => setFormData({ ...formData, warrantyMonths: value })}>
                    <SelectTrigger id="warrantyMonths">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 meses</SelectItem>
                      <SelectItem value="6">6 meses</SelectItem>
                      <SelectItem value="12">12 meses</SelectItem>
                      <SelectItem value="24">24 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label htmlFor="observations">Observaciones Adicionales</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Ingrese observaciones adicionales..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-success hover:bg-success/90 text-white"
              disabled={formData.selectedTechnicians.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              Crear Orden de Servicio
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

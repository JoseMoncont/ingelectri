import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Package, Calendar, MapPin, FileText, Shield } from 'lucide-react';
import { clients } from '../data/mockData';

interface CreateEquipmentFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (equipment: any) => void;
}

export function CreateEquipmentForm({ open, onClose, onSave }: CreateEquipmentFormProps) {
  const [formData, setFormData] = useState({
    serialNumber: '',
    type: '',
    brand: '',
    model: '',
    capacity: '',
    refrigerant: '',
    location: '',
    clientId: '',
    installDate: '',
    warranty: false,
    warrantyExpiry: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEquipment = {
      id: `EQ-${Date.now()}`,
      serialNumber: formData.serialNumber,
      type: formData.type,
      brand: formData.brand,
      model: formData.model,
      capacity: formData.capacity,
      refrigerant: formData.refrigerant,
      location: formData.location,
      clientId: formData.clientId,
      clientName: clients.find(c => c.id === formData.clientId)?.name || '',
      installDate: formData.installDate,
      lastMaintenance: null,
      nextMaintenance: null,
      status: 'active' as const,
      warranty: formData.warranty,
      warrantyExpiry: formData.warrantyExpiry || null,
      maintenanceHistory: [],
      notes: formData.notes,
    };

    onSave(newEquipment);
    onClose();
    
    // Reset form
    setFormData({
      serialNumber: '',
      type: '',
      brand: '',
      model: '',
      capacity: '',
      refrigerant: '',
      location: '',
      clientId: '',
      installDate: '',
      warranty: false,
      warrantyExpiry: '',
      notes: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[65vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Package className="h-6 w-6 text-[#F26522]" />
            Registrar Nuevo Equipo
          </DialogTitle>
          <DialogDescription>
            Complete la información del equipo a registrar en el inventario
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 border-b pb-2">
              <FileText className="h-5 w-5 text-[#F26522]" />
              Información Básica
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Número de Serie *</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="Ej: AC-2026-001"
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Equipo *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aire Acondicionado Split">Aire Acondicionado Split</SelectItem>
                    <SelectItem value="Aire Acondicionado Central">Aire Acondicionado Central</SelectItem>
                    <SelectItem value="Chiller">Chiller</SelectItem>
                    <SelectItem value="Sistema VRV">Sistema VRV</SelectItem>
                    <SelectItem value="Cuarto Frío">Cuarto Frío</SelectItem>
                    <SelectItem value="Unidad Manejadora">Unidad Manejadora</SelectItem>
                    <SelectItem value="Condensador">Condensador</SelectItem>
                    <SelectItem value="Evaporador">Evaporador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Ej: Carrier, Trane, Daikin"
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Ej: 38AUD036"
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidad (BTU/TON) *</Label>
                <Input
                  id="capacity"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="Ej: 24000 BTU o 3 TON"
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refrigerant">Tipo de Refrigerante *</Label>
                <Select value={formData.refrigerant} onValueChange={(value) => setFormData({ ...formData, refrigerant: value })}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Seleccione refrigerante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="R-22">R-22</SelectItem>
                    <SelectItem value="R-410A">R-410A</SelectItem>
                    <SelectItem value="R-134a">R-134a</SelectItem>
                    <SelectItem value="R-407C">R-407C</SelectItem>
                    <SelectItem value="R-404A">R-404A</SelectItem>
                    <SelectItem value="R-32">R-32</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Ubicación y Cliente */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 border-b pb-2">
              <MapPin className="h-5 w-5 text-[#F26522]" />
              Ubicación y Asignación
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Cliente *</Label>
                <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                  <SelectTrigger className="border-gray-300">
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
                <Label htmlFor="location">Ubicación Específica *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ej: Piso 2, Oficina 201"
                  required
                  className="border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Fechas e Instalación */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 border-b pb-2">
              <Calendar className="h-5 w-5 text-[#F26522]" />
              Fechas de Instalación
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="installDate">Fecha de Instalación *</Label>
                <Input
                  id="installDate"
                  type="date"
                  value={formData.installDate}
                  onChange={(e) => setFormData({ ...formData, installDate: e.target.value })}
                  required
                  className="border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Garantía */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 border-b pb-2">
              <Shield className="h-5 w-5 text-[#F26522]" />
              Garantía
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="warranty"
                  checked={formData.warranty}
                  onChange={(e) => setFormData({ ...formData, warranty: e.target.checked })}
                  className="h-4 w-4 text-[#F26522] rounded border-gray-300"
                />
                <Label htmlFor="warranty" className="cursor-pointer">
                  Este equipo tiene garantía activa
                </Label>
              </div>

              {formData.warranty && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="warrantyExpiry">Fecha de Vencimiento de Garantía *</Label>
                    <Input
                      id="warrantyExpiry"
                      type="date"
                      value={formData.warrantyExpiry}
                      onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                      required={formData.warranty}
                      className="border-gray-300"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas y Observaciones</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ingrese observaciones adicionales sobre el equipo..."
              rows={4}
              className="border-gray-300"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-300">
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#28A745] hover:bg-[#218838] text-white">
              <Package className="h-4 w-4 mr-2" />
              Registrar Equipo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { User, Phone, Mail, Award, MapPin, Shield, Calendar } from 'lucide-react';

interface CreateTechnicianFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (technician: any) => void;
}

export function CreateTechnicianForm({ open, onClose, onSave }: CreateTechnicianFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialty: '',
    experience: '',
    location: '',
    certifications: '',
    licenseNumber: '',
    licenseExpiry: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTechnician = {
      id: `TECH-${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      specialty: formData.specialty,
      experience: Number(formData.experience),
      location: formData.location,
      status: 'active' as const,
      activeJobs: 0,
      completedJobs: 0,
      rating: 0,
      certifications: formData.certifications.split(',').map(c => c.trim()).filter(c => c),
      documents: {
        license: formData.licenseNumber ? 'valid' as const : undefined,
        licenseExpiry: formData.licenseExpiry || undefined,
      },
      emergencyContact: {
        name: formData.emergencyContact,
        phone: formData.emergencyPhone,
      },
    };

    onSave(newTechnician);
    onClose();

    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      specialty: '',
      experience: '',
      location: '',
      certifications: '',
      licenseNumber: '',
      licenseExpiry: '',
      emergencyContact: '',
      emergencyPhone: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[65vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <User className="h-6 w-6 text-brand" />
            Registrar Nuevo Técnico
          </DialogTitle>
          <DialogDescription>
            Complete la información del técnico a registrar en el sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2 border-b pb-2">
              <User className="h-5 w-5 text-brand" />
              Información Personal
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Carlos Ramírez Gómez"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+57 300 123 4567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="carlos.ramirez@ingelectri.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Información Profesional */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2 border-b pb-2">
              <Award className="h-5 w-5 text-brand" />
              Información Profesional
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad *</Label>
                <Select value={formData.specialty} onValueChange={(value) => setFormData({ ...formData, specialty: value })}>
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Seleccione especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Refrigeración Comercial">Refrigeración Comercial</SelectItem>
                    <SelectItem value="Climatización Industrial">Climatización Industrial</SelectItem>
                    <SelectItem value="Sistemas VRV/VRF">Sistemas VRV/VRF</SelectItem>
                    <SelectItem value="Cuartos Fríos">Cuartos Fríos</SelectItem>
                    <SelectItem value="Aires Acondicionados Residenciales">Aires Acondicionados Residenciales</SelectItem>
                    <SelectItem value="Chillers">Chillers</SelectItem>
                    <SelectItem value="Mantenimiento General">Mantenimiento General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Años de Experiencia *</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Ej: 5"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="certifications">Certificaciones (separadas por coma)</Label>
                <Input
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  placeholder="Ej: EPA 608, HVAC Excellence, NATE"
                />
                <p className="text-xs text-muted-foreground">Ingrese las certificaciones separadas por comas</p>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2 border-b pb-2">
              <MapPin className="h-5 w-5 text-brand" />
              Ubicación
            </h3>

            <div className="space-y-2">
              <Label htmlFor="location">Ciudad de Operación *</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Seleccione ciudad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bogotá">Bogotá</SelectItem>
                  <SelectItem value="Medellín">Medellín</SelectItem>
                  <SelectItem value="Cali">Cali</SelectItem>
                  <SelectItem value="Barranquilla">Barranquilla</SelectItem>
                  <SelectItem value="Cartagena">Cartagena</SelectItem>
                  <SelectItem value="Bucaramanga">Bucaramanga</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Documentación */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2 border-b pb-2">
              <Shield className="h-5 w-5 text-brand" />
              Documentación Legal
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Número de Licencia Técnica</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="Ej: LIC-HVAC-12345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseExpiry">Fecha de Vencimiento</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Contacto de Emergencia */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2 border-b pb-2">
              <Phone className="h-5 w-5 text-brand" />
              Contacto de Emergencia
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Nombre del Contacto</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="Ej: María Ramírez"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Teléfono de Emergencia</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  placeholder="+57 310 987 6543"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-success hover:bg-success/90 text-white">
              <User className="h-4 w-4 mr-2" />
              Registrar Técnico
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

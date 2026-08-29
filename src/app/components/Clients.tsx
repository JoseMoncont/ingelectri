import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Search, Plus, Building2, Phone, Mail, MapPin, Package, ArrowRight, TrendingUp } from 'lucide-react';
import { clients } from '../data/mockData';

interface ClientsProps {
  onViewClient: (id: string, name: string) => void;
}

export function Clients({ onViewClient }: ClientsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Clientes
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <Building2 className="h-3.5 w-3.5" />
            Gestión de empresas socias
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-sm"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-brand hover:bg-brand/90 text-white shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[55vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Registrar Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Complete la información de la empresa socia
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Empresa *</Label>
                <Input id="name" placeholder="Centro Comercial..." className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nit">NIT *</Label>
                <Input id="nit" placeholder="900123456-7" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contacto *</Label>
                <Input id="contact" placeholder="Nombre del contacto" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input id="phone" placeholder="+57 300 123 4567" className="h-11" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="contacto@empresa.com" className="h-11" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input id="address" placeholder="Calle 50 #30-20, Bogotá" className="h-11" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button className="bg-brand hover:bg-brand/90 text-white" onClick={() => setIsDialogOpen(false)}>
                Registrar Cliente
              </Button>
            </DialogFooter>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="group shadow-sm hover:shadow-md transition-all overflow-hidden">
            <CardHeader className="px-4 pt-4 pb-0">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-brand" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-base font-semibold group-hover:text-brand transition-colors truncate">{client.name}</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    NIT: {client.nit}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-steel/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-steel" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="text-sm font-semibold text-foreground truncate">{client.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-steel/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-steel" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-semibold text-foreground truncate">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Package className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Equipos</p>
                    <p className="text-sm font-semibold text-foreground">{client.equipmentCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-brand" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Último Mtto</p>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(client.lastMaintenance).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-border">
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{client.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground truncate">
                    Contacto: <span className="text-foreground font-semibold">{client.contact}</span>
                  </div>
                  <button
                    onClick={() => onViewClient(client.id, client.name)}
                    className="text-xs font-medium text-brand hover:underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    Ver detalles
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No se encontraron clientes con ese criterio de búsqueda</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

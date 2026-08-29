import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DollarSign, Plus, Trash2, FileText, Calculator } from 'lucide-react';
import { clients } from '../data/mockData';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface CreateBudgetFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (budget: any) => void;
}

export function CreateBudgetForm({ open, onClose, onSave }: CreateBudgetFormProps) {
  const [formData, setFormData] = useState({
    clientId: '',
    description: '',
    validUntil: '',
    notes: '',
  });

  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);

  const addItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      }
      return item;
    }));
  };

  const totalValue = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedClient = clients.find(c => c.id === formData.clientId);

    const newBudget = {
      id: `PRES-2026-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      clientId: formData.clientId,
      clientName: selectedClient?.name || '',
      description: formData.description,
      value: totalValue,
      status: 'pending' as const,
      createdDate: new Date().toISOString().split('T')[0],
      validUntil: formData.validUntil,
      items: items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
      })),
      notes: formData.notes,
    };

    onSave(newBudget);
    onClose();
    
    // Reset form
    setFormData({
      clientId: '',
      description: '',
      validUntil: '',
      notes: '',
    });
    setItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[75vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <DollarSign className="h-6 w-6 text-[#F26522]" />
            Crear Nuevo Presupuesto
          </DialogTitle>
          <DialogDescription>
            Complete la información del presupuesto a enviar al cliente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Información General */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 border-b pb-2">
              <FileText className="h-5 w-5 text-[#F26522]" />
              Información General
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
                <Label htmlFor="validUntil">Válido Hasta *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Descripción del Presupuesto *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ej: Mantenimiento preventivo anual..."
                  rows={2}
                  required
                  className="border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Conceptos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#F26522]" />
                Conceptos del Presupuesto ({items.length} ítems)
              </h3>
              <Button type="button" onClick={addItem} size="sm" className="bg-[#F26522] hover:bg-[#d9591d] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Ítem
              </Button>
            </div>

            <div className="space-y-3">
              {/* Header */}
              <div className="grid grid-cols-12 gap-3 text-sm font-semibold text-gray-700 pb-2 border-b bg-gray-50 px-3 py-2 rounded">
                <div className="col-span-5">Descripción</div>
                <div className="col-span-2 text-center">Cantidad</div>
                <div className="col-span-2 text-right">Precio Unit.</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
              </div>

              {/* Items */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-center p-2 hover:bg-gray-50 rounded">
                    <div className="col-span-5">
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder={`Concepto #${index + 1}`}
                        required
                        className="border-gray-300"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        required
                        className="border-gray-300 text-center"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                        placeholder="0"
                        required
                        className="border-gray-300 text-right"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="bg-gray-100 border border-gray-300 rounded px-3 py-2 text-right font-semibold text-gray-900 text-sm">
                        {formatCurrency(item.total)}
                      </div>
                    </div>
                    <div className="col-span-1 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-end pt-4 border-t">
              <div className="bg-[#F26522] text-white px-6 py-4 rounded-lg min-w-[300px]">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">VALOR TOTAL:</span>
                  <span className="text-2xl font-bold">{formatCurrency(totalValue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas y Condiciones</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Condiciones de pago, términos y condiciones, etc..."
              rows={3}
              className="border-gray-300"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-300">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-[#28A745] hover:bg-[#218838] text-white"
              disabled={items.some(i => !i.description || i.unitPrice === 0)}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Crear Presupuesto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

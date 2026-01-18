'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Power,
  DollarSign,
  Clock,
  Scissors,
  Bath,
  Sparkles,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';
import { mockServices, createService, updateService, deleteService } from '@/lib/mock-data';
import { formatPrice, formatDuration } from '@/lib/availability';
import { toast } from 'sonner';
import { Service } from '@/types/database';
import { cn } from '@/lib/utils';

const categoryIcons: Record<Service['category'], React.ReactNode> = {
  bath: <Bath className="h-4 w-4" />,
  groom: <Scissors className="h-4 w-4" />,
  specialty: <Sparkles className="h-4 w-4" />,
  addon: <PlusCircle className="h-4 w-4" />,
};

const categoryColors: Record<Service['category'], string> = {
  bath: 'bg-blue-100 text-blue-800',
  groom: 'bg-purple-100 text-purple-800',
  specialty: 'bg-amber-100 text-amber-800',
  addon: 'bg-green-100 text-green-800',
};

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Service['category'] | 'all'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal states
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  // Form state
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    duration_minutes: 60,
    price: 0,
    category: 'groom' as Service['category'],
    is_active: true,
  });

  // Get fresh services list
  const services = useMemo(() => {
    return [...mockServices];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  // Filter services
  const filteredServices = useMemo(() => {
    let result = services;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter((service) => service.category === categoryFilter);
    }

    return result;
  }, [services, searchQuery, categoryFilter]);

  // Stats
  const stats = useMemo(() => {
    const active = services.filter((s) => s.is_active).length;
    const avgPrice = services.reduce((sum, s) => sum + s.price, 0) / services.length || 0;
    const categories = new Set(services.map((s) => s.category)).size;

    return { total: services.length, active, avgPrice, categories };
  }, [services]);

  const resetForm = useCallback(() => {
    setServiceForm({
      name: '',
      description: '',
      duration_minutes: 60,
      price: 0,
      category: 'groom',
      is_active: true,
    });
  }, []);

  const handleOpenCreate = useCallback(() => {
    resetForm();
    setIsCreateMode(true);
  }, [resetForm]);

  const handleOpenEdit = useCallback((service: Service) => {
    setServiceForm({
      name: service.name,
      description: service.description,
      duration_minutes: service.duration_minutes,
      price: service.price,
      category: service.category,
      is_active: service.is_active,
    });
    setEditingService(service);
  }, []);

  const handleCreate = useCallback(() => {
    if (!serviceForm.name.trim()) {
      toast.error('Service name is required');
      return;
    }

    createService(serviceForm);
    toast.success('Service created successfully!');
    setIsCreateMode(false);
    setRefreshKey((k) => k + 1);
    resetForm();
  }, [serviceForm, resetForm]);

  const handleUpdate = useCallback(() => {
    if (!editingService) return;

    if (!serviceForm.name.trim()) {
      toast.error('Service name is required');
      return;
    }

    const updated = updateService(editingService.id, serviceForm);
    if (updated) {
      toast.success('Service updated successfully!');
      setEditingService(null);
      setRefreshKey((k) => k + 1);
    } else {
      toast.error('Failed to update service');
    }
  }, [editingService, serviceForm]);

  const handleDelete = useCallback(() => {
    if (!deletingService) return;

    const success = deleteService(deletingService.id);
    if (success) {
      toast.success('Service deleted successfully!');
      setDeletingService(null);
      setRefreshKey((k) => k + 1);
    } else {
      toast.error('Failed to delete service');
    }
  }, [deletingService]);

  const handleToggleActive = useCallback((service: Service) => {
    const updated = updateService(service.id, { is_active: !service.is_active });
    if (updated) {
      toast.success(service.is_active ? 'Service deactivated' : 'Service activated');
      setRefreshKey((k) => k + 1);
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-muted-foreground">
            Manage your grooming services and pricing
          </p>
        </div>

        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Scissors className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Services</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Power className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active Services</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatPrice(stats.avgPrice)}</p>
              <p className="text-sm text-muted-foreground">Average Price</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.categories}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as Service['category'] | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="bath">Bath</SelectItem>
                <SelectItem value="groom">Groom</SelectItem>
                <SelectItem value="specialty">Specialty</SelectItem>
                <SelectItem value="addon">Add-on</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No services found
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id} className={cn(!service.is_active && 'opacity-50')}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {service.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('gap-1 capitalize', categoryColors[service.category])}>
                        {categoryIcons[service.category]}
                        {service.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDuration(service.duration_minutes)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        {formatPrice(service.price)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.is_active ? 'default' : 'secondary'}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(service)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(service)}>
                            <Power className="h-4 w-4 mr-2" />
                            {service.is_active ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeletingService(service)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Service Dialog */}
      <Dialog
        open={isCreateMode || !!editingService}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateMode(false);
            setEditingService(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isCreateMode ? (
                <>
                  <Plus className="h-5 w-5 text-primary" />
                  Add New Service
                </>
              ) : (
                <>
                  <Pencil className="h-5 w-5 text-primary" />
                  Edit Service
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Service Name *</Label>
              <Input
                id="service-name"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                placeholder="e.g., Full Haircut"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-description">Description</Label>
              <Textarea
                id="service-description"
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                placeholder="Describe what this service includes..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-duration">Duration (minutes)</Label>
                <Input
                  id="service-duration"
                  type="number"
                  min={5}
                  step={5}
                  value={serviceForm.duration_minutes}
                  onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-price">Price ($)</Label>
                <Input
                  id="service-price"
                  type="number"
                  min={0}
                  step={0.01}
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-category">Category</Label>
              <Select
                value={serviceForm.category}
                onValueChange={(value) => setServiceForm({ ...serviceForm, category: value as Service['category'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bath">
                    <div className="flex items-center gap-2">
                      <Bath className="h-4 w-4" />
                      Bath
                    </div>
                  </SelectItem>
                  <SelectItem value="groom">
                    <div className="flex items-center gap-2">
                      <Scissors className="h-4 w-4" />
                      Groom
                    </div>
                  </SelectItem>
                  <SelectItem value="specialty">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Specialty
                    </div>
                  </SelectItem>
                  <SelectItem value="addon">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Add-on
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateMode(false);
                setEditingService(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={isCreateMode ? handleCreate : handleUpdate}>
              {isCreateMode ? 'Create Service' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingService} onOpenChange={(open) => !open && setDeletingService(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Service
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingService?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingService(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

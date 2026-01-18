'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Clock,
  Store,
  Bell,
  Mail,
  DollarSign,
  Check,
  Pencil,
  FileText,
} from 'lucide-react';
import { mockBusinessHours, mockServices, mockMessageTemplates, updateService, updateMessageTemplate, updateBusinessHours } from '@/lib/mock-data';
import { formatPrice } from '@/lib/availability';
import { toast } from 'sonner';
import { Service, MessageTemplate } from '@/types/database';
import { useRouter } from 'next/navigation';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SettingsPage() {
  const router = useRouter();
  const [businessHours, setBusinessHours] = useState(mockBusinessHours);
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Peachy Pooches',
    phone: '(555) 123-GROOM',
    address: '123 Grooming Lane, Dogtown, CA 90210',
    email: 'hello@peachypooches.com',
  });

  // Service edit state
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    duration_minutes: 60,
    price: 0,
    category: 'groom' as Service['category'],
  });

  // Template edit state
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    content: '',
  });

  const handleEditService = useCallback((service: Service) => {
    setServiceForm({
      name: service.name,
      description: service.description,
      duration_minutes: service.duration_minutes,
      price: service.price,
      category: service.category,
    });
    setEditingService(service);
  }, []);

  const handleSaveService = useCallback(() => {
    if (!editingService) return;

    const updated = updateService(editingService.id, serviceForm);
    if (updated) {
      toast.success('Service updated successfully!');
      setEditingService(null);
    } else {
      toast.error('Failed to update service');
    }
  }, [editingService, serviceForm]);

  const handleEditTemplate = useCallback((template: MessageTemplate) => {
    setTemplateForm({
      name: template.name,
      content: template.content,
    });
    setEditingTemplate(template);
  }, []);

  const handleSaveTemplate = useCallback(() => {
    if (!editingTemplate) return;

    const updated = updateMessageTemplate(editingTemplate.id, templateForm);
    if (updated) {
      toast.success('Template updated successfully!');
      setEditingTemplate(null);
    } else {
      toast.error('Failed to update template');
    }
  }, [editingTemplate, templateForm]);

  const handleSaveAll = useCallback(() => {
    // Persist business hours
    updateBusinessHours(businessHours);
    toast.success('Settings saved successfully!');
  }, [businessHours]);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your business settings and preferences
        </p>
      </div>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Business Information
          </CardTitle>
          <CardDescription>
            Your business details shown to customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={businessInfo.name}
                onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                placeholder="Your business name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={businessInfo.phone}
                onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={businessInfo.address}
              onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
              placeholder="Your business address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Business Email</Label>
            <Input
              id="email"
              type="email"
              value={businessInfo.email}
              onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
              placeholder="contact@yourbusiness.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Business Hours
          </CardTitle>
          <CardDescription>
            Set your operating hours for each day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessHours.map((hours, index) => (
              <div
                key={hours.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-accent/30"
              >
                <div className="w-28">
                  <span className="font-medium">{dayNames[hours.day_of_week]}</span>
                </div>

                <div className="flex items-center gap-2 flex-1">
                  {hours.is_closed ? (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Closed
                    </Badge>
                  ) : (
                    <>
                      <Select
                        value={hours.open_time}
                        onValueChange={(value) => {
                          const newHours = [...businessHours];
                          newHours[index] = { ...hours, open_time: value };
                          setBusinessHours(newHours);
                        }}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['08:00', '09:00', '10:00', '11:00'].map((time) => (
                            <SelectItem key={time} value={time}>
                              {time === '08:00' ? '8:00 AM' :
                               time === '09:00' ? '9:00 AM' :
                               time === '10:00' ? '10:00 AM' : '11:00 AM'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">to</span>
                      <Select
                        value={hours.close_time}
                        onValueChange={(value) => {
                          const newHours = [...businessHours];
                          newHours[index] = { ...hours, close_time: value };
                          setBusinessHours(newHours);
                        }}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['15:00', '16:00', '17:00', '18:00'].map((time) => (
                            <SelectItem key={time} value={time}>
                              {time === '15:00' ? '3:00 PM' :
                               time === '16:00' ? '4:00 PM' :
                               time === '17:00' ? '5:00 PM' : '6:00 PM'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newHours = [...businessHours];
                    newHours[index] = { ...hours, is_closed: !hours.is_closed };
                    setBusinessHours(newHours);
                  }}
                >
                  {hours.is_closed ? 'Open' : 'Close'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Services & Pricing
          </CardTitle>
          <CardDescription>
            Manage your service offerings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockServices.slice(0, 5).map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{service.name}</p>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {service.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {service.duration_minutes} min
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-primary">
                    {formatPrice(service.price)}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => handleEditService(service)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={() => router.push('/admin/services')}>
            View All Services
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you receive updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Booking Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified when a new appointment is booked
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              Enabled
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Summary</p>
              <p className="text-sm text-muted-foreground">
                Receive a summary of tomorrow&apos;s appointments each evening
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              Enabled
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cancellation Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified when a client cancels their appointment
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              Enabled
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Templates
          </CardTitle>
          <CardDescription>
            Customize the emails sent to your clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockMessageTemplates.slice(0, 3).map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {template.content.slice(0, 60)}...
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSaveAll}>Save Changes</Button>
      </div>

      {/* Edit Service Dialog */}
      <Dialog open={!!editingService} onOpenChange={(open) => !open && setEditingService(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Edit Service
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Service Name</Label>
              <Input
                id="service-name"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-description">Description</Label>
              <Textarea
                id="service-description"
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-duration">Duration (minutes)</Label>
                <Input
                  id="service-duration"
                  type="number"
                  value={serviceForm.duration_minutes}
                  onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-price">Price ($)</Label>
                <Input
                  id="service-price"
                  type="number"
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
                  <SelectItem value="bath">Bath</SelectItem>
                  <SelectItem value="groom">Groom</SelectItem>
                  <SelectItem value="specialty">Specialty</SelectItem>
                  <SelectItem value="addon">Add-on</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingService(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveService}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Edit Email Template
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-content">Message Content</Label>
              <Textarea
                id="template-content"
                value={templateForm.content}
                onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                rows={6}
                placeholder="Write your template message..."
              />
              <p className="text-xs text-muted-foreground">
                Tip: You can use placeholders like {'{client_name}'}, {'{pet_name}'}, {'{appointment_date}'} that will be replaced with actual values.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTemplate(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

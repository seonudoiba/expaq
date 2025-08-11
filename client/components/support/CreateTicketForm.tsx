"use client";

import React, { useState } from 'react';
import { supportService } from '@/services/support-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/components/ui/use-toast';
import { HelpCircle, Send, CheckCircle } from 'lucide-react';

interface CreateTicketFormProps {
  onTicketCreated?: (ticketNumber: string) => void;
  relatedBookingId?: string;
  relatedActivityId?: string;
  defaultCategory?: string;
  defaultSubject?: string;
}

export function CreateTicketForm({
  onTicketCreated,
  relatedBookingId,
  relatedActivityId,
  defaultCategory,
  defaultSubject,
}: CreateTicketFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    subject: defaultSubject || '',
    description: '',
    category: defaultCategory || '',
    priority: 'MEDIUM',
    customerEmail: user?.email || '',
    customerName: user ? `${user.firstName} ${user.lastName}` : '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = supportService.getTicketCategories();
  const priorities = supportService.getTicketPriorities();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!user) {
      if (!formData.customerEmail.trim()) {
        newErrors.customerEmail = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
        newErrors.customerEmail = 'Please enter a valid email address';
      }

      if (!formData.customerName.trim()) {
        newErrors.customerName = 'Name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const ticketData = {
        ...formData,
        relatedBookingId,
        relatedActivityId,
      };

      const result = await supportService.createTicket(ticketData);

      if (result.success) {
        setIsSubmitted(true);
        setTicketNumber(result.ticketNumber || '');
        
        toast({
          title: "Support Ticket Created",
          description: `Your ticket ${result.ticketNumber} has been created successfully.`,
        });

        if (onTicketCreated && result.ticketNumber) {
          onTicketCreated(result.ticketNumber);
        }
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create support ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Ticket Created Successfully!
          </CardTitle>
          <CardDescription className="text-lg">
            Your support request has been submitted
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Your ticket number is:</p>
            <p className="text-2xl font-bold text-blue-600">{ticketNumber}</p>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              We've received your support request and our team will review it shortly.
            </p>
            <p>
              You'll receive email updates at <strong>{formData.customerEmail}</strong> 
              as we work on your ticket.
            </p>
            {user && (
              <p>
                You can also track your ticket status in your account dashboard.
              </p>
            )}
          </div>

          <div className="pt-4">
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  subject: '',
                  description: '',
                  category: '',
                  priority: 'MEDIUM',
                  customerEmail: user?.email || '',
                  customerName: user ? `${user.firstName} ${user.lastName}` : '',
                });
              }}
              variant="outline"
              className="mr-2"
            >
              Create Another Ticket
            </Button>
            {user && (
              <Button 
                onClick={() => window.location.href = '/support/my-tickets'}
              >
                View My Tickets
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          <CardTitle className="text-2xl">Create Support Ticket</CardTitle>
        </div>
        <CardDescription>
          Describe your issue and we'll help you resolve it as quickly as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guest user fields */}
          {!user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="customerName">Your Name *</Label>
                <Input
                  id="customerName"
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="Enter your full name"
                  className={errors.customerName ? 'border-red-500' : ''}
                />
                {errors.customerName && (
                  <p className="text-sm text-red-600">{errors.customerName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Your Email *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  placeholder="Enter your email address"
                  className={errors.customerEmail ? 'border-red-500' : ''}
                />
                {errors.customerEmail && (
                  <p className="text-sm text-red-600">{errors.customerEmail}</p>
                )}
              </div>
            </div>
          )}

          {/* Category selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select the category that best describes your issue" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Priority selection */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Select "High" or "Urgent" for issues that prevent you from using the service.
            </p>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Brief description of your issue"
              className={errors.subject ? 'border-red-500' : ''}
              maxLength={200}
            />
            {errors.subject && (
              <p className="text-sm text-red-600">{errors.subject}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.subject.length}/200 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Please provide detailed information about your issue. Include any error messages, steps you took, and what you expected to happen."
              className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
              maxLength={2000}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.description.length}/2000 characters
            </p>
          </div>

          {/* Related entities info */}
          {(relatedBookingId || relatedActivityId) && (
            <Alert>
              <AlertDescription>
                This ticket will be automatically linked to your{' '}
                {relatedBookingId ? 'booking' : 'activity'} for faster resolution.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit button */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Create Ticket
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Help text */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Tips for faster resolution:
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Be specific about the problem and when it occurs</li>
            <li>• Include any error messages you see</li>
            <li>• Mention your browser and device type for technical issues</li>
            <li>• Attach screenshots if they help explain the problem</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
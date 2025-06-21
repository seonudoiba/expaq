"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { 
  CheckCircle2, 
  Code, 
  Copy, 
  Eye, 
  FileText, 
  Mail, 
  SaveIcon,
  Upload 
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock email templates data
const emailTemplates = [
  { 
    id: "welcome",
    name: "Welcome Email", 
    subject: "Welcome to ExpAq - Your Account is Ready!",
    body: `Hello {{user.firstName}},

Thank you for joining ExpAq! We're excited to have you as part of our community.

Your account has been successfully created and you're all set to explore unique experiences from local hosts around the world. Here's what you can do now:

1. Complete your profile
2. Browse experiences near you
3. Save your favorite activities
4. Connect with hosts

If you have any questions, please don't hesitate to contact our support team at support@expaq.com.

Happy exploring!

The ExpAq Team
www.expaq.com`,
    category: "user",
    lastModified: "2023-12-01",
    active: true,
  },
  { 
    id: "booking-confirmation",
    name: "Booking Confirmation", 
    subject: "Your ExpAq Booking Confirmation - {{activity.title}}",
    body: `Hello {{user.firstName}},

Great news! Your booking for "{{activity.title}}" has been confirmed.

Booking Details:
- Activity: {{activity.title}}
- Date: {{booking.date}}
- Time: {{booking.time}}
- Host: {{host.name}}
- Participants: {{booking.participants}}
- Location: {{activity.location}}

Please arrive 10 minutes before the scheduled start time. If you need to contact your host, you can reach them at {{host.email}}.

To view your booking details or make changes, visit your bookings dashboard: https://expaq.com/bookings/{{booking.id}}

Enjoy your experience!

The ExpAq Team
www.expaq.com`,
    category: "booking",
    lastModified: "2023-12-05",
    active: true,
  },
  { 
    id: "booking-reminder",
    name: "Booking Reminder", 
    subject: "Reminder: Your ExpAq Experience is Tomorrow!",
    body: `Hello {{user.firstName}},

This is a friendly reminder that your booked experience "{{activity.title}}" is scheduled for tomorrow.

Booking Details:
- Activity: {{activity.title}}
- Date: {{booking.date}}
- Time: {{booking.time}}
- Host: {{host.name}}
- Location: {{activity.location}}

Remember to check any specific instructions or items to bring that your host has provided.

Looking forward to you having a great experience!

The ExpAq Team
www.expaq.com`,
    category: "booking",
    lastModified: "2023-12-10",
    active: true,
  },
  { 
    id: "review-request",
    name: "Review Request", 
    subject: "How was your ExpAq experience?",
    body: `Hello {{user.firstName}},

We hope you enjoyed your recent experience "{{activity.title}}" with {{host.name}}!

Your feedback is valuable to our community. Would you take a moment to share your thoughts and leave a review?

Leave a review here: https://expaq.com/review/{{booking.id}}

Your honest feedback helps other guests find great experiences and helps hosts improve their offerings.

Thank you for being part of our community!

The ExpAq Team
www.expaq.com`,
    category: "review",
    lastModified: "2023-12-15",
    active: true,
  },
  { 
    id: "host-payout",
    name: "Host Payout Notification", 
    subject: "Your ExpAq Payout Has Been Processed",
    body: `Hello {{host.firstName}},

Good news! We've processed your payout of payout.amount for recent bookings on your experience(s).

Payout Details:
- Amount: $payout.amount}}
- Payment Method: {{host.paymentMethod}}
- Reference: {{payout.reference}}
- Expected Arrival: {{payout.expectedDate}}

For a detailed breakdown of this payout, visit your host dashboard: https://expaq.com/host/payouts/{{payout.id}}

Thank you for being an exceptional host on our platform!

The ExpAq Team
www.expaq.com`,
    category: "payment",
    lastModified: "2023-12-20",
    active: true,
  },
  { 
    id: "password-reset",
    name: "Password Reset", 
    subject: "Reset Your ExpAq Password",
    body: `Hello {{user.firstName}},

We received a request to reset your password for your ExpAq account.

To reset your password, click on the link below:
https://expaq.com/reset-password/{{reset.token}}

This link will expire in 24 hours.

If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.

The ExpAq Team
www.expaq.com`,
    category: "user",
    lastModified: "2023-12-25",
    active: true,
  },
];

// Available email variables
const emailVariables = {
  user: [
    { name: "user.firstName", description: "User's first name" },
    { name: "user.lastName", description: "User's last name" },
    { name: "user.email", description: "User's email address" },
    { name: "user.id", description: "User's unique ID" },
  ],
  booking: [
    { name: "booking.id", description: "Booking reference ID" },
    { name: "booking.date", description: "Booking date" },
    { name: "booking.time", description: "Booking time" },
    { name: "booking.participants", description: "Number of participants" },
    { name: "booking.price", description: "Total booking price" },
  ],
  activity: [
    { name: "activity.title", description: "Activity title" },
    { name: "activity.location", description: "Activity location" },
    { name: "activity.duration", description: "Activity duration" },
    { name: "activity.id", description: "Activity unique ID" },
  ],
  host: [
    { name: "host.name", description: "Host's full name" },
    { name: "host.firstName", description: "Host's first name" },
    { name: "host.email", description: "Host's email address" },
    { name: "host.phone", description: "Host's phone number" },
    { name: "host.paymentMethod", description: "Host's selected payment method" },
  ],
  payout: [
    { name: "payout.amount", description: "Payout amount" },
    { name: "payout.reference", description: "Payout reference number" },
    { name: "payout.id", description: "Payout unique ID" },
    { name: "payout.expectedDate", description: "Expected payout arrival date" },
  ],
  reset: [
    { name: "reset.token", description: "Password reset token" },
    { name: "reset.expiry", description: "Token expiration time" },
  ],
};

export default function EmailTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(emailTemplates[0]);
  const [editedSubject, setEditedSubject] = useState(emailTemplates[0].subject);
  const [editedBody, setEditedBody] = useState(emailTemplates[0].body);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Handle template selection change
  const handleTemplateChange = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setEditedSubject(template.subject);
      setEditedBody(template.body);
      setPreviewMode(false);
    }
  };

  // Filter templates by category
  const filteredTemplates = selectedCategory === "all" 
    ? emailTemplates 
    : emailTemplates.filter(t => t.category === selectedCategory);

  // Insert a variable into the email body
  const insertVariable = (variable: string) => {
    setEditedBody(prevBody => prevBody + `{{${variable}}}`);
  };

  // Mock preview data for template variables
  const previewData = {
    "user.firstName": "Alex",
    "user.lastName": "Johnson",
    "user.email": "alex.johnson@example.com",
    "user.id": "user-123456",
    "booking.id": "BK-789012",
    "booking.date": "January 15, 2024",
    "booking.time": "2:00 PM",
    "booking.participants": "2",
    "booking.price": "$125.00",
    "activity.title": "Italian Pasta Making Masterclass",
    "activity.location": "123 Cuisine Ave, San Francisco",
    "activity.duration": "3 hours",
    "activity.id": "ACT-45678",
    "host.name": "Maria Rossi",
    "host.firstName": "Maria",
    "host.email": "maria@example.com",
    "host.phone": "+1 (555) 123-4567",
    "host.paymentMethod": "Direct Deposit",
    "payout.amount": "240.00",
    "payout.reference": "PAY-987654",
    "payout.id": "PYT-123456",
    "payout.expectedDate": "January 18, 2024",
    "reset.token": "abc123xyz789",
    "reset.expiry": "24 hours",
  };

  // Replace variables in template for preview
  const getPreviewText = (text: string) => {
    let previewText = text;
    Object.entries(previewData).forEach(([key, value]) => {
      previewText = previewText.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return previewText;
  };

  // Handle save
  const handleSaveTemplate = () => {
    setIsSaving(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      // Update the selected template with edited values
      setSelectedTemplate({
        ...selectedTemplate,
        subject: editedSubject,
        body: editedBody,
        lastModified: new Date().toISOString().split('T')[0]
      });
      // Clear success message after a few seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Email Templates</h1>
          <p className="text-gray-500">Manage and customize automated email notifications</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="user">User Account</SelectItem>
              <SelectItem value="booking">Bookings</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="review">Reviews</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Template
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <Alert className="bg-green-50 border-green-500 text-green-700 mb-4">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Email template has been successfully updated.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>Select a template to edit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border overflow-hidden max-h-[600px] overflow-y-auto">
                <Table>
                  <TableBody>
                    {filteredTemplates.map((template) => (
                      <TableRow 
                        key={template.id}
                        className={selectedTemplate.id === template.id ? "bg-gray-100" : ""}
                        onClick={() => handleTemplateChange(template.id)}
                      >
                        <TableCell>
                          <div className="flex flex-col cursor-pointer">
                            <span className="font-medium">{template.name}</span>
                            <span className="text-xs text-gray-500">Last updated: {template.lastModified}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={template.active ? "default" : "outline"}>
                                {template.active ? "Active" : "Inactive"}
                              </Badge>
                              <Badge variant="outline">
                                {template.category === "user" && "User Account"}
                                {template.category === "booking" && "Booking"}
                                {template.category === "payment" && "Payment"}
                                {template.category === "review" && "Review"}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Create New Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedTemplate.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={previewMode} 
                  onCheckedChange={setPreviewMode}
                  id="preview-toggle"
                />
                <Label htmlFor="preview-toggle">Preview Mode</Label>
              </div>
            </div>
            <CardDescription>
              Edit email content or preview with sample data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-subject">Email Subject</Label>
                    <Input 
                      id="email-subject"
                      value={previewMode ? getPreviewText(editedSubject) : editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                      disabled={previewMode}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-body">Email Body</Label>
                      {!previewMode && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Code className="mr-2 h-4 w-4" />
                              Insert Variable
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Insert Template Variables</DialogTitle>
                              <DialogDescription>
                                Select a variable to insert into your template
                              </DialogDescription>
                            </DialogHeader>
                            
                            <Tabs defaultValue="user">
                              <TabsList className="grid grid-cols-6">
                                <TabsTrigger value="user">User</TabsTrigger>
                                <TabsTrigger value="booking">Booking</TabsTrigger>
                                <TabsTrigger value="activity">Activity</TabsTrigger>
                                <TabsTrigger value="host">Host</TabsTrigger>
                                <TabsTrigger value="payout">Payout</TabsTrigger>
                                <TabsTrigger value="reset">Reset</TabsTrigger>
                              </TabsList>
                              
                              {Object.keys(emailVariables).map((category) => (
                                <TabsContent key={category} value={category} className="max-h-[300px] overflow-y-auto">
                                  <div className="grid grid-cols-1 gap-2">
                                    {emailVariables[category as keyof typeof emailVariables].map((variable) => (
                                      <div 
                                        key={variable.name} 
                                        className="flex items-center justify-between border rounded p-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => insertVariable(variable.name)}
                                      >
                                        <div>
                                          <div className="font-mono text-sm">{"{{" + variable.name + "}}"}</div>
                                          <div className="text-xs text-gray-500">{variable.description}</div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                          <Copy className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </TabsContent>
                              ))}
                            </Tabs>
                            
                            <DialogFooter>
                              <Button variant="outline" onClick={() => {}}>Close</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    {previewMode ? (
                      <div className="border rounded-md p-4 min-h-[300px] whitespace-pre-wrap">
                        {getPreviewText(editedBody)}
                      </div>
                    ) : (
                      <Textarea 
                        id="email-body"
                        value={editedBody}
                        onChange={(e) => setEditedBody(e.target.value)}
                        className="min-h-[300px] font-mono"
                      />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Send Test Email
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">Reset</Button>
                    <Button 
                      onClick={handleSaveTemplate}
                      disabled={isSaving || previewMode}
                    >
                      {isSaving ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <SaveIcon className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input 
                      id="template-name"
                      defaultValue={selectedTemplate.name}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-category">Category</Label>
                    <Select defaultValue={selectedTemplate.category}>
                      <SelectTrigger id="template-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User Account</SelectItem>
                        <SelectItem value="booking">Booking</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sender-email">Sender Email</Label>
                  <Select defaultValue="notifications@expaq.com">
                    <SelectTrigger id="sender-email">
                      <SelectValue placeholder="Select sender email" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notifications@expaq.com">notifications@expaq.com</SelectItem>
                      <SelectItem value="support@expaq.com">support@expaq.com</SelectItem>
                      <SelectItem value="bookings@expaq.com">bookings@expaq.com</SelectItem>
                      <SelectItem value="noreply@expaq.com">noreply@expaq.com</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sender-name">Sender Name</Label>
                  <Select defaultValue="ExpAq Experiences">
                    <SelectTrigger id="sender-name">
                      <SelectValue placeholder="Select sender name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ExpAq Experiences">ExpAq Experiences</SelectItem>
                      <SelectItem value="ExpAq Support">ExpAq Support</SelectItem>
                      <SelectItem value="ExpAq Bookings">ExpAq Bookings</SelectItem>
                      <SelectItem value="ExpAq Team">ExpAq Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="template-active" 
                      defaultChecked={selectedTemplate.active}
                    />
                    <Label htmlFor="template-active">Template Active</Label>
                  </div>
                </div>
                
                <Alert className="mt-4">
                  <Mail className="h-4 w-4" />
                  <AlertTitle>Automated Email Triggers</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">This template is automatically sent in the following scenarios:</p>
                    <ul className="list-disc ml-5 space-y-1">
                      {selectedTemplate.id === "welcome" && (
                        <li>When a new user completes registration</li>
                      )}
                      {selectedTemplate.id === "booking-confirmation" && (
                        <li>When a user successfully books an activity</li>
                      )}
                      {selectedTemplate.id === "booking-reminder" && (
                        <li>24 hours before a booked activity</li>
                      )}
                      {selectedTemplate.id === "review-request" && (
                        <li>24 hours after a completed activity</li>
                      )}
                      {selectedTemplate.id === "host-payout" && (
                        <li>When a payout is processed to a host</li>
                      )}
                      {selectedTemplate.id === "password-reset" && (
                        <li>When a user requests a password reset</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveTemplate} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

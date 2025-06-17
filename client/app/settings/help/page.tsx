"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { useToast } from "@/components/ui/use-toast";
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageSquare, 
  FileText, 
  Search,
  ArrowRight,
  Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Mock FAQ data
const FAQ_ITEMS = [
  {
    question: "How do I book an activity?",
    answer: "Browse activities on our marketplace, select your preferred date and time, then click 'Book Now'. Follow the checkout process to complete your booking."
  },
  {
    question: "What's the cancellation policy?",
    answer: "Cancellation policies vary by host. You can find the specific policy on each activity listing. Generally, most activities offer full refunds if cancelled 24 hours before the start time."
  },
  {
    question: "How do I become a host?",
    answer: "Click on 'Become a Host' in the navigation menu, complete your profile with the required information, and submit your first activity for approval."
  },
  {
    question: "When do I get paid as a host?",
    answer: "Hosts receive payments 24 hours after the successful completion of their activities. Funds are transferred to the bank account specified in your payment settings."
  },
  {
    question: "How do I contact a host?",
    answer: "You can message hosts directly through the activity listing page or from your bookings page for activities you've already booked."
  }
];

export default function HelpSupportPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    subject: "",
    message: ""
  });

  // Filter FAQ items based on search query
  const filteredFAQs = searchQuery 
    ? FAQ_ITEMS.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FAQ_ITEMS;

  // Handle contact form submission
  const handleSubmitContactForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactFormData.subject || !contactFormData.message) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, you would call your API here
      // Example:
      // await supportService.createTicket({
      //   userId: user.id,
      //   subject: contactFormData.subject,
      //   message: contactFormData.message,
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Support request submitted",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setContactFormData({
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to submit request",
        description: "Please try again later or use an alternative contact method.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Help & Support</h1>
      <p className="text-muted-foreground mb-6">
        Get help with your account, bookings, or hosting activities
      </p>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Contact Support
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search FAQs..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredFAQs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <HelpCircle className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-1">No matching FAQs</h3>
                  <p className="text-muted-foreground text-sm">
                    Try another search term or contact our support team for help.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Send a message to our customer support team
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitContactForm}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        placeholder="Briefly describe your issue"
                        value={contactFormData.subject}
                        onChange={(e) => setContactFormData({ ...contactFormData, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Please provide as much detail as possible"
                        rows={6}
                        value={contactFormData.message}
                        onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit support request
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Other Ways to Get Help</CardTitle>
                  <CardDescription>
                    Alternative support channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">Phone Support</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Call us at <span className="font-medium">1-800-123-4567</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Monday to Friday, 9am - 5pm PST
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">Email Support</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Send us an email at <span className="font-medium">support@expaq.com</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Help Resources</CardTitle>
              <CardDescription>
                Guides, tutorials, and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <h3 className="font-medium mb-1">User Guide</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      A complete guide to using our platform as a guest
                    </p>
                    <Button variant="outline" className="w-full justify-between">
                      Read Guide
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <h3 className="font-medium mb-1">Host Manual</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn how to create and manage activities as a host
                    </p>
                    <Button variant="outline" className="w-full justify-between">
                      Read Manual
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <h3 className="font-medium mb-1">Video Tutorials</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Step-by-step video guides for common tasks
                    </p>
                    <Button variant="outline" className="w-full justify-between">
                      Watch Videos
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <h3 className="font-medium mb-1">Community Forum</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with other users and share experiences
                    </p>
                    <Button variant="outline" className="w-full justify-between">
                      Join Forum
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

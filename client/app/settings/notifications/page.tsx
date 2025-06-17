"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { useToast } from "@/components/ui/use-toast";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Calendar, 
  AlertCircle, 
  Smartphone,
  Loader2
} from "lucide-react";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock notification preferences - in a real app, these would come from your API
const INITIAL_EMAIL_PREFERENCES = {
  marketing: true,
  bookingConfirmations: true,
  bookingReminders: true,
  activityUpdates: true,
  accountAlerts: true,
  newMessages: true,
};

const INITIAL_PUSH_PREFERENCES = {
  bookingConfirmations: true,
  bookingReminders: true,
  activityUpdates: false,
  accountAlerts: true,
  newMessages: true,
};

export default function NotificationSettings() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Email notification states
  const [emailPrefs, setEmailPrefs] = useState(INITIAL_EMAIL_PREFERENCES);
  
  // Push notification states
  const [pushPrefs, setPushPrefs] = useState(INITIAL_PUSH_PREFERENCES);
  
  // Email frequency state
  const [emailFrequency, setEmailFrequency] = useState("instantly");

  // Toggle handler for email preferences
  const toggleEmailPref = (key: keyof typeof INITIAL_EMAIL_PREFERENCES) => {
    setEmailPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle handler for push preferences
  const togglePushPref = (key: keyof typeof INITIAL_PUSH_PREFERENCES) => {
    setPushPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Save notification preferences
  const savePreferences = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, you would call your API here
      // Example:
      // await userService.updateNotificationPreferences({
      //   email: emailPrefs,
      //   push: pushPrefs,
      //   emailFrequency
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save preferences",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Notification Preferences</h1>
      <p className="text-muted-foreground mb-6">
        Customize how and when we notify you
      </p>

      <Tabs defaultValue="email" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="push" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Push Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Control which emails you'd like to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-emails">Marketing emails</Label>
                  <p className="text-sm text-muted-foreground">Promotions, discounts, and newsletters</p>
                </div>
                <Switch 
                  id="marketing-emails" 
                  checked={emailPrefs.marketing} 
                  onCheckedChange={() => toggleEmailPref("marketing")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="booking-confirmations">Booking confirmations</Label>
                  <p className="text-sm text-muted-foreground">Receive confirmations when you book an activity</p>
                </div>
                <Switch 
                  id="booking-confirmations" 
                  checked={emailPrefs.bookingConfirmations} 
                  onCheckedChange={() => toggleEmailPref("bookingConfirmations")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="booking-reminders">Booking reminders</Label>
                  <p className="text-sm text-muted-foreground">Reminders about upcoming activities</p>
                </div>
                <Switch 
                  id="booking-reminders" 
                  checked={emailPrefs.bookingReminders} 
                  onCheckedChange={() => toggleEmailPref("bookingReminders")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="activity-updates">Activity updates</Label>
                  <p className="text-sm text-muted-foreground">Changes or updates to activities you've booked</p>
                </div>
                <Switch 
                  id="activity-updates" 
                  checked={emailPrefs.activityUpdates} 
                  onCheckedChange={() => toggleEmailPref("activityUpdates")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="account-alerts">Account alerts</Label>
                  <p className="text-sm text-muted-foreground">Important information about your account</p>
                </div>
                <Switch 
                  id="account-alerts" 
                  checked={emailPrefs.accountAlerts} 
                  onCheckedChange={() => toggleEmailPref("accountAlerts")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-messages">New messages</Label>
                  <p className="text-sm text-muted-foreground">Notifications about new messages from hosts</p>
                </div>
                <Switch 
                  id="new-messages" 
                  checked={emailPrefs.newMessages} 
                  onCheckedChange={() => toggleEmailPref("newMessages")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <div className="space-y-1">
                  <Label htmlFor="email-frequency">Email frequency</Label>
                  <Select 
                    value={emailFrequency} 
                    onValueChange={setEmailFrequency}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instantly">Send instantly</SelectItem>
                      <SelectItem value="daily">Daily digest</SelectItem>
                      <SelectItem value="weekly">Weekly digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={savePreferences} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save preferences
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="push">
          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>Manage push notifications to your devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-booking-confirms">Booking confirmations</Label>
                  <p className="text-sm text-muted-foreground">Instant notifications when your booking is confirmed</p>
                </div>
                <Switch 
                  id="push-booking-confirms" 
                  checked={pushPrefs.bookingConfirmations} 
                  onCheckedChange={() => togglePushPref("bookingConfirmations")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-reminders">Booking reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminders before your scheduled activities</p>
                </div>
                <Switch 
                  id="push-reminders" 
                  checked={pushPrefs.bookingReminders} 
                  onCheckedChange={() => togglePushPref("bookingReminders")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-activity-updates">Activity updates</Label>
                  <p className="text-sm text-muted-foreground">Changes or updates to activities you've booked</p>
                </div>
                <Switch 
                  id="push-activity-updates" 
                  checked={pushPrefs.activityUpdates} 
                  onCheckedChange={() => togglePushPref("activityUpdates")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-account-alerts">Account alerts</Label>
                  <p className="text-sm text-muted-foreground">Important security and account alerts</p>
                </div>
                <Switch 
                  id="push-account-alerts" 
                  checked={pushPrefs.accountAlerts} 
                  onCheckedChange={() => togglePushPref("accountAlerts")}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-messages">New messages</Label>
                  <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
                </div>
                <Switch 
                  id="push-messages" 
                  checked={pushPrefs.newMessages} 
                  onCheckedChange={() => togglePushPref("newMessages")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={savePreferences} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

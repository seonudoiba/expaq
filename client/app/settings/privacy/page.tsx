"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { useToast } from "@/components/ui/use-toast";
import { 
  Shield, 
  Lock, 
  Key, 
  Smartphone, 
  Loader2, 
  EyeOff, 
  Globe,
  LogIn
} from "lucide-react";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock security settings - in a real app, these would come from your API
const INITIAL_PRIVACY_SETTINGS = {
  showProfileToPublic: true,
  showActivityHistory: true,
  allowSearchEngines: true,
  shareDataForPersonalization: true
};

export default function PrivacySettings() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isTwoFALoading, setIsTwoFALoading] = useState(false);
  const [isConfirmingPhone, setIsConfirmingPhone] = useState(false);
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState(INITIAL_PRIVACY_SETTINGS);
  
  // Two-factor authentication state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // Login history state
  const [loginHistory, setLoginHistory] = useState([
    {
      id: "login_1",
      device: "Chrome on Windows",
      location: "Seattle, USA",
      ip: "192.168.1.1",
      time: "2025-06-16T14:30:00Z",
      status: "success"
    },
    {
      id: "login_2",
      device: "Safari on iPhone",
      location: "Seattle, USA",
      ip: "192.168.1.2",
      time: "2025-06-15T09:45:00Z",
      status: "success"
    },
    {
      id: "login_3",
      device: "Firefox on Mac",
      location: "Portland, USA",
      ip: "192.168.2.1",
      time: "2025-06-14T18:20:00Z",
      status: "success"
    },
    {
      id: "login_4",
      device: "Unknown Device",
      location: "Beijing, China",
      ip: "203.0.113.1",
      time: "2025-06-14T03:15:00Z",
      status: "blocked"
    }
  ]);

  // Toggle handler for privacy settings
  const togglePrivacySetting = (key: keyof typeof INITIAL_PRIVACY_SETTINGS) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Save privacy settings
  const savePrivacySettings = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, you would call your API here
      // Example:
      // await userService.updatePrivacySettings(privacySettings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save settings",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Setup two-factor authentication
  const setupTwoFactorAuth = async () => {
    setIsTwoFALoading(true);
    
    try {
      // In a real app, you would:
      // 1. Call API to initiate 2FA setup
      // 2. Send verification code to the provided phone number
      // 3. Show verification code input field
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (phoneNumber) {
        setIsConfirmingPhone(true);
      } else {
        toast({
          variant: "destructive",
          title: "Phone number required",
          description: "Please enter a valid phone number.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to setup 2FA",
        description: "Please try again later.",
      });
    } finally {
      setIsTwoFALoading(false);
    }
  };

  // Verify phone number for 2FA
  const verifyPhoneFor2FA = async () => {
    setIsTwoFALoading(true);
    
    try {
      // In a real app, you would validate the verification code with your API
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (verificationCode === "123456") { // Mock verification code
        setTwoFactorEnabled(true);
        setIsConfirmingPhone(false);
        toast({
          title: "Two-factor authentication enabled",
          description: "Your account is now more secure.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid code",
          description: "The verification code you entered is incorrect.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "Please try again later.",
      });
    } finally {
      setIsTwoFALoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Privacy & Security</h1>
      <p className="text-muted-foreground mb-6">
        Manage your privacy preferences and account security
      </p>

      <div className="space-y-8">
        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <EyeOff className="h-5 w-5 text-primary" />
              <CardTitle>Privacy Settings</CardTitle>
            </div>
            <CardDescription>Control how your information is shared and used</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-profile">Public Profile</Label>
                <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
              </div>
              <Switch 
                id="public-profile" 
                checked={privacySettings.showProfileToPublic} 
                onCheckedChange={() => togglePrivacySetting("showProfileToPublic")}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="activity-history">Activity History</Label>
                <p className="text-sm text-muted-foreground">Show your activity history on your profile</p>
              </div>
              <Switch 
                id="activity-history" 
                checked={privacySettings.showActivityHistory} 
                onCheckedChange={() => togglePrivacySetting("showActivityHistory")}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="search-engines">Search Engine Indexing</Label>
                <p className="text-sm text-muted-foreground">Allow search engines to index your public profile</p>
              </div>
              <Switch 
                id="search-engines" 
                checked={privacySettings.allowSearchEngines} 
                onCheckedChange={() => togglePrivacySetting("allowSearchEngines")}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="data-personalization">Data for Personalization</Label>
                <p className="text-sm text-muted-foreground">Allow us to use your data for personalized recommendations</p>
              </div>
              <Switch 
                id="data-personalization" 
                checked={privacySettings.shareDataForPersonalization} 
                onCheckedChange={() => togglePrivacySetting("shareDataForPersonalization")}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={savePrivacySettings} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save privacy settings
            </Button>
          </CardFooter>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Two-Factor Authentication</CardTitle>
            </div>
            <CardDescription>Add an extra layer of security to your account</CardDescription>
          </CardHeader>
          <CardContent>
            {!twoFactorEnabled ? (
              <div className="space-y-4">
                {!isConfirmingPhone ? (
                  <>
                    <p className="text-sm">
                      Two-factor authentication adds an additional layer of security by requiring access to your phone in addition to your password.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <Input
                        id="phone-number"
                        placeholder="+1 (555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        We&apos;ll send a verification code to this number.
                      </p>
                    </div>
                    <Button onClick={setupTwoFactorAuth} disabled={isTwoFALoading}>
                      {isTwoFALoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Set up two-factor authentication
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm">
                      We&apos;ve sent a verification code to {phoneNumber}. Enter it below to enable two-factor authentication.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="verification-code">Verification Code</Label>
                      <Input
                        id="verification-code"
                        placeholder="123456"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Hint: Enter &quot;123456&quot; for this demo
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={verifyPhoneFor2FA} disabled={isTwoFALoading}>
                        {isTwoFALoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify code
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsConfirmingPhone(false)}
                        disabled={isTwoFALoading}
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-900">
                  <div className="mr-4">
                    <Shield className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Two-factor authentication is enabled</h3>
                    <p className="text-sm text-muted-foreground">Your account has an extra layer of security</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="flex items-center justify-between px-3 py-2 border rounded-md">
                    <span>{phoneNumber}</span>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Disable two-factor authentication
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove the additional security from your account. We strongly recommend keeping two-factor authentication enabled.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          setTwoFactorEnabled(false);
                          toast({
                            title: "Two-factor authentication disabled",
                            description: "Your account security has been reduced.",
                          });
                        }}
                      >
                        Disable
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Login History */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-primary" />
              <CardTitle>Login Activity</CardTitle>
            </div>
            <CardDescription>Recent logins to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                If you see any suspicious activity, change your password immediately and contact support.
              </div>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="px-4 py-2 text-left">Device & Browser</th>
                        <th className="px-4 py-2 text-left">Location</th>
                        <th className="px-4 py-2 text-left">Date & Time</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loginHistory.map((login) => (
                        <tr key={login.id} className="border-b">
                          <td className="px-4 py-3">{login.device}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              <span>{login.location}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">{formatDate(login.time)}</td>
                          <td className="px-4 py-3">
                            {login.status === "success" ? (
                              <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/20 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                                Success
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-red-50 dark:bg-red-900/20 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-400">
                                Blocked
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

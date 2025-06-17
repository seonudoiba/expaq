"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useToast } from "@/components/ui/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

// Password change schema with validation
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must include uppercase, lowercase, number and special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Email change schema
const emailSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required to confirm this change"),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type EmailFormValues = z.infer<typeof emailSchema>;

export default function AccountSettings() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  
  // Password change form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Email change form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      newEmail: "",
      password: "",
    },
  });

  // Handle password change
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsChangingPassword(true);
    
    try {
      // In a real app, you would call your API here
      // Example:
      // await authService.changePassword({
      //   currentPassword: data.currentPassword,
      //   newPassword: data.newPassword,
      // });
      
      // For demo purposes, just show a success toast
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });
      
      passwordForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please check your current password and try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle email change
  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsChangingEmail(true);
    
    try {
      // In a real app, you would call your API here
      // Example:
      // await authService.changeEmail({
      //   newEmail: data.newEmail,
      //   password: data.password,
      // });
      
      // For demo purposes, just show a success toast
      toast({
        title: "Email change requested",
        description: "Please check your new email for a confirmation link.",
      });
      
      emailForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request email change. Please check your password and try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingEmail(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Account Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account security and login details
        </p>
      </div>

      <Separator className="my-6" />

      {/* Current Email Display */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Email Address</CardTitle>
          <CardDescription>Your current email address is {user.email}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Change Email</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Email Address</DialogTitle>
                <DialogDescription>
                  Enter your new email address and current password to confirm the change.
                </DialogDescription>
              </DialogHeader>

              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                  className="space-y-4 py-4"
                >
                  <FormField
                    control={emailForm.control}
                    name="newEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="new.email@example.com" 
                            type="email" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter your current password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          We need your password to confirm this change
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="pt-4">
                    <Button type="submit" disabled={isChangingEmail}>
                      {isChangingEmail ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Change Email"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      {/* Password Change */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Password</CardTitle>
          <CardDescription>
            Change your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your current password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your new password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Password must contain at least 8 characters, including uppercase,
                      lowercase, numbers, and special characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Confirm your new password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>      {/* Account Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Account Status</CardTitle>
          <CardDescription>
            Information about your account status and type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Account Type</h3>
            <div className="flex gap-2 items-center">
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {user.roles?.some((role) => role.name === "HOST") ? "Host" : "Guest"}
              </div>
              {user.roles?.some((role) => role.name === "HOST") && (
                <p className="text-sm text-muted-foreground">
                  You&apos;re registered as a host and can create activities
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Member Since</h3>
            <p className="text-sm">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {!user.roles?.some((role) => role.name === "HOST") && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Want to become a host?</AlertTitle>
              <AlertDescription>
                Become a host to create and manage your own activities.
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => window.location.href = "/become-a-host"}
                >
                  Learn more about becoming a host
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      {/* Account Deletion */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-xl text-destructive">Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This action cannot be undone. All your data, including profile information, bookings, and hosted activities will be permanently removed.
            </AlertDescription>
          </Alert>
          
          <p className="text-sm text-muted-foreground mb-4">
            Before deleting your account:
          </p>
          <ul className="list-disc pl-5 mb-4 text-sm space-y-1">
            <li>Cancel any upcoming bookings or hosted activities</li>
            <li>Download any data you want to keep</li>
            <li>Resolve any outstanding payments or refunds</li>
          </ul>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="py-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="text" 
                      placeholder="Type 'delete my account' to confirm" 
                      className="border-destructive" 
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter &quot;delete my account&quot; to confirm deletion
                  </p>
                </div>
              </div>
              
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    // In a real app, call your API to delete the account
                    // Example:
                    // await authService.deleteAccount();
                    // logout();
                    // router.push("/");
                    
                    toast({
                      title: "Account deletion requested",
                      description: "Your account deletion request has been submitted.",
                    });
                  }}
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}

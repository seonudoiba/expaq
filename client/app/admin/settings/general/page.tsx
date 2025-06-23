"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, InfoIcon, SaveIcon } from "lucide-react";
import { Checkbox } from "@radix-ui/react-checkbox";

export default function PlatformSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Mock form submission
  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      // Clear success message after a few seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? (
            <>Saving Changes...</>
          ) : (
            <>
              <SaveIcon className="mr-2 h-4 w-4" />
              Save All Changes
            </>
          )}
        </Button>
      </div>

      {saveSuccess && (
        <Alert className="bg-green-50 border-green-500 text-green-700 mb-4">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your platform settings have been successfully updated.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="fees">Fees & Commission</TabsTrigger>
          <TabsTrigger value="emails">Email Templates</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Platform Settings</CardTitle>
              <CardDescription>
                Configure core platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Platform Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" defaultValue="ExpAq" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-url">Platform URL</Label>
                    <Input id="platform-url" defaultValue="https://expaq.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input
                      id="support-email"
                      defaultValue="support@expaq.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-phone">Business Phone</Label>
                    <Input
                      id="business-phone"
                      defaultValue="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Regional Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-currency">Default Currency</Label>
                    <Select defaultValue="USD">
                      <SelectTrigger id="default-currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-language">Default Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="default-language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="MM/DD/YYYY">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-zone">Default Time Zone</Label>
                    <Select defaultValue="UTC-8">
                      <SelectTrigger id="time-zone">
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">
                          Pacific Time (UTC-8)
                        </SelectItem>
                        <SelectItem value="UTC-5">
                          Eastern Time (UTC-5)
                        </SelectItem>
                        <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                        <SelectItem value="UTC+1">
                          Central European (UTC+1)
                        </SelectItem>
                        <SelectItem value="UTC+9">Japan (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Platform Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reviews-enabled">Enable Reviews</Label>
                      <p className="text-sm text-gray-500">
                        Allow users to leave reviews for activities
                      </p>
                    </div>
                    <Switch id="reviews-enabled" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="messaging-enabled">
                        Enable Messaging
                      </Label>
                      <p className="text-sm text-gray-500">
                        Allow users to message hosts
                      </p>
                    </div>
                    <Switch id="messaging-enabled" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="instant-booking-enabled">
                        Enable Instant Booking
                      </Label>
                      <p className="text-sm text-gray-500">
                        Allow immediate booking without host approval
                      </p>
                    </div>
                    <Switch id="instant-booking-enabled" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="waitlist-enabled">Enable Waitlists</Label>
                      <p className="text-sm text-gray-500">
                        Allow users to join waitlists for full activities
                      </p>
                    </div>
                    <Switch id="waitlist-enabled" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Settings Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Platform Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the ExpAq platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Brand Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="logo-upload">Platform Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                        <img
                          src="/expaqlogo.png"
                          alt="Current logo"
                          className="max-h-12 max-w-12"
                        />
                      </div>
                      <div className="flex-1">
                        <Input id="logo-upload" type="file" />
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended size: 200x50px, PNG or SVG
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="favicon-upload">Favicon</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center">
                        <img
                          src="/favicon.ico"
                          alt="Current favicon"
                          className="max-h-6 max-w-6"
                        />
                      </div>
                      <div className="flex-1">
                        <Input id="favicon-upload" type="file" />
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended size: 32x32px, ICO or PNG
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Color Scheme</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary-color-picker"
                        type="color"
                        defaultValue="#0088FE"
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        id="primary-color"
                        defaultValue="#0088FE"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary-color-picker"
                        type="color"
                        defaultValue="#00C49F"
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        id="secondary-color"
                        defaultValue="#00C49F"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accent-color-picker"
                        type="color"
                        defaultValue="#FFBB28"
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        id="accent-color"
                        defaultValue="#FFBB28"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Homepage Settings</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero-image-upload">Hero Image</Label>
                    <div className="flex flex-col gap-4">
                      <div className="h-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        <img
                          src="/hero.jpg"
                          alt="Current hero image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Input id="hero-image-upload" type="file" />
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended size: 1920x1080px
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-headline">Hero Headline</Label>
                    <Input
                      id="hero-headline"
                      defaultValue="Discover Unique Experiences Around the World"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-subheading">Hero Subheading</Label>
                    <Input
                      id="hero-subheading"
                      defaultValue="Connect with local hosts and find authentic activities"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="featured-category">Featured Category</Label>
                    <Select defaultValue="cooking">
                      <SelectTrigger id="featured-category">
                        <SelectValue placeholder="Select featured category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cooking">Cooking Classes</SelectItem>
                        <SelectItem value="tours">City Tours</SelectItem>
                        <SelectItem value="language">
                          Language Exchange
                        </SelectItem>
                        <SelectItem value="outdoor">
                          Outdoor Adventures
                        </SelectItem>
                        <SelectItem value="art">Art & Crafts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Fees & Commission Tab */}
        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Fees & Commission Structure</CardTitle>
              <CardDescription>
                Configure platform fees, host commissions and payment settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Changes to fee structures will only apply to new bookings
                  after the changes are saved. Existing bookings will continue
                  to use the previous fee structure.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Guest Fees</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guest-fee-type">Guest Fee Type</Label>
                    <Select defaultValue="percentage">
                      <SelectTrigger id="guest-fee-type">
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="mixed">Mixed (% + Fixed)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest-fee-percentage">
                      Guest Fee Percentage
                    </Label>
                    <div className="flex items-center">
                      <Input
                        id="guest-fee-percentage"
                        type="number"
                        defaultValue="5.0"
                        min="0"
                        step="0.1"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Host Fees</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="host-fee-type">Host Fee Type</Label>
                    <Select defaultValue="percentage">
                      <SelectTrigger id="host-fee-type">
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="mixed">Mixed (% + Fixed)</SelectItem>
                        <SelectItem value="tiered">
                          Tiered Percentage
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="host-fee-percentage">
                      Host Fee Percentage
                    </Label>
                    <div className="flex items-center">
                      <Input
                        id="host-fee-percentage"
                        type="number"
                        defaultValue="15.0"
                        min="0"
                        step="0.1"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4 mt-2">
                  <h4 className="font-medium mb-2">
                    Tiered Host Fee Structure (Optional)
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="tier1-to">Up to</Label>
                        <div className="flex items-center mt-1">
                          <span className="mr-1">$</span>
                          <Input id="tier1-to" defaultValue="500" />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="tier1-fee">Fee Percentage</Label>
                        <div className="flex items-center mt-1">
                          <Input id="tier1-fee" defaultValue="18" />
                          <span className="ml-1">%</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="tier2-from">$500 to</Label>
                        <div className="flex items-center mt-1">
                          <span className="mr-1">$</span>
                          <Input id="tier2-to" defaultValue="1000" />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="tier2-fee">Fee Percentage</Label>
                        <div className="flex items-center mt-1">
                          <Input id="tier2-fee" defaultValue="15" />
                          <span className="ml-1">%</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="tier3-from">$1000 to</Label>
                        <div className="flex items-center mt-1">
                          <span className="mr-1">$</span>
                          <Input id="tier3-to" defaultValue="5000" />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="tier3-fee">Fee Percentage</Label>
                        <div className="flex items-center mt-1">
                          <Input id="tier3-fee" defaultValue="12" />
                          <span className="ml-1">%</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Above $5000</Label>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="tier4-fee">Fee Percentage</Label>
                        <div className="flex items-center mt-1">
                          <Input id="tier4-fee" defaultValue="10" />
                          <span className="ml-1">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-schedule">
                      Host Payment Schedule
                    </Label>
                    <Select defaultValue="after-24h">
                      <SelectTrigger id="payment-schedule">
                        <SelectValue placeholder="Select payment schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediately">
                          Immediately after activity
                        </SelectItem>
                        <SelectItem value="after-24h">
                          24 hours after activity
                        </SelectItem>
                        <SelectItem value="weekly">Weekly payout</SelectItem>
                        <SelectItem value="monthly">Monthly payout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-payout">Minimum Payout Amount</Label>
                    <div className="flex items-center">
                      <span className="mr-1">$</span>
                      <Input
                        id="min-payout"
                        type="number"
                        defaultValue="50"
                        min="0"
                        step="10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-methods">
                      Supported Payment Methods
                    </Label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="payment-cc" defaultChecked />
                        <Label htmlFor="payment-cc">Credit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="payment-paypal" defaultChecked />
                        <Label htmlFor="payment-paypal">PayPal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="payment-bank" defaultChecked />
                        <Label htmlFor="payment-bank">Bank Transfer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="payment-wallet" />
                        <Label htmlFor="payment-wallet">
                          Digital Wallet (Apple/Google Pay)
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cancellation-policy">
                      Default Cancellation Policy
                    </Label>
                    <Select defaultValue="flexible">
                      <SelectTrigger id="cancellation-policy">
                        <SelectValue placeholder="Select cancellation policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flexible">
                          Flexible (24 hours before)
                        </SelectItem>
                        <SelectItem value="moderate">
                          Moderate (5 days before)
                        </SelectItem>
                        <SelectItem value="strict">
                          Strict (7 days before)
                        </SelectItem>
                        <SelectItem value="super-strict">
                          Super Strict (30 days before)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="emails">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Configure automated email templates for the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sender-email">Sender Email Address</Label>
                    <Input
                      id="sender-email"
                      defaultValue="notifications@expaq.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender-name">Sender Name</Label>
                    <Input id="sender-name" defaultValue="ExpAq Experiences" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reply-to-email">
                      Reply-to Email Address
                    </Label>
                    <Input
                      id="reply-to-email"
                      defaultValue="support@expaq.com"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Email Templates</h3>
                  <Select defaultValue="welcome">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome Email</SelectItem>
                      <SelectItem value="booking-confirmation">
                        Booking Confirmation
                      </SelectItem>
                      <SelectItem value="booking-reminder">
                        Booking Reminder
                      </SelectItem>
                      <SelectItem value="review-request">
                        Review Request
                      </SelectItem>
                      <SelectItem value="host-payout">Host Payout</SelectItem>
                      <SelectItem value="password-reset">
                        Password Reset
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-md p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-subject">Email Subject</Label>
                      <Input
                        id="email-subject"
                        defaultValue="Welcome to ExpAq - Your Account is Ready!"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-body">Email Body</Label>
                      <Textarea
                        id="email-body"
                        className="min-h-[300px]"
                        defaultValue={`Hello {{user.firstName}},

Thank you for joining ExpAq! We're excited to have you as part of our community.

Your account has been successfully created and you're all set to explore unique experiences from local hosts around the world. Here's what you can do now:

1. Complete your profile
2. Browse experiences near you
3. Save your favorite activities
4. Connect with hosts

If you have any questions, please don't hesitate to contact our support team at support@expaq.com.

Happy exploring!

The ExpAq Team
www.expaq.com`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Available Variables</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <div className="text-sm bg-gray-100 p-2 rounded">
                          {"{{user.firstName}}"}
                        </div>
                        <div className="text-sm bg-gray-100 p-2 rounded">
                          {"{{user.lastName}}"}
                        </div>
                        <div className="text-sm bg-gray-100 p-2 rounded">
                          {"{{user.email}}"}
                        </div>
                        <div className="text-sm bg-gray-100 p-2 rounded">
                          {"{{booking.id}}"}
                        </div>
                        <div className="text-sm bg-gray-100 p-2 rounded">
                          {"{{activity.title}}"}
                        </div>
                        <div className="text-sm bg-gray-100 p-2 rounded">
                          {"{{host.name}}"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-gray-500">
                        Send promotional emails to users
                      </p>
                    </div>
                    <Switch id="marketing-emails" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reminder-emails">Booking Reminders</Label>
                      <p className="text-sm text-gray-500">
                        Send booking reminder emails
                      </p>
                    </div>
                    <Switch id="reminder-emails" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="review-emails">Review Requests</Label>
                      <p className="text-sm text-gray-500">
                        Send emails requesting reviews after activities
                      </p>
                    </div>
                    <Switch id="review-emails" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newsletter">Weekly Newsletter</Label>
                      <p className="text-sm text-gray-500">
                        Send weekly newsletter with featured activities
                      </p>
                    </div>
                    <Switch id="newsletter" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, SaveIcon, DollarSign, PercentIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function FeesSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Mock commission tiers for different activity categories
  const categoryCommissions = [
    { category: "Cooking Classes", guestFee: 5, hostFee: 15, promoRate: false },
    { category: "City Tours", guestFee: 5, hostFee: 15, promoRate: false },
    { category: "Language Exchange", guestFee: 4, hostFee: 12, promoRate: true },
    { category: "Outdoor Adventures", guestFee: 6, hostFee: 18, promoRate: false },
    { category: "Art & Crafts", guestFee: 5, hostFee: 15, promoRate: false },
    { category: "Music & Dance", guestFee: 5, hostFee: 15, promoRate: false },
    { category: "Wellness", guestFee: 4, hostFee: 12, promoRate: true },
  ];

  // Mock fee history
  const feeHistory = [
    { 
      id: 1, 
      date: "2023-12-01", 
      guestFee: 5, 
      hostFee: 15, 
      minPayout: 50,
      modifiedBy: "John Admin",
      notes: "Standard fee increase"
    },
    { 
      id: 2, 
      date: "2023-09-01", 
      guestFee: 4.5, 
      hostFee: 14, 
      minPayout: 50,
      modifiedBy: "Sarah Manager",
      notes: "Seasonal adjustment"
    },
    { 
      id: 3, 
      date: "2023-06-01", 
      guestFee: 4, 
      hostFee: 13, 
      minPayout: 25,
      modifiedBy: "John Admin",
      notes: "Initial fee structure"
    },
  ];

  // Mock payment provider fees
  const paymentProviderFees = [
    { provider: "Credit Card", fee: 2.9, fixedFee: 0.30 },
    { provider: "PayPal", fee: 3.5, fixedFee: 0.25 },
    { provider: "Bank Transfer", fee: 1.0, fixedFee: 0.0 },
    { provider: "Digital Wallet", fee: 2.5, fixedFee: 0.15 },
  ];

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
        <div>
          <h1 className="text-2xl font-bold">Fees & Commission Settings</h1>
          <p className="text-gray-500">Manage platform fees, host commissions, and payment settings</p>
        </div>
        <Button 
          onClick={handleSaveSettings} 
          disabled={isSaving}
        >
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
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Fee and commission settings have been successfully updated.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="global">Global Fees</TabsTrigger>
          <TabsTrigger value="category">Category-Specific</TabsTrigger>
          <TabsTrigger value="history">Fee History</TabsTrigger>
          <TabsTrigger value="providers">Payment Providers</TabsTrigger>
        </TabsList>
        
        {/* Global Fees Tab */}
        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle>Global Fee Structure</CardTitle>
              <CardDescription>Configure default platform fees and host commissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Changes to global fee structures will apply to all new bookings after the changes are saved.
                  These settings can be overridden at the category level.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Standard Fee Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Guest Fees
                      </CardTitle>
                      <CardDescription>
                        Fees charged to guests when booking activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="guest-fee-type">Fee Type</Label>
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
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="guest-fee-percentage">Percentage Fee</Label>
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
                          <div className="space-y-2">
                            <Label htmlFor="guest-fee-fixed">Fixed Fee</Label>
                            <div className="flex items-center">
                              <span className="mr-1">$</span>
                              <Input 
                                id="guest-fee-fixed" 
                                type="number" 
                                defaultValue="0.00" 
                                min="0" 
                                step="0.01" 
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="guest-fee-max">Maximum Fee Cap (Optional)</Label>
                          <div className="flex items-center">
                            <span className="mr-1">$</span>
                            <Input 
                              id="guest-fee-max" 
                              type="number" 
                              defaultValue="25.00" 
                              min="0" 
                              step="0.01" 
                              placeholder="No maximum"
                            />
                          </div>
                          <p className="text-xs text-gray-500">Leave empty for no maximum cap</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <PercentIcon className="h-4 w-4 mr-2" />
                        Host Commission
                      </CardTitle>
                      <CardDescription>
                        Commission charged to hosts for each booking
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="host-fee-type">Fee Type</Label>
                          <Select defaultValue="percentage">
                            <SelectTrigger id="host-fee-type">
                              <SelectValue placeholder="Select fee type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="fixed">Fixed Amount</SelectItem>
                              <SelectItem value="mixed">Mixed (% + Fixed)</SelectItem>
                              <SelectItem value="tiered">Tiered Percentage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="host-fee-percentage">Percentage Fee</Label>
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
                          <div className="space-y-2">
                            <Label htmlFor="host-fee-fixed">Fixed Fee</Label>
                            <div className="flex items-center">
                              <span className="mr-1">$</span>
                              <Input 
                                id="host-fee-fixed" 
                                type="number" 
                                defaultValue="0.00" 
                                min="0" 
                                step="0.01" 
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="host-fee-min">Minimum Fee (Optional)</Label>
                          <div className="flex items-center">
                            <span className="mr-1">$</span>
                            <Input 
                              id="host-fee-min" 
                              type="number" 
                              defaultValue="2.50" 
                              min="0" 
                              step="0.01" 
                            />
                          </div>
                          <p className="text-xs text-gray-500">Minimum fee per booking</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tiered Host Commission Structure</h3>
                <p className="text-sm text-gray-500">
                  Configure tiered commission rates based on booking value. Only applies if "Tiered Percentage" 
                  is selected as the host fee type.
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-8 gap-4">
                    <div className="col-span-3 text-sm font-medium">Booking Value Range</div>
                    <div className="col-span-2 text-sm font-medium">Commission Rate</div>
                    <div className="col-span-3 text-sm font-medium">Additional Notes</div>
                  </div>

                  <div className="grid grid-cols-8 gap-4 items-center">
                    <div className="col-span-3 flex items-center gap-2">
                      <span>$0 to</span>
                      <div className="flex items-center flex-1">
                        <span className="mr-1">$</span>
                        <Input id="tier1-to" defaultValue="500" />
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-1">
                      <Input id="tier1-fee" defaultValue="18" />
                      <span>%</span>
                    </div>
                    <div className="col-span-3">
                      <Input id="tier1-notes" defaultValue="Standard rate for small bookings" />
                    </div>
                  </div>

                  <div className="grid grid-cols-8 gap-4 items-center">
                    <div className="col-span-3 flex items-center gap-2">
                      <span>$500 to</span>
                      <div className="flex items-center flex-1">
                        <span className="mr-1">$</span>
                        <Input id="tier2-to" defaultValue="1000" />
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-1">
                      <Input id="tier2-fee" defaultValue="15" />
                      <span>%</span>
                    </div>
                    <div className="col-span-3">
                      <Input id="tier2-notes" defaultValue="Medium value bookings" />
                    </div>
                  </div>

                  <div className="grid grid-cols-8 gap-4 items-center">
                    <div className="col-span-3 flex items-center gap-2">
                      <span>$1000 to</span>
                      <div className="flex items-center flex-1">
                        <span className="mr-1">$</span>
                        <Input id="tier3-to" defaultValue="5000" />
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-1">
                      <Input id="tier3-fee" defaultValue="12" />
                      <span>%</span>
                    </div>
                    <div className="col-span-3">
                      <Input id="tier3-notes" defaultValue="High value bookings" />
                    </div>
                  </div>

                  <div className="grid grid-cols-8 gap-4 items-center">
                    <div className="col-span-3">
                      <span>Above $5000</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1">
                      <Input id="tier4-fee" defaultValue="10" />
                      <span>%</span>
                    </div>
                    <div className="col-span-3">
                      <Input id="tier4-notes" defaultValue="Premium bookings" />
                    </div>
                  </div>

                  <Button variant="outline" className="mt-2">
                    Add Tier
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-schedule">Host Payment Schedule</Label>
                    <Select defaultValue="after-24h">
                      <SelectTrigger id="payment-schedule">
                        <SelectValue placeholder="Select payment schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediately">Immediately after activity</SelectItem>
                        <SelectItem value="after-24h">24 hours after activity</SelectItem>
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
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="absorb-fees" />
                    <Label htmlFor="absorb-fees">Platform absorbs payment processing fees</Label>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">
                    If checked, the platform will absorb payment processing fees rather than passing them to hosts.
                  </p>

                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox id="allow-custom-fees" />
                    <Label htmlFor="allow-custom-fees">Allow custom fee negotiation for enterprise hosts</Label>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">
                    If checked, administrators can set custom fee arrangements for select enterprise hosts.
                  </p>
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
        
        {/* Category-Specific Tab */}
        <TabsContent value="category">
          <Card>
            <CardHeader>
              <CardTitle>Category-Specific Fee Structure</CardTitle>
              <CardDescription>Configure custom fees for specific activity categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Custom Fee Structure</AlertTitle>
                <AlertDescription>
                  These settings override the global fee structure for specific activity categories.
                  Leave fields blank to use the global default settings.
                </AlertDescription>
              </Alert>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity Category</TableHead>
                      <TableHead>Guest Fee (%)</TableHead>
                      <TableHead>Host Commission (%)</TableHead>
                      <TableHead>Promotional Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryCommissions.map((category, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{category.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center w-20">
                            <Input 
                              type="number" 
                              value={category.guestFee} 
                              min="0" 
                              step="0.1"
                              className="w-full" 
                            />
                            <span className="ml-2">%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center w-20">
                            <Input 
                              type="number" 
                              value={category.hostFee} 
                              min="0" 
                              step="0.1"
                              className="w-full" 
                            />
                            <span className="ml-2">%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch checked={category.promoRate} />
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Reset to Global</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium">Add New Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-category">Activity Category</Label>
                    <Input id="new-category" placeholder="Enter category name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-guest-fee">Guest Fee (%)</Label>
                    <div className="flex items-center">
                      <Input 
                        id="new-guest-fee" 
                        type="number" 
                        placeholder="e.g. 5.0" 
                        min="0" 
                        step="0.1" 
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-host-fee">Host Commission (%)</Label>
                    <div className="flex items-center">
                      <Input 
                        id="new-host-fee" 
                        type="number" 
                        placeholder="e.g. 15.0" 
                        min="0" 
                        step="0.1" 
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="new-promo-rate" />
                  <Label htmlFor="new-promo-rate">Promotional Rate</Label>
                </div>
                <Button className="w-auto self-start">Add Category</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save All Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Fee History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Fee Structure History</CardTitle>
              <CardDescription>Historical record of fee structure changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date Modified</TableHead>
                      <TableHead>Guest Fee (%)</TableHead>
                      <TableHead>Host Commission (%)</TableHead>
                      <TableHead>Min Payout ($)</TableHead>
                      <TableHead>Modified By</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.guestFee}%</TableCell>
                        <TableCell>{record.hostFee}%</TableCell>
                        <TableCell>${record.minPayout}</TableCell>
                        <TableCell>{record.modifiedBy}</TableCell>
                        <TableCell>{record.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payment Providers Tab */}
        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>Payment Provider Settings</CardTitle>
              <CardDescription>Configure payment provider fees and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Payment Provider Fees</AlertTitle>
                <AlertDescription>
                  These fees are charged by payment providers and can be absorbed by the platform or passed on to users.
                  Update these values when your payment processor changes their fee structure.
                </AlertDescription>
              </Alert>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment Provider</TableHead>
                      <TableHead>Percentage Fee (%)</TableHead>
                      <TableHead>Fixed Fee ($)</TableHead>
                      <TableHead>Enabled</TableHead>
                      <TableHead>Default</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentProviderFees.map((provider, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{provider.provider}</TableCell>
                        <TableCell>
                          <div className="flex items-center w-20">
                            <Input 
                              type="number" 
                              value={provider.fee} 
                              min="0" 
                              step="0.1"
                              className="w-full" 
                            />
                            <span className="ml-2">%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center w-20">
                            <span className="mr-1">$</span>
                            <Input 
                              type="number" 
                              value={provider.fixedFee} 
                              min="0" 
                              step="0.01"
                              className="w-full" 
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch checked={true} />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={index === 0} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium">Add New Payment Provider</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-provider">Provider Name</Label>
                    <Input id="new-provider" placeholder="Enter provider name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-provider-fee">Percentage Fee (%)</Label>
                    <div className="flex items-center">
                      <Input 
                        id="new-provider-fee" 
                        type="number" 
                        placeholder="e.g. 2.9" 
                        min="0" 
                        step="0.1" 
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-provider-fixed">Fixed Fee ($)</Label>
                    <div className="flex items-center">
                      <span className="mr-1">$</span>
                      <Input 
                        id="new-provider-fixed" 
                        type="number" 
                        placeholder="e.g. 0.30" 
                        min="0" 
                        step="0.01" 
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="new-provider-enabled" defaultChecked />
                    <Label htmlFor="new-provider-enabled">Enabled</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="new-provider-default" />
                    <Label htmlFor="new-provider-default">Set as Default</Label>
                  </div>
                </div>
                <Button className="w-auto self-start">Add Provider</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Fee Handling Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pass-fees-to-guests" defaultChecked />
                    <Label htmlFor="pass-fees-to-guests">Pass payment processing fees to guests</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-fee-breakdown" defaultChecked />
                    <Label htmlFor="show-fee-breakdown">Show fee breakdown to users during checkout</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="round-up-fees" />
                    <Label htmlFor="round-up-fees">Round up fees to nearest dollar</Label>
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

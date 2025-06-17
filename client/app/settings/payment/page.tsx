"use client";

import { useState } from "react";
import { CreditCard, PaypalLogo, Plus, Trash2, CheckCircle, Loader2, X } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useToast } from "@/components/ui/use-toast";

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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock payment methods - in a real app, these would come from your API
const MOCK_PAYMENT_METHODS = [
  {
    id: "pm_1",
    type: "card",
    label: "•••• 4242",
    cardBrand: "visa",
    expiryMonth: "12",
    expiryYear: "2025",
    isDefault: true,
  },
  {
    id: "pm_2",
    type: "paypal",
    label: "paypal@example.com",
    isDefault: false,
  }
];

export default function PaymentSettings() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS);
  const [loading, setLoading] = useState(false);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [showAddPaypalDialog, setShowAddPaypalDialog] = useState(false);
  
  // Card form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [setAsDefault, setSetAsDefault] = useState(false);
  
  // Paypal form state
  const [paypalEmail, setPaypalEmail] = useState("");
  const [paypalSetAsDefault, setPaypalSetAsDefault] = useState(false);

  // Generate an array of month options (01-12)
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return month.toString().padStart(2, "0");
  });

  // Generate an array of year options (current year + 20 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => (currentYear + i).toString());

  // Handle adding a new payment card
  const handleAddCard = async () => {
    setLoading(true);
    
    try {
      // In a real app, you would call your API here
      // For demo purposes, just add to the local state
      const newCard = {
        id: `pm_${Math.random().toString(36).substring(2, 9)}`,
        type: "card",
        label: `•••• ${cardNumber.slice(-4)}`,
        cardBrand: "visa", // In a real app, you'd determine this from the card number
        expiryMonth: expMonth,
        expiryYear: expYear,
        isDefault: setAsDefault,
      };

      // If this is the new default, update other methods
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: setAsDefault ? false : method.isDefault,
      }));
      
      setPaymentMethods([...updatedMethods, newCard]);
      setShowAddCardDialog(false);
      resetCardForm();
      
      toast({
        title: "Card added",
        description: "Your payment card has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add payment card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle adding PayPal
  const handleAddPaypal = async () => {
    setLoading(true);
    
    try {
      // In a real app, you would call your API here
      // For demo purposes, just add to the local state
      const newPaypal = {
        id: `pm_${Math.random().toString(36).substring(2, 9)}`,
        type: "paypal",
        label: paypalEmail,
        isDefault: paypalSetAsDefault,
      };

      // If this is the new default, update other methods
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: paypalSetAsDefault ? false : method.isDefault,
      }));
      
      setPaymentMethods([...updatedMethods, newPaypal]);
      setShowAddPaypalDialog(false);
      resetPaypalForm();
      
      toast({
        title: "PayPal added",
        description: "Your PayPal account has been linked successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to link PayPal account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle setting a payment method as default
  const handleSetDefault = (id: string) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    }));
    
    setPaymentMethods(updatedMethods);
    
    toast({
      title: "Default updated",
      description: "Your default payment method has been updated.",
    });
  };

  // Handle removing a payment method
  const handleRemovePaymentMethod = (id: string) => {
    const methodToRemove = paymentMethods.find(m => m.id === id);
    const isRemovingDefault = methodToRemove?.isDefault;
    let updatedMethods = paymentMethods.filter(method => method.id !== id);
    
    // If we're removing the default method and there are other methods,
    // make the first remaining one the new default
    if (isRemovingDefault && updatedMethods.length > 0) {
      updatedMethods = updatedMethods.map((method, index) => ({
        ...method,
        isDefault: index === 0,
      }));
    }
    
    setPaymentMethods(updatedMethods);
    
    toast({
      title: "Payment method removed",
      description: "The payment method has been removed from your account."
    });
  };

  // Reset form values
  const resetCardForm = () => {
    setCardNumber("");
    setCardholderName("");
    setExpMonth("");
    setExpYear("");
    setCvc("");
    setSetAsDefault(false);
  };
  
  const resetPaypalForm = () => {
    setPaypalEmail("");
    setPaypalSetAsDefault(false);
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Handle card number input change with formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Payment Methods</h1>
        <p className="text-sm text-muted-foreground">
          Add and manage your payment methods for bookings
        </p>
      </div>

      <Separator className="my-6" />

      {/* Payment Methods List */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Payment Methods</h2>
          <div className="flex gap-3">
            <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Add Card</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Card</DialogTitle>
                  <DialogDescription>
                    Add a new credit or debit card to your account
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19} // 16 digits + 3 spaces
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardholder-name">Cardholder Name</Label>
                    <Input
                      id="cardholder-name"
                      placeholder="John Doe"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exp-month">Expiry Month</Label>
                      <Select value={expMonth} onValueChange={setExpMonth}>
                        <SelectTrigger id="exp-month">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="exp-year">Expiry Year</Label>
                      <Select value={expYear} onValueChange={setExpYear}>
                        <SelectTrigger id="exp-year">
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="set-as-default"
                      checked={setAsDefault}
                      onCheckedChange={setSetAsDefault}
                    />
                    <Label htmlFor="set-as-default">Set as default payment method</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowAddCardDialog(false);
                      resetCardForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddCard} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Card"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showAddPaypalDialog} onOpenChange={setShowAddPaypalDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <PaypalLogo className="h-4 w-4" />
                  <span>Add PayPal</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Link PayPal Account</DialogTitle>
                  <DialogDescription>
                    Add your PayPal account to your ExpAq account
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="paypal-email">PayPal Email</Label>
                    <Input
                      id="paypal-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="paypal-default"
                      checked={paypalSetAsDefault}
                      onCheckedChange={setPaypalSetAsDefault}
                    />
                    <Label htmlFor="paypal-default">Set as default payment method</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowAddPaypalDialog(false);
                      resetPaypalForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddPaypal} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Linking...
                      </>
                    ) : (
                      "Link PayPal"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {paymentMethods.length === 0 ? (
          <Card className="bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No payment methods</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You haven&apos;t added any payment methods yet
              </p>
              <Button onClick={() => setShowAddCardDialog(true)}>Add a payment method</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {method.type === "card" ? (
                        <CreditCard className="h-5 w-5 text-primary" />
                      ) : (
                        <PaypalLogo className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    
                    <div>
                      <div className="font-medium flex items-center">
                        {method.label}
                        {method.isDefault && (
                          <span className="ml-2 bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      
                      {method.type === "card" && (
                        <div className="text-sm text-muted-foreground">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemovePaymentMethod(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Payment Settings */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Payment Settings</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Default Currency</CardTitle>
            <CardDescription>Choose your preferred currency for transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-xs">
              <Select defaultValue="usd">
                <SelectTrigger>
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

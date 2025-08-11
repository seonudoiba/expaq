"use client";

import React, { useState, useEffect } from 'react';
import { subscriptionService, SubscriptionPlan } from '@/services/subscription-service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Star, Zap, Crown, Building } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/components/ui/use-toast';

interface PricingPlansProps {
  currentPlan?: string;
  onSelectPlan?: (planType: string, billingCycle: string) => void;
}

export function PricingPlans({ currentPlan, onSelectPlan }: PricingPlansProps) {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscribingTo, setSubscribingTo] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const plansData = await subscriptionService.getPlans();
      setPlans(plansData);
    } catch (error) {
      console.error('Error loading plans:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planType: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to subscribe to a premium plan",
        variant: "destructive",
      });
      return;
    }

    const billingCycle = isYearly ? 'YEARLY' : 'MONTHLY';
    
    if (onSelectPlan) {
      onSelectPlan(planType, billingCycle);
      return;
    }

    setSubscribingTo(planType);
    
    try {
      const result = await subscriptionService.subscribe(planType, billingCycle);
      
      if (result.success) {
        toast({
          title: "Subscription Created",
          description: result.message,
        });
      } else {
        toast({
          title: "Subscription Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subscription",
        variant: "destructive",
      });
    } finally {
      setSubscribingTo(null);
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'BASIC':
        return <Star className="h-6 w-6 text-gray-500" />;
      case 'PREMIUM':
        return <Zap className="h-6 w-6 text-blue-500" />;
      case 'PROFESSIONAL':
        return <Crown className="h-6 w-6 text-purple-500" />;
      case 'ENTERPRISE':
        return <Building className="h-6 w-6 text-gold-500" />;
      default:
        return <Star className="h-6 w-6 text-gray-500" />;
    }
  };

  const getPlanBadge = (planType: string) => {
    switch (planType) {
      case 'PREMIUM':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Most Popular</Badge>;
      case 'PROFESSIONAL':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Best Value</Badge>;
      case 'ENTERPRISE':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Enterprise</Badge>;
      default:
        return null;
    }
  };

  const getPrice = (plan: SubscriptionPlan) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: SubscriptionPlan) => {
    if (!isYearly) return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice;
    const savings = monthlyCost - yearlyCost;
    const savingsPercent = Math.round((savings / monthlyCost) * 100);
    return { amount: savings, percent: savingsPercent };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
          Monthly
        </span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
          className="data-[state=checked]:bg-blue-600"
        />
        <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
          Yearly
        </span>
        {isYearly && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Save up to 17%
          </Badge>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.type;
          const isPremium = plan.type === 'PREMIUM' || plan.type === 'PROFESSIONAL';
          const price = getPrice(plan);
          const savings = getSavings(plan);

          return (
            <Card 
              key={plan.type} 
              className={`relative transition-all duration-200 hover:shadow-lg ${
                isPremium ? 'border-blue-500 shadow-lg scale-105' : ''
              } ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}
            >
              {getPlanBadge(plan.type) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  {getPlanBadge(plan.type)}
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  {getPlanIcon(plan.type)}
                </div>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold">${price}</span>
                    <span className="text-gray-500 ml-1">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                  {savings && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      Save ${savings.amount} ({savings.percent}% off)
                    </div>
                  )}
                  {!isYearly && plan.type !== 'BASIC' && (
                    <div className="text-xs text-gray-500 mt-1">
                      or ${plan.yearlyPrice}/year
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>
                      {plan.features.maxActivities === -1 ? 'Unlimited' : plan.features.maxActivities} activities
                    </span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{plan.features.maxPhotos} photos per activity</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{(plan.features.commissionRate * 100).toFixed(0)}% commission rate</span>
                  </li>
                  {plan.features.featuredListings && (
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Featured listings</span>
                    </li>
                  )}
                  {plan.features.advancedAnalytics && (
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Advanced analytics</span>
                    </li>
                  )}
                  {plan.features.prioritySupport && (
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Priority support</span>
                    </li>
                  )}
                  {plan.features.customBranding && (
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Custom branding</span>
                    </li>
                  )}
                </ul>
              </CardContent>

              <CardFooter>
                {isCurrentPlan ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : plan.type === 'BASIC' ? (
                  <Button variant="outline" className="w-full" disabled>
                    Free Forever
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${isPremium ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    onClick={() => handleSelectPlan(plan.type)}
                    disabled={subscribingTo === plan.type}
                  >
                    {subscribingTo === plan.type ? 'Processing...' : 'Get Started'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison Note */}
      <div className="text-center text-sm text-gray-600 max-w-2xl mx-auto">
        <p>
          All plans include activity creation, booking management, and basic analytics. 
          Premium plans offer enhanced features, reduced commission rates, and priority support.
        </p>
      </div>
    </div>
  );
}
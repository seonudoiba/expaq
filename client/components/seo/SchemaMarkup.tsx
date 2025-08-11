"use client";

import React from 'react';
import { seoService } from '@/services/seo-service';
import { Activity } from '@/types/activity';

interface SchemaMarkupProps {
  type: 'organization' | 'faq' | 'localBusiness';
  data?: any;
  activity?: Activity;
  faqs?: Array<{ question: string; answer: string }>;
}

export function SchemaMarkup({ type, data, activity, faqs }: SchemaMarkupProps) {
  let structuredData: any;

  switch (type) {
    case 'organization':
      structuredData = seoService.generateOrganizationSchema();
      break;
    
    case 'faq':
      if (faqs) {
        structuredData = seoService.generateFAQSchema(faqs);
      }
      break;
    
    case 'localBusiness':
      if (activity) {
        structuredData = seoService.generateLocalBusinessSchema(activity);
      }
      break;
    
    default:
      structuredData = data;
  }

  if (!structuredData) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}

// Common FAQ data for different pages
export const commonFAQs = {
  general: [
    {
      question: "What is Expaq?",
      answer: "Expaq is a platform that connects travelers with local hosts offering unique activities and experiences. You can discover and book authentic local adventures in cities around the world."
    },
    {
      question: "How do I book an activity?",
      answer: "Browse our activities, select your preferred date and time, choose the number of participants, and complete the booking with secure payment. You'll receive instant confirmation and host contact details."
    },
    {
      question: "Is it safe to book through Expaq?",
      answer: "Yes, all hosts are verified and activities are covered by our safety guarantee. We also provide 24/7 customer support and secure payment processing."
    },
    {
      question: "What if I need to cancel my booking?",
      answer: "Cancellation policies vary by host, but most offer free cancellation up to 24-48 hours before the activity. Check the specific policy on each activity page."
    }
  ],

  hosting: [
    {
      question: "How do I become a host on Expaq?",
      answer: "Sign up for a host account, complete your profile verification, create your first activity listing with photos and details, and start accepting bookings once approved."
    },
    {
      question: "What commission does Expaq charge?",
      answer: "Commission rates vary by subscription plan, starting from 10% for basic hosts down to 4% for enterprise hosts. Premium subscriptions offer reduced rates and additional features."
    },
    {
      question: "How do I get paid as a host?",
      answer: "Payments are processed after each completed activity and transferred to your account based on your chosen payout schedule (weekly, bi-weekly, or monthly)."
    },
    {
      question: "What support do hosts receive?",
      answer: "Hosts get access to our help center, 24/7 support team, host community forum, and premium hosts receive priority support and dedicated account management."
    }
  ],

  booking: [
    {
      question: "How far in advance should I book?",
      answer: "We recommend booking at least 24-48 hours in advance, though many hosts accept same-day bookings. Popular activities and dates may require earlier booking."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, PayPal, and other secure payment methods. All transactions are processed securely through our payment partners."
    },
    {
      question: "Will I receive confirmation of my booking?",
      answer: "Yes, you'll receive instant email confirmation with your booking details, host contact information, and meeting instructions after completing your payment."
    },
    {
      question: "Can I modify my booking after confirmation?",
      answer: "Contact your host directly or reach out to our support team. Modifications depend on availability and the host's policies, but we'll do our best to accommodate changes."
    }
  ],

  safety: [
    {
      question: "How are hosts verified?",
      answer: "All hosts undergo identity verification, background checks where applicable, and must provide valid insurance and safety documentation for their activities."
    },
    {
      question: "What if something goes wrong during an activity?",
      answer: "Contact our 24/7 emergency support line. All activities are covered by our safety guarantee, and we'll work quickly to resolve any issues and ensure your safety."
    },
    {
      question: "Are activities insured?",
      answer: "Yes, all activities listed on Expaq are required to have appropriate insurance coverage. We also provide additional protection through our platform guarantee."
    },
    {
      question: "How do I report a safety concern?",
      answer: "Report any safety concerns immediately through our app, website, or by calling our emergency support line. We take all safety reports seriously and investigate promptly."
    }
  ]
};
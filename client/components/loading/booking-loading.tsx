"use client"

import { Calendar, CreditCard, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface BookingLoadingProps {
  stage?: "processing" | "confirming" | "redirecting"
}

export function BookingLoading({ stage = "processing" }: BookingLoadingProps) {
  const getStageInfo = () => {
    switch (stage) {
      case "processing":
        return {
          icon: <CreditCard className="h-8 w-8 text-primary" />,
          title: "Processing Payment",
          description: "Securely processing your payment details...",
          steps: ["Validating payment information", "Contacting payment provider", "Confirming transaction"],
        }
      case "confirming":
        return {
          icon: <Calendar className="h-8 w-8 text-primary" />,
          title: "Confirming Booking",
          description: "Creating your booking and notifying the host...",
          steps: ["Creating booking record", "Sending confirmation to host", "Preparing confirmation details"],
        }
      case "redirecting":
        return {
          icon: <Loader2 className="h-8 w-8 text-primary animate-spin" />,
          title: "Almost Done",
          description: "Redirecting you to your booking confirmation...",
          steps: ["Finalizing booking details", "Preparing confirmation page", "Redirecting..."],
        }
    }
  }

  const stageInfo = getStageInfo()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Animated Icon */}
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <div className="h-16 w-16 rounded-full bg-primary/20"></div>
              </div>
              <div className="relative h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                {stageInfo.icon}
              </div>
            </div>

            {/* Title and Description */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">{stageInfo.title}</h2>
              <p className="text-muted-foreground">{stageInfo.description}</p>
            </div>

            {/* Progress Steps */}
            <div className="w-full space-y-3">
              {stageInfo.steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div
                      className="h-2 w-2 bg-primary rounded-full animate-pulse"
                      style={{ animationDelay: `${index * 500}ms` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>

            {/* Security Notice */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">🔒 Your payment is secured with 256-bit SSL encryption</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

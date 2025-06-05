// import { BecomeHostForm } from "@/components/forms/become-host";

// // import Link from "next/link";

// export default function BecomeAHostPage() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <BecomeHostForm />
//     </div>
//   );
// }
"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, DollarSign, Users, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
// import { useQuery } from "@tanstack/react-query";
import { authService } from "@/lib/api/services";
import toast from "react-hot-toast";
import { useState } from "react";

export default function BecomeAHostPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStartedClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default behavior to avoid rerender

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.becomeHost();
      toast.success("You are now a host!");
      console.log("Become Host Response:", response);
      router.push("/create-activities"); // Redirect to dashboard after success
    } catch (error) {
      console.error("Error becoming host:", error);
      toast.error("Failed to become a host. Please try again later.");
      // router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/do0rdj8oj/image/upload/v1747088919/activities/xglp4yj4sxowidjmbjon.jpg?height=600&width=1600"
            alt="Host leading an activity"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
        </div>
        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white">
            Share Your Passion
          </h1>
          <p className="text-xl text-white/90 max-w-[800px]">
            Turn your expertise into income by hosting activities on Expaq
          </p>
          <Button size="lg" className="mt-4" onClick={handleGetStartedClick} disabled={isLoading}>
            {isLoading ? "Loading..." : "Get Started"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="container px-4 md:px-6 py-6 md:py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Becoming a host is easy. Start sharing your experiences in just a
            few steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Create Your Listing
              </h3>
              <p className="text-muted-foreground">
                Tell us about your activity, set your price, and upload photos
                to showcase your experience.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Welcome Guests</h3>
              <p className="text-muted-foreground">
                Once approved, your listing goes live. Set your availability and
                start receiving bookings.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Paid</h3>
              <p className="text-muted-foreground">
                Receive secure payments directly to your account after each
                successful experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Why Host on Expaq
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Join thousands of hosts who are sharing their passions and earning
              income on their own terms.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
              <p className="text-muted-foreground">
                You decide when and how often you host. Set your own
                availability to fit your lifestyle.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Income</h3>
              <p className="text-muted-foreground">
                Turn your passion into profit. Our hosts earn an average of
                $500-$2000 per month.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Meet People</h3>
              <p className="text-muted-foreground">
                Connect with travelers from around the world who share your
                interests and passions.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Support</h3>
              <p className="text-muted-foreground">
                We provide insurance, 24/7 support, and tools to help you
                succeed as a host.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Host Stories */}
      <section className="container px-4 md:px-6 py-12 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Host Success Stories
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Hear from hosts who have transformed their passions into thriving
            businesses.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src="/language-xchange.jpg?height=200&width=400"
                alt="Host portrait"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">
                Maria, Cooking Instructor
              </h3>
              <p className="text-muted-foreground mb-4">
                "I've been able to share my family's traditional recipes with
                people from all over the world. The platform makes it easy to
                manage bookings and I've doubled my income in just six months."
              </p>
              <p className="text-sm text-muted-foreground">Rome, Italy</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src="/language-xchange.jpg?height=200&width=400"
                alt="Host portrait"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">
                Carlos, Hiking Guide
              </h3>
              <p className="text-muted-foreground mb-4">
                "I turned my weekend hobby into a full-time business. The
                flexibility allows me to lead tours when I want, and the support
                from Expaq has been incredible."
              </p>
              <p className="text-sm text-muted-foreground">Costa Rica</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src="/language-xchange.jpg?height=200&width=400"
                alt="Host portrait"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">
                Sophie, Art Instructor
              </h3>
              <p className="text-muted-foreground mb-4">
                "Hosting painting workshops has connected me with amazing people
                and provided a steady income stream. The platform handles all
                the logistics so I can focus on creating."
              </p>
              <p className="text-sm text-muted-foreground">Paris, France</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Everything you need to know about hosting on Expaq.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                How much does it cost to list my activity?
              </h3>
              <p className="text-muted-foreground">
                It's free to create and list your activity on Expaq. We only
                take a commission when you receive a booking.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                How much can I earn as a host?
              </h3>
              <p className="text-muted-foreground">
                Earnings vary based on your activity, pricing, and frequency of
                hosting. Many of our hosts earn between $500-$2000 per month.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                What kind of activities can I host?
              </h3>
              <p className="text-muted-foreground">
                Almost anything! From cooking classes to outdoor adventures,
                city tours to craft workshops. If you have a passion or skill to
                share, you can host it.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Do I need special qualifications?
              </h3>
              <p className="text-muted-foreground">
                While some activities may require certifications (like scuba
                instruction), many don't. What's most important is your
                knowledge, passion, and ability to create a great experience.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How do I get paid?</h3>
              <p className="text-muted-foreground">
                Payments are processed securely through our platform. You'll
                receive your earnings via direct deposit to your bank account.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Is there insurance for hosts?
              </h3>
              <p className="text-muted-foreground">
                Yes, we provide liability insurance coverage for all verified
                hosts during their experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container px-4 md:px-6 py-12 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to become a host?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our community of passionate hosts and start sharing your
            experiences with the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Create Your Listing <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

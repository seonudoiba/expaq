import About from "../components/home/About";
import Hosts from "../components/home/Hosts";
import Blog from "../components/home/Blog";

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, Users, ChevronRight, Star } from "lucide-react"
import { FeaturedActivities } from "@/components/home/featured-activities"
import { ActivityType } from "@/components/home/activity-type"
import { TestimonialCard } from "@/components/testimonial-card"
import { HostCta } from "@/components/host-cta"
import Cities from "@/components/home/city";
import Countries from "@/components/home/country";
export default function Home() {
  return (
    <>
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg?height=600&width=1600"
            alt="People enjoying outdoor activities"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
        </div>
        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white">
            Discover Unforgettable Experiences
          </h1>
          <p className="text-xl text-white/90 max-w-[800px]">
            Connect with local hosts and find unique activities anywhere in the world
          </p>
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Where are you going?" className="pl-10" />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input placeholder="When?" className="pl-10" />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Number of people" className="pl-10" />
              </div>
              <Button className="w-full">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Popular Activity Types</h2>
            <p className="text-muted-foreground mt-2">Find activities that match your interests</p>
          </div>
          <Link href="/activities" className="flex items-center text-primary mt-4 md:mt-0">
            View all Activity Types <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <ActivityType />
      </section>
      <section className="bg-muted py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Top Cities</h2>
              <p className="text-muted-foreground mt-2">Handpicked cities you&apos;ll love</p>
            </div>
            <Link href="/activities" className="flex items-center text-primary mt-4 md:mt-0">
              Explore all cities <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <Cities />
        </div>
      </section>
      <section className=" py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Top Countries</h2>
              <p className="text-muted-foreground mt-2">Handpicked countries you&apos;ll love</p>
            </div>
            <Link href="/activities" className="flex items-center text-primary mt-4 md:mt-0">
              Explore all countries <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <Countries />
        </div>
      </section>
      <section className="bg-muted py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Experiences</h2>
              <p className="text-muted-foreground mt-2">Handpicked activities you&apos;ll love</p>
            </div>
            <Link href="/activities" className="flex items-center text-primary mt-4 md:mt-0">
              Explore all experiences <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <FeaturedActivities />
        </div>
      </section>

      <section className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Why Choose Expaq</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            We connect adventure seekers with verified local hosts for unforgettable experiences
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified Experiences</h3>
            <p className="text-muted-foreground">
              All our hosts and activities are carefully verified for quality and safety
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
            <p className="text-muted-foreground">Book activities instantly with our secure and easy-to-use platform</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Local Connections</h3>
            <p className="text-muted-foreground">Connect with local hosts who share their passion and expertise</p>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Hear from people who have discovered amazing experiences through Expaq
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Emmanuel Johnson"
              location="New York, USA"
              image="https://res.cloudinary.com/do0rdj8oj/image/upload/v1748903445/user_cqm47p.jpg?height=100&width=100"
              rating={5}
              text="The cooking class in Rome was the highlight of our trip! Our host was amazing and we learned so much about authentic Italian cuisine."
            />
            <TestimonialCard
              name="David Chen"
              location="Toronto, Canada"
              image="https://res.cloudinary.com/do0rdj8oj/image/upload/v1748903444/testimonial-1_igykbr.jpg?height=100&width=100"
              rating={5}
              text="We booked a hiking tour in Costa Rica and our guide was incredibly knowledgeable. Saw wildlife we would have never spotted on our own!"
            />
            <TestimonialCard
              name="Jacob Williams"
              location="London, UK"
              image="https://res.cloudinary.com/do0rdj8oj/image/upload/v1748903445/testimonial-4_tynuex.jpg?height=100&width=100"
              rating={5}
              text="The street art tour in Berlin was fascinating. Our host knew all the hidden gems and the stories behind each piece. Highly recommend!"
            />
          </div>
        </div>
      </section>

    </div>
    <About/>
    <Hosts/>
    <Blog/>
    <HostCta />
    </>
  );
}

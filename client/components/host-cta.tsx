import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HostCta() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl/tight">Share your passion. Become a host.</h2>
            <p className="mt-4 text-primary-foreground/90 max-w-[600px]">
              Turn your expertise into income by hosting activities on Expaq. Connect with travelers from around the
              world and share your unique experiences.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link href="/become-a-host">
                <Button variant="secondary" size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/host-resources">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-4">
              <div className="rounded-lg overflow-hidden h-40 bg-primary-foreground/10">
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">Flexible Schedule</h3>
                  <p className="text-primary-foreground/90">Host when it works for you</p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden h-40 bg-primary-foreground/10">
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">Earn Income</h3>
                  <p className="text-primary-foreground/90">Turn your passion into profit</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-lg overflow-hidden h-40 bg-primary-foreground/10">
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">Meet People</h3>
                  <p className="text-primary-foreground/90">Connect with travelers worldwide</p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden h-40 bg-primary-foreground/10">
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">Full Support</h3>
                  <p className="text-primary-foreground/90">We&apos;re here to help you succeed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
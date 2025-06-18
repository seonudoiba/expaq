import Link from "next/link"
import Image from "next/image";
import { Compass, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted py-12 border-t">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">

              <Link href="/" className="flex items-center space-x-2">
                          <Image src="/expaqlogo.png" alt={"Expaq"} width={120} height={30} />
                        </Link>
            </div>
            <p className="text-muted-foreground">
              Connecting adventure seekers with unforgettable experiences around the world.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Discover</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/activities" className="text-muted-foreground hover:text-foreground">
                  All Activities
                </Link>
              </li>
              <li>
                <Link href="/activities/outdoor" className="text-muted-foreground hover:text-foreground">
                  Outdoor Adventures
                </Link>
              </li>
              <li>
                <Link href="/activities/food" className="text-muted-foreground hover:text-foreground">
                  Food & Drink
                </Link>
              </li>
              <li>
                <Link href="/activities/culture" className="text-muted-foreground hover:text-foreground">
                  Cultural Experiences
                </Link>
              </li>
              <li>
                <Link href="/activities/wellness" className="text-muted-foreground hover:text-foreground">
                  Wellness
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Hosting</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/become-a-host" className="text-muted-foreground hover:text-foreground">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link href="/host-resources" className="text-muted-foreground hover:text-foreground">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/host-community" className="text-muted-foreground hover:text-foreground">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/host-guidelines" className="text-muted-foreground hover:text-foreground">
                  Hosting Guidelines
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help-center" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-muted-foreground hover:text-foreground">
                  Safety Center
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-muted-foreground">© {new Date().getFullYear()} Expaq. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
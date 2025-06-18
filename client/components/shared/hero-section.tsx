"use client";

import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageSrc?: string;
  overlayColor?: string;
}

export function HeroSection({ title, subtitle, imageSrc, overlayColor }: HeroSectionProps) {
  return (
    <div className="relative isolate overflow-hidden">
      <div 
        className="absolute inset-0 -z-10 h-full w-full"
        style={{
          background: imageSrc 
            ? `url(${imageSrc}) no-repeat center center/cover` 
            : 'linear-gradient(to right, #0f172a, #1e293b)'
        }}
      >
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: overlayColor || 'rgba(15, 23, 42, 0.6)'
          }}
        />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            {subtitle}
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <a 
              href="#browse" 
              className="group flex items-center text-sm font-semibold text-white"
            >
              Start exploring
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

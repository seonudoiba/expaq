"use client"
import React from 'react'
import Hero from './Hero'
import Navbar from './Navbar'
import { usePathname } from 'next/navigation'
import Card from './Card'

const ShowNavLayout = () => {
    const pathname = usePathname()
    if( pathname =="" || pathname=='/'){
        return (
 
        <div className="bg-[url('/hero.jpg')] bg-[length:900px] md:bg-[length:100%] bg-no-repeat">
              <Navbar />
              <Hero />
              {/* <Card /> */}
              </div>
        )
    }
    return (
 
        <div className="bg-[url('/hero.jpg')] bg-[length:900px] md:bg-[length:100%] bg-no-repeat">
              <Navbar />
              </div>
        )
 
}

export default ShowNavLayout

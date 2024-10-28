import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

type FeatureItem = {
    URL: string;
    title: string;
    des:string;
}
const FeatureItem = ({title, URL, des}:FeatureItem) => {
  return (
    <div className='mx-4 overflow-hidden group'>
      <Link href={"/"} className='overflow-hidden relative'>
      <div style={{ width: '200px', height: '600px' }} className="overflow-hidden">
      <Image src={URL} alt={title} layout="fill"
    objectFit="contain"
      className='bg-red-400 h-4 w-3 hover:scale-105 transition-all duration-700 overflow-hidden'/>
     
      </div>
      <h4 className='capitalize regular-22 absolute top-6 left-4 text-white'>{title}</h4>
      <p className='regular-18 absolute bottom-6 right-0 bg-primary
       text-white px-4 py-2 rounded-l-full group-hover:bg-secondary
       group-hover:!pr-8 transition-all duration-300'>{des}</p>
    </Link>
      
    </div>
  )
}

export default FeatureItem

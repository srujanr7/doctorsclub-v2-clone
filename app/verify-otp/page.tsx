"use client"; 

import { PatientForm } from '@/components/forms/PatientForm'; 
import { InputOTPControlled } from '@/components/InputOTPControlled';
import Image from 'next/image'
import Link from 'next/link'
   
export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
        {/* Company Logo on the left */}
        <div>
          <Link href="/"> 
            <Image 
              src="/assets/icons/logo-doctorsclub.svg" // Replace with your logo's path
              alt="Company Logo"
              width={110} 
              height={50}  
            />
          </Link> 
        </div> 
      </div>

      {/* Main Content */}
      <main className="flex flex-grow justify-center items-center mt-20 p-2 md:p-8">
        <div className="w-full max-w-md p-4 rounded-lg shadow-lg">
          <InputOTPControlled  />  
        </div>
      </main>
    </div>
  )
}       
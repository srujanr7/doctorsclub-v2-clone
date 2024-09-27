"use client";

import dynamic from "next/dynamic"; // For code-splitting & lazy loading
import { memo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Cover } from "@/components/ui/cover";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Script from "next/script";  
import { sendGTMEvent } from "@next/third-parties/google";
  
// Lazy-load Footer to improve initial load time
const Footer = dynamic(() => import('@/components/footer').then((mod) => mod.Footer), { ssr: false });

// Memoize Home component to avoid unnecessary re-renders
const Home = memo(() => {

  const navItems = [
    { name: "About", link: "/about" },
    { name: "Pricing", link: "/pricing" },  
    { name: "Contact", link: "/contact" },
  ];
  
  const logo = "/assets/icons/logo-doctorsclub.svg";

  useEffect(() => {
    // Preload important assets to improve performance
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = '/assets/icons/logo-doctorsclub.svg';
    link.as = 'image';
    document.head.appendChild(link);  

    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Essential Floating Navbar (no lazy-loading) */}
      <FloatingNav navItems={navItems} logo={logo} />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-8 px-4 md:px-8 lg:px-16 h-[55rem]">
        <h1 className="text-6xl sm:text-6xl md:text-5xl lg:text-7xl font-semibold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
          Make your clinic run<br /> at <Cover>lightning speed</Cover>
        </h1>
        <div className="flex flex-col md:flex-row mt-11 space-y-9 md:space-y-0 space-x-0 md:space-x-4">
          <Link href="/patients"> 
            <button  onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'Sign In' })} className="w-40 h-10 font-semibold rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
              Sign In    
            </button>    
          </Link>
          <Link href="/sign-up">
            <button  onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'Sign In' })} className="w-40 h-10 font-semibold rounded-xl bg-white text-black border border-black text-sm relative z-50">
              Sign Up  
            </button>
          </Link>                   
        </div>
      </section>

      {/* Optimized Image and Container */}
      <section className="h-[57rem] bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <ContainerScroll
          titleComponent={
            <h1 className="text-5xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold text-black dark:text-white mt-14 mb-14 text-center">
              Faster, Efficient, Scalable <br />
              <span className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-2 leading-none">
                Patient Management
              </span>  
            </h1>
          }
        >
          {/* Optimized Image with responsive sizing and lazy loading */}
          <Image
            src="/assets/images/dashboard.webp"
            alt="hero"         
            width={1400}
            height={720}
            className="rounded-2xl object-contain object-center h-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1400px"
            quality={79} // Ensure image quality is balanced
            loading="lazy" 
          />
        </ContainerScroll>  
      </section>

      {/* Lazy-loaded Footer */}
      <Footer />

    </div>
  );
});

export default Home;   
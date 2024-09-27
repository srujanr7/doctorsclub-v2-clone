import dynamic from "next/dynamic"; // For code-splitting & lazy loading
import { memo } from "react";
import { Metadata } from "next";
import { FloatingNav } from "@/components/ui/floating-navbar";
import Script from "next/script";

// Lazy-load Footer to improve initial load time 
const Footer = dynamic(() => import('@/components/footer').then((mod) => mod.Footer), { ssr: false });  

// Metadata specific to the "About" page
export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about doctorsClub, a digital solution for clinics and doctors.',
  openGraph: {
    title: 'About doctorsClub',
    description: 'Find out how doctorsClub empowers small clinics with efficient patient management.',
    url: 'https://bydoctorsclub.com/about',
    siteName: 'doctorsClub',
    images: [
      {
        url: '/assets/icons/logo-doctorsclub.svg',
        width: 1200,
        height: 630,
        alt: 'doctorsClub logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About doctorsClub',
    description: 'Learn more about doctorsClub and how it helps doctors manage patient records digitally.',
    images: ['/assets/icons/logo-doctorsclub.svg'],
  },
};

const navItems = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Pricing", link: "/pricing" },
  { name: "Contact", link: "/contact" },
];

const logo = "/assets/icons/logo-doctorsclub.svg";

// Memoize About component to avoid unnecessary re-renders
const About = memo(() => {
  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Essential Floating Navbar (no lazy-loading) */}
      <FloatingNav navItems={navItems} logo={logo} />  

      {/* Add margin to push content below the navbar */}
      <section className="flex flex-col items-center justify-center py-16 px-6 sm:px-8 lg:px-10 text-black dark:text-white mt-24 sm:mt-32 lg:mt-36">
        <h1 className="text-5xl font-bold text-center mt-14 mb-14 sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
          About doctorsClub
        </h1>

        <div className="max-w-4xl w-full text-left leading-relaxed text-base sm:text-sm md:text-lg dark:text-white">
          <p className="mb-6"></p>
          <p className="mb-10 mt-10">
            doctorsClub is a platform designed for small clinics and independent doctors, providing a fast, efficient, and scalable solution for managing patient records. We help healthcare providers transition seamlessly from traditional pen-and-paper methods to a fully digital system. Our platform is not only affordable but also user-friendly, with an intuitive interface that simplifies patient management, streamlines clinic operations, and improves overall efficiency.
          </p>
          <h3 className="text-2xl font-semibold mt-14"></h3>
          <p className="mb-14">
            Headquartered in Pune, doctorsClub is dedicated to empowering smaller clinics with advanced technology. We understand the unique challenges independent doctors face and have built a solution that makes digital record-keeping effortless. In addition to patient management, we offer features like data analysis too, helping doctors stay informed and organized. By reducing administrative tasks, we allow healthcare professionals to focus more on delivering high-quality patient care, making digital management accessible and impactful for all.
          </p>
        </div>
      </section>

      {/* Lazy-loaded Footer */}
      <Footer />

      {/* Lazy Load Third-Party Scripts */}
      <Script 
        src="https://www.google-analytics.com/analytics.js" 
        strategy="lazyOnload" 
      />    
    </div>
  );
});

export default About;
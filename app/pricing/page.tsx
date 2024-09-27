import { FloatingNav } from "@/components/ui/floating-navbar";
import { FaHome, FaUserAlt, FaEnvelope, FaTags } from "react-icons/fa";
import { PricingCard } from "@/components/PricingCard";
import dynamic from "next/dynamic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Pricing',  
  description: 'Know more about Pricing doctorsClub',
  openGraph: {
    title: 'Pricing - doctorsClub',
    description: 'Know more about doctorsClub pricing', 
    url: 'https://bydoctorsclub.com/pricing', 
    siteName: 'doctorsClub', 
    images: [
      {
        url: '/assets/icons/logo-doctorsclub.svg',
        width: 1200,
        height: 630,
        alt: 'doctorsClub Logo',
      },
    ],
    type: 'website',
  },
};

// Dynamically import the footer component
const Footer = dynamic(() => import('@/components/footer').then((mod) => mod.Footer), { ssr: false });

const Home = () => {
  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Pricing",
      link: "/pricing",
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ];

  const logo = "/assets/icons/logo-doctorsclub.svg";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Floating Navbar */}
      <FloatingNav navItems={navItems} logo={logo} />

      {/* Main Section */}
      <main className="flex-grow flex items-center justify-center mt-56 md:mt-64 lg:mt-65 px-4 sm:px-6 md:px-8 pb-32 lg:pb-48">
        <PricingCard />
      </main>

      {/* Footer Section */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>    
  );
};

export default Home;   
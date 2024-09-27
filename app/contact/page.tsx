import { FloatingNav } from "@/components/ui/floating-navbar";
import { FaHome, FaUserAlt, FaEnvelope, FaTags } from "react-icons/fa";
import { ContactCard } from "@/components/ContactCard";
import dynamic from "next/dynamic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Feel free to contact us.',
  openGraph: {  
    title: 'Contact - doctorsClub',
    description: 'Feel free to contact us.',
    url: 'https://bydoctorsclub.com/contact', 
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

const Footer = dynamic(() => import('@/components/footer').then((mod) => mod.Footer), { ssr: false });

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams?.admin === "true";

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
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Floating Navbar */}
      <FloatingNav navItems={navItems} logo={logo} />   

      {/* Main Section */}
      <main className="flex-grow flex items-center justify-center mt-44 sm:mt-52 md:mt-48 lg:mt-54 xl:mt-62 px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 lg:pb-24">
        <ContactCard />       
      </main>       

      {/* Footer Section */}  
      <footer className="mt-16 sm:mt-20 md:mt-24 lg:mt-28">    
        <Footer />
      </footer>
    </div>
  );
}                     
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {   
  return [
    {
      url: 'https://bydoctorsclub.com/',  // Homepage URL
      lastModified: new Date().toISOString(),  // Update dynamically
    },
    {
      url: 'https://bydoctorsclub.com/about',  // Example: About pages   
      lastModified: new Date().toISOString(),
    },
    {
      url: 'https://bydoctorsclub.com/pricing',  // Example: Pricing page
      lastModified: new Date().toISOString(),
    },
    {
        url: 'https://bydoctorsclub.com/contact',  // Example: Contact page
        lastModified: new Date().toISOString(),
    },  
    {
      url: 'https://bydoctorsclub.com/privacy',  // Example: Privacy page   
      lastModified: new Date().toISOString(),
  }, 
    // Add more URLs of important pages...
  ];
}    
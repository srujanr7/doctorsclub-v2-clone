"use client";

import { useEffect, useState } from 'react';
import { useAuth, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import AddPatientDialog from '@/components/AddPatientDialog';
import { DataTable } from '@/components/table/DataTable';
import { patientColumns } from '@/components/table/patientColumns';
import { getTodayPatients, getAllPatients } from '@/lib/actions/patient.actions';
import { getDoctorById } from '@/lib/actions/doctor.actions';
import { FaHistory, FaCalendarDay, FaChartBar } from 'react-icons/fa';
import { BarChartWithLabel } from '@/components/charts/BarChartWithLabel';
import { LineChartWithLabel } from '@/components/charts/LineChartWithLabel';
import { PieChartWithLabel } from '@/components/charts/PieChartWithLabel';
import { IconSearch } from '@tabler/icons-react'

const Admin = () => {
  const { userId } = useAuth(); // doctorId will be userId from useAuth
  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [doctorName, setDoctorName] = useState<string>("");
  const [showInsights, setShowInsights] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  const doctorId = userId ?? '';

  const fetchPatients = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const fetchedPatients = showHistory
        ? await getAllPatients(userId)
        : await getTodayPatients(userId);

      setPatients(fetchedPatients.documents);
      setFilteredPatients(fetchedPatients.documents); // Initially, filteredPatients is the same as patients
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);  
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [userId, showHistory]);

  useEffect(() => {
    const fetchDoctorName = async () => {
      if (userId) {
        try {
          const doctor = await getDoctorById(userId);
          setDoctorName(doctor.doctorName);
        } catch (error) {
          console.error("Error fetching doctor details:", error);
        }
      }
    };

    fetchDoctorName();
  }, [userId]);

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();

    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: '2-digit',
      month: 'short'
    };
    setCurrentDate(now.toLocaleDateString('en-GB', options));
  }, []);

  // Filter patients when searchTerm changes
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPatients(patients); // Show all patients if search is empty
    } else {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        patient.phone.includes(searchTerm)
      );
      setFilteredPatients(filtered); // Update filteredPatients based on search
    }
  }, [searchTerm, patients]); 

  useEffect(() => {
    const handlePatientAdded = () => {
      fetchPatients();
    };

    window.addEventListener('patientAdded', handlePatientAdded as EventListener);

    return () => {
      window.removeEventListener('patientAdded', handlePatientAdded as EventListener);
    };
  }, [userId, showHistory]);

  return (
    <div className="mx-auto max-w-7xl flex flex-col space-y-14 px-4 md:px-8 lg:px-12">
      <header className="admin-header flex flex-row md:flex-row md:justify-between md:items-center">
        <Link href='/' className="cursor-pointer flex items-center mb-4 md:mb-0">
          <Image 
            src="/assets/icons/logo-doctorsclub.svg"
            height={92}
            width={112}
            alt="logo"
            className="h-25 w-55"     
          />        
        </Link>

        <div className="flex flex-row md:flex-row md:items-center md:space-x-4">
          <p className="text-lg font-semibold mr-4 text-center md:text-left">Dr. {doctorName}</p>
          <UserButton  />  
        </div>
      </header>

      <main className="admin-main">    
        <section className="w-full space-y-4">    
          <h1 className="header text-2xl sm:text-3xl">{greeting} 👋</h1>   
          <p className="text-dark-700 text-sm sm:text-base">Manage your patients list or view insights.</p> 
        </section>   

        <section className="w-full space-y-4">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-6">
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search patients "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 pl-10 border rounded-md focus:outline-none w-full" // Adjust width for different screens
              />
              <IconSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={20} />
            </div>    
            {/* Buttons Container */}
            <div className="flex flex-col md:flex-row md:space-x-4 mt-4 md:mt-0">
              {/* Add Patient Button */}
              {userId && <AddPatientDialog doctorId={userId} />} {/* Pass doctorId */}
              <div className="flex flex-row space-x-4 justify justify-between md:flex-row md:space-x-6 mt-4 md:mt-0">
                <button
                  className="btn btn-secondary flex items-center space-x-2 md:mb-0"
                  onClick={() => setShowHistory(prev => !prev)}
                >
                  {showHistory ? (
                    <>
                      <FaCalendarDay className="text-xl" />
                      <span>Show Today's Patients</span>
                    </>
                  ) : (
                    <>
                      <FaHistory className="text-xl" />
                      <span>Show History</span>
                    </>
                  )}
                </button>

                <button
                  className="btn btn-secondary flex items-center space-x-2"
                  onClick={() => setShowInsights(prev => !prev)}
                >
                  <FaChartBar className="text-xl" />
                  <span>{showInsights ? 'Show Patients List' : 'Show Insights'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>   

        <section className="w-full space-y-4">   
          {showInsights ? (
            <>                 
              <h2 className="text-xl md:text-2xl mt-4 mb-4 md:mb-8 ml-4 md:ml-4 font-semibold">Patient Insights</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <div className="chart-container">    
                  <h3 className="text-lg font-medium"></h3>
                  { userId && <BarChartWithLabel doctorId={userId} />} {/* Pass doctorId */}
                </div>          

                <div className="chart-container">   
                  <h3 className="text-lg font-medium"></h3>
                  { userId && <LineChartWithLabel doctorId={userId} />}  {/* Pass doctorId */}
                </div>
              </div> 
              <div className="chart-container col-span-1 md:col-span-2 flex justify-center items-center">  {/* Use Tailwind for height and column span */}     
                <div className="w-full h-full">
                  <h3 className="text-lg font-medium text-center"></h3>
                  {userId && <PieChartWithLabel doctorId={userId} />}   {/* Increase width and height */}
                </div>
              </div>  
            </>
          ) : (
            <>     
              <h2 className="text-xl md:text-2xl mt-4 mb-4 md:mb-8 ml-4 md:ml-4 font-semibold">Patient List</h2>
              <div className="overflow-x-auto"> {/* Ensure horizontal scroll if needed */}
                <DataTable columns={patientColumns} data={filteredPatients} /> {/* Use filteredPatients */}
              </div>
            </>     
          )}
        </section>                   

      </main>
    </div>       
  );
};

export default Admin;     
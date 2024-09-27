"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams to access query parameters
import { getAllDoctors } from "@/lib/actions/doctor.actions"; // Ensure the correct path for fetching doctors
import { getPatient, getUser } from "@/lib/actions/patient.actions";

interface DoctorProfile {
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  doctorName: string;
  specialty: string;
  email: string;
  doctorId: string;
}

interface UserProfile {
  name: string;
  userId: string;
}

const DashboardPage = () => {
  const searchParams = useSearchParams(); // Get query parameters from the URL
  const userId = searchParams.get("userId"); // Extract userId from query parameters
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]); 
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user information and doctor profiles
    const fetchUserAndDoctors = async () => { 
      try {   
        if (userId) {
          const user = await getUser(userId); // Fetch user by userId
           
          setUser(user); 

          // Fetch and map doctor data
          const doctorsData = await getAllDoctors();
          const mappedDoctors: DoctorProfile[] = doctorsData.map((doctor) => ({
            clinicName: doctor.clinicName,
            clinicAddress: doctor.clinicAddress,
            clinicPhone: doctor.clinicPhone,
            doctorName: doctor.doctorName,
            specialty: doctor.specialty,
            email: doctor.email,
            doctorId: doctor.doctorId,
          }));

          setDoctors(mappedDoctors);
        } else {
          setError("User ID is missing in the URL.");
        }
      } catch (err) {
        console.error("Error fetching user or doctor data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndDoctors();
  }, [userId]); // userId is a dependency for this effect

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Greeting the user by name */}
      <h1 className="text-3xl font-bold mb-6">
        Hello, {user?.name || "User"}!
      </h1>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor.doctorId} className="border p-4 rounded-lg shadow-lg">
            {/* Optional: Add a doctor image if available */}
            {/* <Image src={doctorImageUrl} alt={`${doctor.doctorName}`} width={100} height={100} className="rounded-full" /> */}
            <h2 className="text-xl font-bold mb-2">{doctor.doctorName}</h2>
            <p className="text-gray-700 mb-1">
              <strong>Specialty:</strong> {doctor.specialty}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Clinic:</strong> {doctor.clinicName}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Address:</strong> {doctor.clinicAddress}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Phone:</strong> {doctor.clinicPhone}
            </p>
            <p className="text-gray-700 mb-1"> 
              <strong>Email:</strong> {doctor.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage; 
// app/patients/[userId]/register/page.tsx

"use client";

import { registerPatient } from "@/lib/actions/patient.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const RegisterPatientPage = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneFromQuery = searchParams.get("phone"); // Fetch phone from query params
  const userIdFromQuery = searchParams.get("userId"); // Fetch userId from query params
  const [isLoading, setIsLoading] = useState(false);

  // Initialize patient data with additional fields
  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    phone: phoneFromQuery || "", // Pre-fill phone from query params
    userId: userIdFromQuery || "", // Pre-fill userId from query params 
    gender: "", // New field
    birthDate: "", // New field
    address: "", // New field  
    allergies: "",
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Include userId and phone in the patient data before sending it to the server
      await registerPatient(patientData);
      console.log("Patient registered successfully");

      // Redirect to a success page or dashboard
      router.push(`/dashboard?userId=${patientData.userId}`);  
    } catch (error) {   
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-2xl font-bold">Register Patient</h1>

      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={patientData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border rounded-md border-gray-300"
        />
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={patientData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border rounded-md border-gray-300"
        />
      </div>

      {/* Phone Input (hidden as it's pre-filled from the patient form) */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          name="phone"
          value={patientData.phone}
          readOnly // Read-only since it's pre-filled
          className="mt-1 block w-full p-2 border rounded-md border-gray-300 bg-gray-100"
        />
      </div>

      {/* Gender Input */}
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
        <select
          name="gender"
          value={patientData.gender}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border rounded-md border-gray-300"
        >
          <option value="" disabled>Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* BirthDate Input */}
      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Birth Date</label>
        <input
          type="date"
          name="birthDate"
          value={patientData.birthDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border rounded-md border-gray-300"
        />
      </div>

      {/* Address Input */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          name="address"
          value={patientData.address}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border rounded-md border-gray-300"
        />
      </div>

      <div>
        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Allergies (optional)</label>
        <input
          type="text" 
          name="allergies" 
          value={patientData.allergies}   
          onChange={handleChange}
          className="mt-1 block w-full p-2 border rounded-md border-gray-300"
        />
      </div>

      {/* Hidden UserId Input */}
      <input type="hidden" name="userId" value={patientData.userId} />

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md 
          hover:bg-blue-700 transition duration-200 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Submit Registration"}     
      </button>
    </form>  
  );
};

export default RegisterPatientPage;     
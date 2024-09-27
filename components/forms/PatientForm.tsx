// app/components/PatientForm.tsx

"use client";

import { createUser } from "@/lib/actions/patient.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState<string | undefined>(); // Phone number state

  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      // Call the createUser function to initiate the SMS OTP flow
      const newUser = await createUser({ phone: value as string });

      // Redirect to OTP verification page with userId and phone number   
      if (newUser) {
        router.push(`/verify-otp?userId=${newUser.userId}&phone=${value}`); // Pass userId and phone number
      }
    } catch (error) {
      console.error("Phone authentication failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="mb-12 space-y-4">
        <h1 className="header">Hi there 👋</h1>
        <p className="text-dark-700">Get started with appointments.</p>
      </section>

      {/* Phone Number Input */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <PhoneInput
          placeholder="Enter phone number"
          value={value}
          onChange={setValue}
          defaultCountry="IN"
          className={`mt-1 block w-full p-2 border rounded-md 
            ${!value ? 'border-red-500' : 'border-gray-300'} 
            bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit" 
        className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md 
          hover:bg-blue-700 transition duration-200 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading || !value}
      >
        {isLoading ? "Loading..." : "Get Started"}
      </button>
    </form>
  );
};
   
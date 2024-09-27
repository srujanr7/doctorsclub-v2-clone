"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerPatient } from "@/lib/actions/patient.actions";

export const PatientRegistrationForm = () => {
  const { handleSubmit, register } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const phone = searchParams.get("phone"); // Get phone from previous step

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      // Register the patient with full information
      await registerPatient({
        ...data,
        phone, // Automatically populate the phone
        userId, // Automatically populate the userId
      });

      router.push("/dashboard"); // Redirect after successful registration
    } catch (error) {
      console.error("Error registering patient:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h1 className="text-xl font-bold text-center">Complete Registration</h1>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          {...register("name", { required: true })}
          className="mt-1 block w-full p-2 border rounded-md border-gray-300"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email", { required: true })}
          className="mt-1 block w-full p-2 border rounded-md border-gray-300"
        />
      </div>

      {/* Gender */}
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          Gender
        </label>
        <select
          id="gender"
          {...register("gender", { required: true })}
          className="mt-1 block w-full p-2 border rounded-md border-gray-300"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* Birthdate */}
      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
          Birthdate
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Day"
            {...register("birthDate.day", { required: true })}
            className="w-1/3 p-2 border rounded-md border-gray-300"
          />
          <input
            type="number"
            placeholder="Month"
            {...register("birthDate.month", { required: true })}
            className="w-1/3 p-2 border rounded-md border-gray-300"
          />
          <input
            type="number"
            placeholder="Year"
            {...register("birthDate.year", { required: true })}
            className="w-1/3 p-2 border rounded-md border-gray-300"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          id="address"
          {...register("address", { required: true })}
          className="mt-1 block w-full p-2 border rounded-md border-gray-300"
        />
      </div>

      {/* Allergies (optional) */}
      <div>
        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
          Allergies (optional)
        </label>
        <input
          id="allergies"
          {...register("allergies")}
          className="mt-1 block w-full p-2 border rounded-md border-gray-300"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md 
          hover:bg-blue-700 transition duration-200 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}  
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};   
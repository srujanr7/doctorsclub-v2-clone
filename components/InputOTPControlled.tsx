// app/components/InputOTPControlled.tsx

"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { verifyPhoneLogin } from "@/lib/actions/patient.actions";

export function InputOTPControlled() {
  const [otp, setOtp] = React.useState(""); // OTP state
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const phone = searchParams.get("phone"); // Get phone from query parameters

  const verifyOTP = async () => {
    setIsLoading(true);
    setError(null);

    try {   
      // Call the API to verify the OTP
      const session = await verifyPhoneLogin(userId as string, otp);
  
      // On success, navigate to the registration page and pass the phone number and userId
      if (session) {
        router.push(`/patients/${userId}/register?phone=${phone}&userId=${userId}`); // Pass the phone and userId to the registration page
      }
    } catch (error) {
      console.error("OTP Verification Failed:", error);
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-center">Verify OTP</h1>

      {/* OTP Input */}
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={setOtp}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      {/* Error Message */}
      {error && <div className="text-red-500 text-center">{error}</div>}

      {/* Submit Button */}
      <button
        onClick={verifyOTP}
        className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md 
          hover:bg-blue-700 transition duration-200 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading || otp.length < 6}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
}
    
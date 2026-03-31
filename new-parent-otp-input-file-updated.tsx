"use client";

import { useState } from "react";
import { OTPInput } from "@/components/OTPInput";
import { cn } from "@/utils/cn";

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const length = 6;
  const isComplete = otp.length === length;

  const handleVerify = async () => {
    if (!isComplete) return;

    try {
      setLoading(true);
      setError("");

      console.log("Verify OTP:", otp);

      await new Promise((r) => setTimeout(r, 1500));

      alert("OTP Verified ✅");
    } catch {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setOtp("");
    setError("");
    console.log("Resend OTP...");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isComplete && !loading) {
      handleVerify();
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <OTPInput
        length={length}
        onChange={setOtp}
        onComplete={(code) => console.log("Complete:", code)}
        onKeyDown={handleKeyDown}
        error={error}
        isLoading={loading}
      />

      {/* Buttons */}
      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={handleResend}
          disabled={loading}
          className="border border-stone-800 py-3.5 rounded-md"
        >
          Resend Code
        </button>

        <button
          onClick={handleVerify}
          disabled={!isComplete || loading}
          className={cn(
            "py-3.5 rounded-md font-medium",
            isComplete
              ? "bg-[#1db89a] text-white"
              : "border border-stone-800 opacity-40",
          )}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}

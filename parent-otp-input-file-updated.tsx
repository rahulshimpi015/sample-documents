"use client";

import { useState } from "react";
import { OTPInput } from "@/components/OTPInput";

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const length = 6;
  const isComplete = otp.length === length;

  const handleVerify = async () => {
    if (!isComplete) return;

    try {
      setLoading(true);
      setError("");

      console.log("Verifying OTP:", otp);

      await new Promise((res) => setTimeout(res, 1500));

      alert("OTP Verified ✅");
    } catch (err) {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      setOtp("");
      setError("");

      console.log("Resending OTP...");

      await new Promise((res) => setTimeout(res, 1000));
    } finally {
      setLoading(false);
    }
  };

  // ✅ ENTER KEY HANDLED HERE (Parent Control)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isComplete && !loading) {
      handleVerify();
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <OTPInput
        length={length}
        value={otp}
        onChange={setOtp}
        onKeyDown={handleKeyDown}
        error={error}
        disabled={loading}
      />

      {/* Buttons */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleResend}
          disabled={loading}
          className="border border-black py-3 rounded"
        >
          Resend OTP
        </button>

        <button
          onClick={handleVerify}
          disabled={!isComplete || loading}
          className="bg-green-500 text-white py-3 rounded disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}

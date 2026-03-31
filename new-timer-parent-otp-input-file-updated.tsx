"use client";

import { useEffect, useState } from "react";
import { OTPInput } from "@/components/OTPInput";

const RESEND_KEY = "otp_resend_expiry";

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(0);

  const length = 6;
  const isComplete = otp.length === length;

  // ─────────────────────────────────────────
  // INIT TIMER FROM LOCAL STORAGE
  // ─────────────────────────────────────────
  useEffect(() => {
    const expiry = localStorage.getItem(RESEND_KEY);

    if (expiry) {
      const remaining = Math.floor((+expiry - Date.now()) / 1000);
      if (remaining > 0) {
        setTimeLeft(remaining);
      }
    }
  }, []);

  // ─────────────────────────────────────────
  // TIMER COUNTDOWN
  // ─────────────────────────────────────────
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // ─────────────────────────────────────────
  // VERIFY
  // ─────────────────────────────────────────
  const handleVerify = async () => {
    if (!isComplete) return;

    try {
      setLoading(true);
      setError("");

      await new Promise((r) => setTimeout(r, 1500));
      alert("OTP Verified ✅");
    } catch {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // RESEND
  // ─────────────────────────────────────────
  const handleResend = () => {
    // Set expiry = now + 30 sec
    const expiry = Date.now() + 30000;
    localStorage.setItem(RESEND_KEY, expiry.toString());

    // Reload page (timer continues)
    window.location.reload();
  };

  // ─────────────────────────────────────────
  // ENTER KEY
  // ─────────────────────────────────────────
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
        onKeyDown={handleKeyDown}
        error={error}
        isLoading={loading}
      />

      {/* ───────────────────────────── */}
      {/* TIMER / RESEND UI */}
      {/* ───────────────────────────── */}
      <div className="mt-6 text-center">
        {timeLeft > 0 ? (
          <p className="text-sm text-stone-500">
            Resend OTP in <span className="font-medium">{timeLeft}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-blue-600 underline text-sm"
          >
            Resend OTP
          </button>
        )}
      </div>

      {/* VERIFY BUTTON */}
      <button
        onClick={handleVerify}
        disabled={!isComplete || loading}
        className="w-full mt-4 py-3 bg-green-500 text-white rounded disabled:opacity-40"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}

"use client";

import { useRef } from "react";
import Input from "@/components/Input";
import { cn } from "@/utils/cn";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onKeyDown,
  error,
  disabled,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otp = value.split("").concat(Array(length).fill("")).slice(0, length);

  const updateOtp = (next: string[]) => {
    onChange(next.join(""));
  };

  const handleChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;

    updateOtp(next);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDownInternal = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    onKeyDown?.(e); // 👈 propagate to parent

    if (e.key === "Backspace") {
      const next = [...otp];

      if (otp[index]) {
        next[index] = "";
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        next[index - 1] = "";
      }

      updateOtp(next);
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    const next = Array(length).fill("");
    pasted.split("").forEach((c, i) => (next[i] = c));

    updateOtp(next);

    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            value={digit}
            maxLength={1}
            disabled={disabled}
            className={cn(
              "!w-12 !h-12 text-center text-xl",
              error && "!border-red-500",
            )}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDownInternal(index, e)}
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

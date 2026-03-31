"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Input from "@/components/Input";
import { cn } from "@/utils/cn";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

interface OTPInputProps {
  length?: number;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  error?: string;
  isLoading?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;

  topLabel?: string;
  title?: string;
  description?: string;
}

// ─────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────

function getCellClassName(
  index: number,
  digit: string,
  focused: number | null,
  hasError: boolean,
): string {
  return cn(
    "!w-10 sm:!w-14",
    "!h-12 sm:!h-16",
    "!px-0 !py-0",
    "text-center text-2xl sm:text-3xl font-serif",
    "transition-all duration-150",

    hasError && "!border-b-red-600 !text-red-600 !caret-red-600",
    !hasError && focused === index && "!border-b-stone-900 -translate-y-0.5",
    !hasError &&
      focused !== index &&
      digit &&
      "!border-b-stone-900 !text-stone-900",
    !hasError && focused !== index && !digit && "!border-b-stone-400",
  );
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export function OTPInput({
  length = 6,
  onChange,
  onComplete,
  onKeyDown,
  error = "",
  isLoading = false,
  disabled = false,
  autoFocus = true,
  topLabel = "ACCOUNT CREATION",
  title = "We've sent you a code",
  description = "Your email has been verified. We sent you an email with a code. Please paste the code provided.",
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [focused, setFocused] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const hasError = !!error;
  const isInteractive = !disabled && !isLoading;

  // Autofocus
  useEffect(() => {
    if (autoFocus) inputRefs.current[0]?.focus();
  }, [autoFocus]);

  // Shake animation
  useEffect(() => {
    if (!error) return;
    setShake(true);
    const id = setTimeout(() => setShake(false), 600);
    return () => clearTimeout(id);
  }, [error]);

  // Update OTP
  const updateOtp = useCallback(
    (next: string[]) => {
      setOtp(next);
      const code = next.join("");
      onChange?.(code);
      if (next.every((d) => d !== "")) onComplete?.(code);
    },
    [onChange, onComplete],
  );

  // Handlers
  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    updateOtp(next);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    onKeyDown?.(e); // pass Enter to parent

    switch (e.key) {
      case "Backspace":
        if (otp[index]) {
          const next = [...otp];
          next[index] = "";
          updateOtp(next);
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          const next = [...otp];
          next[index - 1] = "";
          updateOtp(next);
        }
        break;

      case "ArrowLeft":
        if (index > 0) inputRefs.current[index - 1]?.focus();
        break;

      case "ArrowRight":
        if (index < length - 1) inputRefs.current[index + 1]?.focus();
        break;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;

    const next = Array(length).fill("");
    pasted.split("").forEach((char, i) => (next[i] = char));

    updateOtp(next);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full pb-8",
        shake && "animate-[otpShake_0.55s_ease]",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10 sm:mb-12">
        <span className="text-[10px] font-medium tracking-[0.18em] text-stone-700 uppercase">
          {topLabel}
        </span>
      </div>

      {/* Title */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="font-serif text-[2rem] sm:text-[2.5rem] text-stone-900 mb-3">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-stone-500">{description}</p>
      </div>

      {/* OTP */}
      <div className="mb-2">
        <div
          className="flex justify-center gap-2 sm:gap-3"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={digit}
              maxLength={1}
              disabled={!isInteractive}
              className={getCellClassName(index, digit, focused, hasError)}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => setFocused(index)}
              onBlur={() => setFocused(null)}
            />
          ))}
        </div>

        {hasError && (
          <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}

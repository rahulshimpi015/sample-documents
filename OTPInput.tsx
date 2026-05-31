import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Input from '@/components/input';
import type { OTPInputHandle, OTPInputProps } from '@/types/otp-input';
import { getOTPCellClassName } from '@/utils/getOTPCellClassName';
import { numberRegex } from '@/constants/regex';
import ErrorMessage from './ErrorMessage';

export const OTPInput = forwardRef<OTPInputHandle, OTPInputProps>(function OTPInput(
  {
    length = 6,
    onChange,
    onComplete,
    onCompleteChange,
    error = '',
    isLoading = false,
    disabled = false,
    autoFocus = true,
  },
  ref
) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [focused, setFocused] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpRef = useRef(otp);
  useEffect(() => {
    otpRef.current = otp;
  });

  const hasError = !!error;
  const isInteractive = !disabled && !isLoading;

  const updateOtp = useCallback(
    (next: string[]) => {
      const complete = next.every(d => d !== '');
      setOtp(next);
      onChange?.(next.join(''));
      onCompleteChange?.(complete);
      if (complete) onComplete?.(next.join(''));
    },
    [onChange, onComplete, onCompleteChange]
  );

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        const empty = Array(length).fill('');
        setOtp(empty);
        onChange?.('');
        onCompleteChange?.(false);
        setTimeout(() => inputRefs.current[0]?.focus(), 0);
      },
      getValue() {
        const current = otpRef.current;
        return current.every(d => d !== '') ? current.join('') : '';
      },
      async pasteFromClipboard() {
        try {
          const text = await navigator.clipboard.readText();
          const digits = text.replace(/\D/g, '').slice(0, length);
          if (!digits) return false;
          const next = Array(length).fill('');
          digits.split('').forEach((char, i) => {
            next[i] = char;
          });
          updateOtp(next);
          //inputRefs.current[Math.min(digits.length, length - 1)]?.focus();
          return true;
        } catch {
          return false;
        }
      },
    }),
    [length, onChange, onCompleteChange, updateOtp]
  );

  useEffect(() => {
    if (autoFocus) inputRefs.current[0]?.focus();
  }, [autoFocus]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(numberRegex, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    updateOtp(next);
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else {
      inputRefs.current[index]?.blur();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Backspace':
        if (otp[index]) {
          const next = [...otp];
          next[index] = '';
          updateOtp(next);
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          const next = [...otp];
          next[index - 1] = '';
          updateOtp(next);
        }
        break;
      case 'ArrowLeft':
        if (index > 0) inputRefs.current[index - 1]?.focus();
        break;
      case 'ArrowRight':
        if (index < length - 1) inputRefs.current[index + 1]?.focus();
        break;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(numberRegex, '').slice(0, length);
    if (!pasted) return;
    const next = Array(length).fill('');
    pasted.split('').forEach((char, i) => {
      next[i] = char;
    });
    updateOtp(next);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
    inputRefs.current[Math.min(pasted.length, length - 1)]?.blur();
  };

  return (
    <>
      {hasError && (
        <div className="mb-5">
          <ErrorMessage message={error ?? null} data-testid="otp-error" />
        </div>
      )}
      <div
        role="group"
        aria-label="One-time password input"
        className="flex justify-center gap-2 md:gap-4 lg:gap-6"
        onPaste={handlePaste}
      >
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={el => {
              inputRefs.current[index] = el;
            }}
            id={`otp-digit-${index}`}
            type="text"
            inputMode="numeric"
            placeholder="-"
            maxLength={1}
            value={digit}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            disabled={!isInteractive}
            variant={hasError ? 'error' : 'default'}
            className={getOTPCellClassName(index, digit, focused, hasError)}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onFocus={() => setFocused(index)}
            onBlur={() => setFocused(null)}
            aria-label={`Digit ${index + 1} of ${length}`}
            containerClassName="pb-0"
          />
        ))}
      </div>
    </>
  );
});

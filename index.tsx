import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import BannerLayout from '@/layout/banner';
import Button from '@/components/button';
import { OTPInput } from '@/components/OTPInput';
import type { OTPInputHandle } from '@/types/otp-input';
import { COOLDOWN_SECONDS, formatTime, getSecondsLeft, LS_KEY } from '@/utils/getSecondsLeft';
import { getDeviceView } from '@/utils/view-detect';
import { maskEmail } from '@/utils/maskEmail';
import HeaderNavigation from '@/components/HeaderNavigation';
import copyClipboardIcon from '@/assets/images/copy-clipboard.svg';
import otpContent from '@/content/otp.json';
import { cn } from '@/utils/cn';

export default function OTPVerification() {
  const navigate = useNavigate();
  const otpRef = useRef<OTPInputHandle>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [pasteError, setPasteError] = useState(false);
  const { isApp } = getDeviceView();

  //TODO: Once the API is availble. we will implement the API logic and remove the query parameter logic
  const [searchParams] = useSearchParams();
  const otpType = searchParams.get('type');

  useEffect(() => {
    try {
      if (!localStorage.getItem(LS_KEY)) {
        localStorage.setItem(LS_KEY, Date.now().toString());
      }
    } catch {
      /* ignore — timer still works in-memory */
    }
    const remaining = getSecondsLeft();
    if (remaining > 0) {
      setSecondsLeft(remaining);
    }
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const id = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [secondsLeft]);

  const handleResend = useCallback(() => {
    (document.activeElement as HTMLElement)?.blur();
    try {
      localStorage.setItem(LS_KEY, Date.now().toString());
    } catch {
      /* ignore — timer still works in-memory */
    }
    setSecondsLeft(COOLDOWN_SECONDS);
    otpRef.current?.reset();
    setError('');
  }, []);

  const handlePasteFromClipboard = async () => {
    const filled = await otpRef.current?.pasteFromClipboard();
    if (!filled) {
      setPasteError(true);
      setTimeout(() => setPasteError(false), 2000);
    }
  };

  const handleVerify = async (code?: string) => {
    const otpCode = code ?? otpRef.current?.getValue();
    if (!otpCode) return;
    setIsLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 5000));
    try {
      if (otpCode === '123456') {
        alert('OTP verified successfully');
      } else {
        setError(otpContent.INVALID_CODE);
        setIsLoading(false);
        setIsComplete(false);
      }
    } catch {
      setError('API Error Set Here');
    } finally {
      setIsLoading(false);
    }
  };

  const onBack = () => {
    navigate(PATHS.login);
    localStorage.removeItem(LS_KEY);
  };

  const isInteractive = !isLoading;
  const canResend = secondsLeft === 0 && !isLoading;

  return (
    <BannerLayout>
      <div className="mx-auto flex h-full max-w-md flex-col lg:justify-center-safe">
        {isApp && <HeaderNavigation onBack={onBack} />}
        <section className="grow p-6 md:grow-0 md:pt-20">
          <h1 className="font-neo-display mb-6 text-left text-[28px] leading-12 font-bold md:mb-8 md:text-center md:text-[40px]">
            {otpContent.WE_SENT_CODE}
          </h1>
          {otpType === 'email' ? (
            <p className="font-poppins font-400 text-grey mx-auto text-left text-sm leading-6 md:text-center md:text-lg">
              {otpContent.ENTER_EMAIL_CODE}
              <span className="text-primary font-bold">{maskEmail('john.smith@sjp.co.uk')}</span>
            </p>
          ) : (
            <p className="font-poppins font-400 text-grey mx-auto text-left text-sm leading-6 md:text-center md:text-lg">
              {otpContent.ENTER_THE_CODE}
              <span className="text-primary font-bold">3456</span>
            </p>
          )}

          <div className="mt-10 flex flex-col items-center md:mt-16">
            <OTPInput
              ref={otpRef}
              error={error}
              isLoading={isLoading}
              onCompleteChange={setIsComplete}
              onComplete={handleVerify}
            />
            <div className="mt-6.5 flex justify-center">
              <Button
                variant="link"
                onClick={handlePasteFromClipboard}
                disabled={isComplete || !isInteractive}
                className="items-center gap-2"
              >
                <img src={copyClipboardIcon} alt="copy-clipboard" />
                {pasteError ? otpContent.NOTHING_TO_PASTE : otpContent.PASTE_FROM_CLIPBOARD}
              </Button>
            </div>
          </div>
        </section>
        <footer
          className={cn(
            'mb-10 pt-4 pr-6 pb-4 pl-6 md:mb-24 md:pb-4 lg:pt-0',
            isApp ? 'mt-auto mb-10 pb-0 md:mb-10' : ''
          )}
        >
          <div className="mx-auto flex max-w-md flex-col gap-6">
            <div className="flex items-center justify-center">
              {secondsLeft > 0 ? (
                <p
                  className="font-poppins text-primary text-sm leading-3.5 font-semibold no-underline opacity-50"
                  data-testid="resent-otp"
                >
                  <span className="underline">
                    {otpContent.RESEND_CODE_WAIT.replace('{{sec}}', formatTime(secondsLeft))}
                  </span>
                </p>
              ) : (
                <Button
                  variant="link"
                  onClick={handleResend}
                  disabled={!canResend || isComplete || isLoading}
                  aria-label={secondsLeft > 0 ? `Resend Code (0:${secondsLeft})` : 'Resend Code'}
                >
                  {otpContent.RESEND_CODE}
                </Button>
              )}
            </div>
            <Button
              variant="primary"
              onClick={() => handleVerify()}
              disabled={!isComplete || isLoading}
              loading={isLoading}
            >
              {otpContent.VERIFY}
            </Button>
          </div>
        </footer>
      </div>
    </BannerLayout>
  );
}

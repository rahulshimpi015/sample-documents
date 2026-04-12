import { useState } from "react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ── cn utility ────────────────────────────────────────────────────────────────
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const SuccessIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
  </svg>
);
const ErrorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
  </svg>
);
const WarningIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} aria-hidden="true">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" /><path d="M12 17h.01" />
  </svg>
);
const InfoIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
  </svg>
);
const CloseIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} aria-hidden="true">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

// ── CVA Variants ──────────────────────────────────────────────────────────────
const alertVariants = cva(
  ["relative flex w-full items-start gap-3 rounded-xl border px-4 py-3.5",
   "text-sm font-medium leading-relaxed transition-all duration-200"],
  {
    variants: {
      variant: {
        success: "border-emerald-200 bg-emerald-50 text-emerald-800",
        error:   "border-red-200 bg-red-50 text-red-800",
        warning: "border-amber-200 bg-amber-50 text-amber-800",
        info:    "border-blue-200 bg-blue-50 text-blue-800",
      },
      size: {
        sm: "px-3 py-2.5 text-xs",
        md: "px-4 py-3.5 text-sm",
        lg: "px-5 py-4 text-base",
      },
    },
    defaultVariants: { variant: "info", size: "md" },
  }
);

const iconVariants = cva("mt-0.5", {
  variants: {
    variant: {
      success: "text-emerald-500",
      error:   "text-red-500",
      warning: "text-amber-500",
      info:    "text-blue-500",
    },
    size: { sm: "size-3.5", md: "size-4", lg: "size-5" },
  },
  defaultVariants: { variant: "info", size: "md" },
});

const closeBtnVariants = cva(
  ["ml-auto -mr-1 -mt-0.5 rounded-md p-1",
   "opacity-60 transition-opacity hover:opacity-100",
   "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"],
  {
    variants: {
      variant: {
        success: "hover:bg-emerald-100 focus-visible:ring-emerald-400",
        error:   "hover:bg-red-100 focus-visible:ring-red-400",
        warning: "hover:bg-amber-100 focus-visible:ring-amber-400",
        info:    "hover:bg-blue-100 focus-visible:ring-blue-400",
      },
    },
    defaultVariants: { variant: "info" },
  }
);

const ICONS = { success: SuccessIcon, error: ErrorIcon, warning: WarningIcon, info: InfoIcon };

// ── Alert Component ───────────────────────────────────────────────────────────
function Alert({
  variant = "info",
  size = "md",
  message,
  description,
  icon,
  dismissible = false,
  onDismiss,
  className,
  ...rest
}) {
  const IconComponent = ICONS[variant];
  const iconClass = iconVariants({ variant, size });

  const renderIcon = () => {
    if (icon === false) return null;
    if (icon !== undefined) return <span className={iconClass}>{icon}</span>;
    return <IconComponent className={iconClass} />;
  };

  return (
    <div role="alert" aria-live="polite"
      className={cn(alertVariants({ variant, size }), className)} {...rest}>
      {renderIcon()}
      <div className="flex-1 min-w-0">
        <p className="font-semibold leading-snug">{message}</p>
        {description && (
          <p className="mt-0.5 font-normal opacity-80 leading-relaxed">{description}</p>
        )}
      </div>
      {dismissible && (
        <button type="button" aria-label="Dismiss alert"
          onClick={onDismiss} className={closeBtnVariants({ variant })}>
          <CloseIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const BADGE = {
  success: "bg-emerald-100 text-emerald-700",
  error:   "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  info:    "bg-blue-100 text-blue-700",
};

export default function AlertDemo() {
  const [dismissed, setDismissed] = useState({});
  const dismiss = (key) => setDismissed((p) => ({ ...p, [key]: true }));
  const reset   = () => setDismissed({});

  const Section = ({ title, children }) => (
    <section className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</h2>
      {children}
    </section>
  );

  const Tag = ({ variant, label }) => (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", BADGE[variant])}>
      {label}
    </span>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Alert Component</h1>
            <p className="text-xs text-slate-500 mt-0.5">React · TypeScript · Tailwind · CVA · clsx · tailwind-merge</p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["success","error","warning","info"].map((v) => <Tag key={v} variant={v} label={v} />)}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-8 py-10 space-y-10">

        {/* All 4 variants */}
        <Section title="Variants">
          <Alert variant="success" message="Profile updated successfully." />
          <Alert variant="error"   message="Something went wrong. Please try again." />
          <Alert variant="warning" message="Your session will expire in 5 minutes." />
          <Alert variant="info"    message="A new version is available." />
        </Section>

        {/* With description */}
        <Section title="With description">
          <Alert
            variant="success"
            message="Payment confirmed!"
            description="Your order #8821 has been placed. You'll receive a confirmation email shortly."
          />
          <Alert
            variant="error"
            message="Upload failed"
            description="The file exceeds the 10 MB limit. Please compress it or choose a smaller file."
          />
        </Section>

        {/* Sizes */}
        <Section title="Sizes">
          <Alert variant="info" size="sm" message="Small — compact alerts for tight spaces." />
          <Alert variant="info" size="md" message="Medium — the default size for most use cases." />
          <Alert variant="info" size="lg" message="Large — prominent alerts for critical messages." />
        </Section>

        {/* Dismissible */}
        <Section title="Dismissible">
          {!dismissed["a"] && (
            <Alert variant="success" message="You're all set! Welcome aboard."
              dismissible onDismiss={() => dismiss("a")} />
          )}
          {!dismissed["b"] && (
            <Alert variant="error" message="Payment method declined."
              description="Please update your card details in billing settings."
              dismissible onDismiss={() => dismiss("b")} />
          )}
          {(dismissed["a"] || dismissed["b"]) && (
            <button onClick={reset}
              className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-700">
              ↺ Reset dismissed alerts
            </button>
          )}
        </Section>

        {/* Custom className override */}
        <Section title="Custom className (extra classes)">
          <Alert
            variant="warning"
            message="Shadow and rounded-2xl override via className prop."
            className="rounded-2xl shadow-lg shadow-amber-100 ring-1 ring-amber-300"
          />
          <Alert
            variant="info"
            message="Full-width on mobile, max-width constrained on larger screens."
            className="sm:max-w-sm"
          />
        </Section>

        {/* No icon */}
        <Section title="No icon">
          <Alert variant="error" message="Icon hidden with icon={false}." icon={false} />
        </Section>

        {/* Custom icon */}
        <Section title="Custom icon slot">
          <Alert
            variant="success"
            message="Custom emoji icon passed via the icon prop."
            icon={<span className="text-base leading-none">🚀</span>}
          />
        </Section>

      </main>

      <footer className="text-center py-8 text-xs text-slate-400">
        All styles merged via <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">cn(alertVariants(...), className)</code>
      </footer>
    </div>
  );
}

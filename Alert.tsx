import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Utility ────────────────────────────────────────────────────────────────

/** Drop-in replacement for cn() — merges clsx + tailwind-merge */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const SuccessIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("shrink-0", className)}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ErrorIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("shrink-0", className)}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

const WarningIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("shrink-0", className)}
    aria-hidden="true"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("shrink-0", className)}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("shrink-0", className)}
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

// ─── CVA Variants ────────────────────────────────────────────────────────────

const alertVariants = cva(
  // Base styles applied to every variant
  [
    "relative flex w-full items-start gap-3 rounded-xl border px-4 py-3.5",
    "text-sm font-medium leading-relaxed",
    "transition-all duration-200",
  ],
  {
    variants: {
      variant: {
        success: [
          "border-emerald-200 bg-emerald-50 text-emerald-800",
          "dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
        ],
        error: [
          "border-red-200 bg-red-50 text-red-800",
          "dark:border-red-800 dark:bg-red-950/50 dark:text-red-300",
        ],
        warning: [
          "border-amber-200 bg-amber-50 text-amber-800",
          "dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
        ],
        info: [
          "border-blue-200 bg-blue-50 text-blue-800",
          "dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
        ],
      },
      size: {
        sm: "px-3 py-2.5 text-xs",
        md: "px-4 py-3.5 text-sm",
        lg: "px-5 py-4 text-base",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "md",
    },
  }
);

const iconVariants = cva("mt-0.5", {
  variants: {
    variant: {
      success: "text-emerald-500 dark:text-emerald-400",
      error: "text-red-500 dark:text-red-400",
      warning: "text-amber-500 dark:text-amber-400",
      info: "text-blue-500 dark:text-blue-400",
    },
    size: {
      sm: "size-3.5",
      md: "size-4",
      lg: "size-5",
    },
  },
  defaultVariants: {
    variant: "info",
    size: "md",
  },
});

const closeBtnVariants = cva(
  [
    "ml-auto -mr-1 -mt-0.5 rounded-md p-1",
    "opacity-60 transition-opacity hover:opacity-100",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
  ],
  {
    variants: {
      variant: {
        success: "hover:bg-emerald-100 focus-visible:ring-emerald-400 dark:hover:bg-emerald-900",
        error: "hover:bg-red-100 focus-visible:ring-red-400 dark:hover:bg-red-900",
        warning: "hover:bg-amber-100 focus-visible:ring-amber-400 dark:hover:bg-amber-900",
        info: "hover:bg-blue-100 focus-visible:ring-blue-400 dark:hover:bg-blue-900",
      },
    },
    defaultVariants: { variant: "info" },
  }
);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Main alert message */
  message: string;
  /** Optional longer description rendered below the message */
  description?: string;
  /**
   * Override the default icon.
   * - Pass a `ReactElement` to use a custom icon.
   * - Pass `false` to hide the icon entirely.
   * - Omit to use the default icon for the current variant.
   */
  icon?: React.ReactElement | false;
  /** Show a dismiss (×) button */
  dismissible?: boolean;
  /** Callback fired when the dismiss button is clicked */
  onDismiss?: () => void;
  // className is inherited from React.HTMLAttributes<HTMLDivElement> — no re-declaration needed
}

// ─── Icon map ────────────────────────────────────────────────────────────────

const DEFAULT_ICONS = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
} as const;

// ─── Component ───────────────────────────────────────────────────────────────

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "info",
      size = "md",
      message,
      description,
      icon,
      dismissible = false,
      onDismiss,
      className,
      ...rest
    },
    ref
  ) => {
    // Normalise variant: VariantProps types it as string | null | undefined,
    // but our destructuring default guarantees it is one of the four keys at runtime.
    const resolvedVariant = (variant ?? "info") as keyof typeof DEFAULT_ICONS;
    const IconComponent = DEFAULT_ICONS[resolvedVariant];
    const iconClass = iconVariants({ variant: resolvedVariant, size });

    // Resolve which icon to render
    const renderIcon = () => {
      if (icon === false) return null;
      if (icon !== undefined) return <span className={iconClass}>{icon}</span>;
      return <IconComponent className={iconClass} />;
    };

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={cn(alertVariants({ variant: resolvedVariant, size }), className)}
        {...rest}
      >
        {/* Icon */}
        {renderIcon()}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold leading-snug">{message}</p>
          {description && (
            <p className="mt-0.5 font-normal opacity-80 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            type="button"
            aria-label="Dismiss alert"
            onClick={onDismiss}
            className={closeBtnVariants({ variant: resolvedVariant })}
          >
            <CloseIcon className="size-3.5" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export default Alert;

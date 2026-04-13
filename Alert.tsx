import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Utility ─────────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Icons ────────────────────────────────────────────────────────────────────
// No className prop — size is controlled directly by the parent via width/height.
// Only stroke color is inherited via `currentColor` (set on the icon wrapper).

const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

// ─── CVA Variants ─────────────────────────────────────────────────────────────

const alertVariants = cva(
  [
    "relative flex w-full items-start gap-3 rounded-xl border",
    "transition-all duration-200",
  ],
  {
    variants: {
      variant: {
        // text-black is always applied in the component directly.
        // These only control border and background.
        success: "border-emerald-200 bg-emerald-50",
        error:   "border-red-200 bg-red-50",
        warning: "border-amber-200 bg-amber-50",
        info:    "border-blue-200 bg-blue-50",
      },
      size: {
        sm: "px-3 py-2.5",
        md: "px-4 py-3.5",
        lg: "px-5 py-4",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "md",
    },
  }
);

// Icon wrapper: controls size + color per variant
const iconWrapperVariants = cva(
  // flex-shrink-0 keeps icon from squishing; mt aligns with first text line
  "mt-0.5 shrink-0",
  {
    variants: {
      variant: {
        success: "text-emerald-500",
        error:   "text-red-500",
        warning: "text-amber-500",
        info:    "text-blue-500",
      },
      size: {
        sm: "w-5 h-5",
        md: "w-6 h-6",
        lg: "w-7 h-7",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "md",
    },
  }
);

const closeBtnVariants = cva(
  [
    "ml-auto -mr-1 -mt-0.5 shrink-0 rounded-md p-1 w-6 h-6",
    "opacity-60 transition-opacity hover:opacity-100",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
  ],
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

const textSizeVariants = cva("", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: { size: "md" },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AlertLinkProps {
  /** The visible label for the link */
  label: string;
  /** The href/URL the link navigates to */
  href: string;
  /** Optional target — defaults to "_self" */
  target?: React.HTMLAttributeAnchorTarget;
}

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Optional primary heading — bold when messageBold is true */
  message?: string;
  /** Whether to render message in bold (default: true) */
  messageBold?: boolean;
  /** Optional supporting description */
  description?: string;
  /** Whether to render description in bold (default: false) */
  descriptionBold?: boolean;
  /**
   * Optional link rendered below the description / message.
   * Provide `{ label, href }` to show it.
   */
  link?: AlertLinkProps;
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
  // className is inherited from React.HTMLAttributes<HTMLDivElement>
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

const DEFAULT_ICONS = {
  success: SuccessIcon,
  error:   ErrorIcon,
  warning: WarningIcon,
  info:    InfoIcon,
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant       = "info",
      size          = "md",
      message,
      messageBold   = true,
      description,
      descriptionBold = false,
      link,
      icon,
      dismissible   = false,
      onDismiss,
      className,
      ...rest
    },
    ref
  ) => {
    // Resolve variant safely — VariantProps allows null | undefined
    const resolvedVariant = (variant ?? "info") as keyof typeof DEFAULT_ICONS;
    const resolvedSize    = size ?? "md";

    const IconComponent = DEFAULT_ICONS[resolvedVariant];

    const renderIcon = () => {
      if (icon === false) return null;

      const wrapperClass = iconWrapperVariants({
        variant: resolvedVariant,
        size: resolvedSize,
      });

      if (icon !== undefined) {
        return <span className={wrapperClass}>{icon}</span>;
      }

      return (
        <span className={wrapperClass}>
          <IconComponent />
        </span>
      );
    };

    const baseSizeClass = textSizeVariants({ size: resolvedSize });

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={cn(
          alertVariants({ variant: resolvedVariant, size: resolvedSize }),
          "text-black", // always black text regardless of variant
          className
        )}
        {...rest}
      >
        {/* Icon */}
        {renderIcon()}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Message */}
          {message && (
            <p
              className={cn(
                baseSizeClass,
                "leading-snug",
                messageBold ? "font-semibold" : "font-normal"
              )}
            >
              {message}
            </p>
          )}

          {/* Description */}
          {description && (
            <p
              className={cn(
                baseSizeClass,
                "leading-relaxed",
                message ? "mt-0.5" : "",
                descriptionBold ? "font-semibold" : "font-normal"
              )}
            >
              {description}
            </p>
          )}

          {/* Optional link */}
          {link && (
            <a
              href={link.href}
              target={link.target ?? "_self"}
              rel={
                link.target === "_blank" ? "noopener noreferrer" : undefined
              }
              className={cn(
                baseSizeClass,
                "mt-1 inline-block font-medium underline underline-offset-2",
                "hover:opacity-70 transition-opacity",
                // link color matches the variant accent
                resolvedVariant === "success" && "text-emerald-700",
                resolvedVariant === "error"   && "text-red-700",
                resolvedVariant === "warning" && "text-amber-700",
                resolvedVariant === "info"    && "text-blue-700"
              )}
            >
              {link.label}
            </a>
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
            <CloseIcon />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export default Alert;

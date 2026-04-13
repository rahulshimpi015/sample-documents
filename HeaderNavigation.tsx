import React from "react";
import { clsx, type ClassValue } from "clsx";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// ─── Utility: cn ─────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── CVA Variants ─────────────────────────────────────────────────────────────

const headerVariants = cva("flex items-center w-full px-4", {
  variants: {
    variant: {
      default: "bg-white border-b border-gray-100",
      transparent: "bg-transparent border-none",
      blurred: "bg-white/70 backdrop-blur-md border-b border-white/30",
    },
    size: {
      sm: "h-12",
      md: "h-14",
      lg: "h-16",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

const backButtonVariants = cva(
  "flex items-center justify-center rounded-xl text-gray-700 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
  {
    variants: {
      size: {
        sm: "w-8 h-8 -ml-1",
        md: "w-9 h-9 -ml-1",
        lg: "w-10 h-10 -ml-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const titleVariants = cva("font-semibold tracking-tight text-gray-900 truncate", {
  variants: {
    size: {
      sm: "text-sm max-w-[160px]",
      md: "text-[15px] max-w-[180px]",
      lg: "text-base max-w-[200px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeaderNavigationProps
  extends VariantProps<typeof headerVariants> {
  /**
   * Called when the back arrow is pressed.
   * If omitted, the back arrow is not rendered at all.
   */
  onBack?: () => void;
  /** Optional title rendered in the center */
  title?: string;
  /** Optional logo node rendered in the center — takes priority over title */
  logo?: React.ReactNode;
  /** Extra classes for the root <header> — merged safely via tailwind-merge */
  className?: string;
  /** Extra classes for the back button */
  backButtonClassName?: string;
  /** Extra classes for the title */
  titleClassName?: string;
  /** Accessible label for the back button. Defaults to "Go back" */
  backLabel?: string;
}

// ─── Back Arrow Icon ──────────────────────────────────────────────────────────

const BackArrowIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * HeaderNavigation
 *
 * Mobile-first top navigation bar.
 *
 * Layout logic:
 * - onBack present → 3-column: [back button] [center] [balance]
 * - onBack absent  → 1-column: [center fills full width]
 *
 * @example Back arrow + title
 * <HeaderNavigation onBack={() => router.back()} title="Settings" />
 *
 * @example No back arrow, logo only
 * <HeaderNavigation logo={<MyLogo />} />
 *
 * @example No back arrow, title only
 * <HeaderNavigation title="Welcome" />
 *
 * @example Custom styling overrides (twMerge resolves conflicts)
 * <HeaderNavigation
 *   onBack={() => router.back()}
 *   title="Profile"
 *   variant="blurred"
 *   size="lg"
 *   className="shadow-sm"
 *   backButtonClassName="text-white hover:bg-white/20"
 *   titleClassName="text-white"
 * />
 */
const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  onBack,
  title,
  logo,
  variant,
  size,
  className,
  backButtonClassName,
  titleClassName,
  backLabel = "Go back",
}) => {
  const hasBackButton = typeof onBack === "function";

  return (
    <header className={cn(headerVariants({ variant, size }), className)}>

      {/* ── Left: Back button — only rendered when onBack is provided ── */}
      {hasBackButton ? (
        <div className="flex flex-1 items-center justify-start">
          <button
            type="button"
            onClick={onBack}
            aria-label={backLabel}
            className={cn(
              backButtonVariants({ size }),
              "hover:bg-gray-100 hover:text-gray-900 active:scale-95 active:bg-gray-200",
              backButtonClassName
            )}
          >
            <BackArrowIcon />
          </button>
        </div>
      ) : null}

      {/* ── Center: Logo or Title ──────────────────────────────────────────────
          - hasBackButton → shrink-0, flanked by flex-1 slots → truly centered
          - no back button → w-full, single child → naturally centered          */}
      <div
        className={cn(
          "flex items-center justify-center",
          hasBackButton ? "shrink-0" : "w-full"
        )}
      >
        {logo ? (
          logo
        ) : title ? (
          <h1 className={cn(titleVariants({ size }), titleClassName)}>
            {title}
          </h1>
        ) : null}
      </div>

      {/* ── Right: Balance slot — only present when back button is rendered ── */}
      {hasBackButton ? (
        <div className="flex flex-1 items-center justify-end" />
      ) : null}

    </header>
  );
};

HeaderNavigation.displayName = "HeaderNavigation";

export default HeaderNavigation;
export { headerVariants, backButtonVariants, titleVariants };

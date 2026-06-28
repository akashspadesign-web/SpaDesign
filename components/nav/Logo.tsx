import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Site logo — sits on a transparent or off-white header, so the transparent
 * PNG variant works on both. Swap to /spa-logo.png if the header ever moves
 * to a dark/coloured background.
 */
export default function Logo({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="SPA Design Consultants, home"
      className={cn("group inline-flex items-baseline gap-2.5", className)}
    >
      <Image
        src="/spa-logo-transparent.png"
        alt="SPA. Architects, Engineers, Landscape & Interior Designers"
        width={705}
        height={381}
        priority
        className="h-16 w-auto sm:h-20"
      />
    </Link>
  );
}

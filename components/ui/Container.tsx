import { cn } from "@/lib/cn";
import type { ElementType, ReactNode } from "react";

type ContainerProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

export default function Container({
  as: Tag = "div",
  children,
  className,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-content px-gutter",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

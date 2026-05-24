import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ActionButtonVariant = "default" | "primary" | "ghost" | "danger";
type ActionButtonSize = "sm" | "md";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionButtonVariant;
  size?: ActionButtonSize;
}

export function ActionButton({
  variant = "default",
  size = "md",
  className,
  type = "button",
  ...props
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "btn",
        variant === "primary" && "btn-primary",
        variant === "ghost" && "btn-ghost",
        variant === "danger" && "btn-danger",
        size === "sm" && "btn-sm",
        className
      )}
      {...props}
    />
  );
}

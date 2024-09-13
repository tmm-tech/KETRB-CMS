import * as React from "react";
import { cn } from "../lib/utils";

// Define a mapping of variants to classes
const badgeVariants = {
  default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "text-foreground",
  danger: "bg-red-500 text-white",
  warning: "bg-yellow-500 text-white",
  success: "bg-green-500 text-white",
  admin: "bg-blue-700 text-white",
  editor: "bg-orange-600 text-white",
};

function Badge({ className, variant = "default", ...props }) {
  // Get the appropriate class for the variant
  const variantClass = badgeVariants[variant] || badgeVariants.default;

  // Combine the classes
  const combinedClassName = cn(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    variantClass,
    className
  );

  return <div className={combinedClassName} {...props} />;
}

export { Badge, badgeVariants };
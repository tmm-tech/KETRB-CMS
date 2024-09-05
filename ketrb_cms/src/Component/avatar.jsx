import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "../lib/utils";

// Function to generate a lighter color
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string?.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    const lightValue = Math.floor((value + 255) / 2); // Shift towards a lighter shade
    color += ("00" + lightValue.toString(16)).substr(-2);
  }
  return color;
}

// Function to darken the color for text
function darkenColor(color, percent) {
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;

  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}

const Avatar = React.forwardRef(({ className, initials = "N/A", ...props }, ref) => {
  const bgColor = stringToColor(initials);
  const textColor = darkenColor(bgColor, 30); // Darken the color for text

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      style={{ backgroundColor: bgColor, color: textColor, fontWeight: "bold" }} // Apply bold text
      {...props}
    />
  );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef(({ className, initials = "N/A", ...props }, ref) => {
  const bgColor = stringToColor(initials);
  const textColor = darkenColor(bgColor, 30); // Darken the color for text

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      style={{ backgroundColor: bgColor, color: textColor, fontWeight: "bold" }} // Apply bold text
      {...props}
    >
      {initials}
    </AvatarPrimitive.Fallback>
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };

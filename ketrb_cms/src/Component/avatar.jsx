import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "../lib/utils";

// Modify the function to generate a lighter color
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string?.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    // Shift the color towards white by averaging with 255
    const lightValue = Math.floor((value + 255) / 2);
    color += ("00" + lightValue.toString(16)).substr(-2);
  }
  return color;
}

// Darken the text color to ensure readability
function getContrastYIQ(color) {
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 160 ? "black" : "white"; // Adjust threshold for lighter backgrounds
}

const Avatar = React.forwardRef(({ className, initials = "N/A", ...props }, ref) => {
  const bgColor = stringToColor(initials);
  const textColor = getContrastYIQ(bgColor);

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
  const textColor = getContrastYIQ(bgColor);

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

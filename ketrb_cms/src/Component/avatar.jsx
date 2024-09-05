import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "../lib/utils";

function stringToLighterColor(string) {
  let hash = 0;
  for (let i = 0; i < string?.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = ((hash >> (i * 8)) & 0xff) + 150; // Adjusted to make colors lighter
    color += ("00" + (value > 255 ? 255 : value).toString(16)).substr(-2);
  }
  return color;
}

function getContrastYIQ(color) {
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 200 ? "#2c3e50" : "#ecf0f1"; // Darker text for lighter backgrounds
}

const Avatar = React.forwardRef(({ className, initials = "N/A", ...props }, ref) => {
  const bgColor = stringToLighterColor(initials);
  const textColor = getContrastYIQ(bgColor);

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      style={{ backgroundColor: bgColor, color: textColor }}
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

const AvatarFallback = React.forwardRef(({ className, initials = "N/A", ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    style={{ backgroundColor: stringToLighterColor(initials), color: getContrastYIQ(stringToLighterColor(initials)) }}
    {...props}
  >
    {initials}
  </AvatarPrimitive.Fallback>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };

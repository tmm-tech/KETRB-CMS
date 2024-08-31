import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariants> {}

const labelVariants = cva("your-base-styles", {
  variants: {
    // Define your variants here
  },
});

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={labelVariants({ className })} {...props} />
  )
);

Label.displayName = "Label";

export {Label}

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const commandButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        tactical: "bg-accent text-accent-foreground hover:bg-accent/80 border border-grid-primary",
        sos: "bg-alert-critical text-white hover:bg-alert-critical/90 shadow-lg shadow-alert-critical/20 animate-pulse",
        command: "bg-grid-secondary text-foreground hover:bg-grid-primary border border-grid-primary",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        sos: "h-16 px-8 py-4 text-lg font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CommandButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof commandButtonVariants> {
  asChild?: boolean;
}

const CommandButton = React.forwardRef<HTMLButtonElement, CommandButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(commandButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
CommandButton.displayName = "CommandButton";

export { CommandButton, commandButtonVariants };
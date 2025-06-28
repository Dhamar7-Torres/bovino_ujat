import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Definir variantes del botón usando cva (class-variance-authority)
const buttonVariants = cva(
  // Clases base que siempre se aplican
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Variantes específicas para el sistema ganadero
        ranch: "bg-ranch-500 text-white hover:bg-ranch-600 dark:bg-ranch-600 dark:hover:bg-ranch-700",
        bovine: "bg-bovine-500 text-white hover:bg-bovine-600 dark:bg-bovine-600 dark:hover:bg-bovine-700",
        health: "bg-health-500 text-white hover:bg-health-600 dark:bg-health-600 dark:hover:bg-health-700",
        warning: "bg-warning-500 text-white hover:bg-warning-600 dark:bg-warning-600 dark:hover:bg-warning-700",
        danger: "bg-danger-500 text-white hover:bg-danger-600 dark:bg-danger-600 dark:hover:bg-danger-700",
        gradient: "bg-gradient-to-r from-ranch-500 to-bovine-500 text-white hover:from-ranch-600 hover:to-bovine-600 shadow-lg"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  asChild = false, 
  loading = false,
  leftIcon,
  rightIcon,
  children,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : "button";
  
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={loading || props.disabled}
      {...props}
    >
      {/* Icono izquierdo */}
      {leftIcon && !loading && (
        <span className="mr-2 flex-shrink-0">
          {leftIcon}
        </span>
      )}
      
      {/* Spinner de carga */}
      {loading && (
        <span className="mr-2 flex-shrink-0">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      
      {/* Contenido del botón */}
      <span className={cn(
        "flex-1 truncate",
        (leftIcon || loading || rightIcon) && "text-center"
      )}>
        {children}
      </span>
      
      {/* Icono derecho */}
      {rightIcon && !loading && (
        <span className="ml-2 flex-shrink-0">
          {rightIcon}
        </span>
      )}
    </Comp>
  );
});

Button.displayName = "Button";

// Hook personalizado para estados de botón
export const useButtonState = (initialLoading = false) => {
  const [loading, setLoading] = React.useState(initialLoading);
  const [disabled, setDisabled] = React.useState(false);

  const startLoading = React.useCallback(() => {
    setLoading(true);
    setDisabled(true);
  }, []);

  const stopLoading = React.useCallback(() => {
    setLoading(false);
    setDisabled(false);
  }, []);

  const executeAsync = React.useCallback(async (asyncFunction) => {
    try {
      startLoading();
      const result = await asyncFunction();
      return result;
    } catch (error) {
      throw error;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    loading,
    disabled,
    startLoading,
    stopLoading,
    executeAsync
  };
};

// Componente ButtonGroup para agrupar botones
export const ButtonGroup = React.forwardRef(({ 
  className, 
  orientation = "horizontal",
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex",
        orientation === "horizontal" 
          ? "rounded-md shadow-sm" 
          : "flex-col rounded-md shadow-sm",
        className
      )}
      role="group"
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;
        
        return React.cloneElement(child, {
          className: cn(
            child.props.className,
            orientation === "horizontal" ? [
              !isFirst && "ml-[-1px]",
              isFirst && "rounded-r-none",
              isLast && "rounded-l-none",
              !isFirst && !isLast && "rounded-none"
            ] : [
              !isFirst && "mt-[-1px]",
              isFirst && "rounded-b-none",
              isLast && "rounded-t-none", 
              !isFirst && !isLast && "rounded-none"
            ]
          )
        });
      })}
    </div>
  );
});

ButtonGroup.displayName = "ButtonGroup";

// Componente ToggleButton para estados on/off
export const ToggleButton = React.forwardRef(({
  pressed,
  onPressedChange,
  className,
  children,
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      variant={pressed ? "default" : "outline"}
      className={cn(
        "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
        className
      )}
      data-state={pressed ? "on" : "off"}
      onClick={() => onPressedChange?.(!pressed)}
      {...props}
    >
      {children}
    </Button>
  );
});

ToggleButton.displayName = "ToggleButton";

// Componente IconButton para botones solo con icono
export const IconButton = React.forwardRef(({
  icon,
  className,
  size = "icon",
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      size={size}
      className={cn("p-0", className)}
      {...props}
    >
      {icon}
    </Button>
  );
});

IconButton.displayName = "IconButton";

// Componente FloatingActionButton
export const FloatingActionButton = React.forwardRef(({
  className,
  size = "lg",
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      size={size}
      className={cn(
        "fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50",
        "hover:scale-105 active:scale-95",
        className
      )}
      {...props}
    />
  );
});

FloatingActionButton.displayName = "FloatingActionButton";

export { Button, buttonVariants };
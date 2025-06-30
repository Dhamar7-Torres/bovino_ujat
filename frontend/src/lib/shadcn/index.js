/**
 * shadcn/ui - Librería de componentes de interfaz moderna
 * Sistema de gestión de bovinos - Componentes UI elegantes y accesibles
 */

import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../utils';

// ============== UTILIDADES BASE ==============

/**
 * Función utilitaria para combinar clases CSS de manera condicional
 * Extiende clsx con soporte para Tailwind CSS
 */
export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Configuración de variantes usando class-variance-authority
 * Permite crear componentes con múltiples variantes de estilo
 */
const createVariants = cva;

// ============== COMPONENTE BUTTON ==============

/**
 * Variantes del componente Button
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700",
        info: "bg-blue-600 text-white hover:bg-blue-700"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

/**
 * Componente Button con múltiples variantes
 */
export const Button = forwardRef(({
  className,
  variant,
  size,
  asChild = false,
  children,
  loading = false,
  loadingText = "Cargando...",
  icon,
  iconPosition = "left",
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  
  // Mostrar loader si está cargando
  if (loading) {
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        disabled
        ref={ref}
        {...props}
      >
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          <span>{loadingText}</span>
        </div>
      </Comp>
    );
  }
  
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="ml-2">{icon}</span>
      )}
    </Comp>
  );
});

Button.displayName = "Button";

// ============== COMPONENTE CARD ==============

/**
 * Componente Card base
 */
export const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

/**
 * Header del Card
 */
export const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * Título del Card
 */
export const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * Descripción del Card
 */
export const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * Contenido del Card
 */
export const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

/**
 * Footer del Card
 */
export const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// ============== COMPONENTE INPUT ==============

/**
 * Componente Input con variantes
 */
const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        error: "border-red-500 focus-visible:ring-red-500",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500"
      },
      size: {
        default: "h-10",
        sm: "h-8 text-xs",
        lg: "h-12 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export const Input = forwardRef(({
  className,
  type,
  variant,
  size,
  error,
  icon,
  iconPosition = "left",
  ...props
}, ref) => {
  const hasIcon = !!icon;
  const hasError = !!error;
  
  const inputElement = (
    <input
      type={type}
      className={cn(
        inputVariants({ 
          variant: hasError ? "error" : variant, 
          size, 
          className: hasIcon ? (iconPosition === "left" ? "pl-10" : "pr-10") : ""
        }),
        className
      )}
      ref={ref}
      {...props}
    />
  );
  
  if (hasIcon) {
    return (
      <div className="relative">
        {iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        {inputElement}
        {iconPosition === "right" && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        {hasError && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
  
  return (
    <div>
      {inputElement}
      {hasError && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

// ============== COMPONENTE LABEL ==============

/**
 * Componente Label para formularios
 */
export const Label = forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

// ============== COMPONENTE BADGE ==============

/**
 * Variantes del componente Badge
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        info: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

/**
 * Componente Badge
 */
export const Badge = forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

// ============== COMPONENTE ALERT ==============

/**
 * Variantes del componente Alert
 */
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-green-500/50 text-green-700 bg-green-50 [&>svg]:text-green-600",
        warning: "border-yellow-500/50 text-yellow-700 bg-yellow-50 [&>svg]:text-yellow-600",
        info: "border-blue-500/50 text-blue-700 bg-blue-50 [&>svg]:text-blue-600"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

/**
 * Componente Alert
 */
export const Alert = forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

/**
 * Título del Alert
 */
export const AlertTitle = forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

/**
 * Descripción del Alert
 */
export const AlertDescription = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

// ============== COMPONENTE AVATAR ==============

/**
 * Componente Avatar base
 */
export const Avatar = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

/**
 * Imagen del Avatar
 */
export const AvatarImage = forwardRef(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

/**
 * Fallback del Avatar
 */
export const AvatarFallback = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

// ============== COMPONENTES ESPECÍFICOS DEL SISTEMA GANADERO ==============

/**
 * Card especializada para bovinos
 */
export const BovineCard = forwardRef(({ 
  bovineData, 
  imageUrl, 
  onEdit, 
  onDelete, 
  onViewDetails,
  className,
  ...props 
}, ref) => {
  const { id, name, breed, age, weight, status, healthStatus } = bovineData || {};
  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'activo': return 'success';
      case 'enfermo': return 'destructive';
      case 'cuarentena': return 'warning';
      default: return 'default';
    }
  };
  
  return (
    <Card ref={ref} className={cn("hover:shadow-lg transition-shadow", className)} {...props}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback>{name?.charAt(0) || 'B'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{name || 'Sin nombre'}</CardTitle>
              <p className="text-sm text-muted-foreground">ID: {id}</p>
            </div>
          </div>
          <Badge variant={getStatusColor(status)}>
            {status || 'Sin estado'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Label className="text-muted-foreground">Raza</Label>
            <p className="font-medium">{breed || 'No especificada'}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Edad</Label>
            <p className="font-medium">{age ? `${age} meses` : 'No registrada'}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Peso</Label>
            <p className="font-medium">{weight ? `${weight} kg` : 'No registrado'}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Salud</Label>
            <Badge variant={getStatusColor(healthStatus)} className="text-xs">
              {healthStatus || 'Sin revisar'}
            </Badge>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3">
        <div className="flex space-x-2 w-full">
          <Button variant="outline" size="sm" onClick={onViewDetails} className="flex-1">
            Ver Detalles
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            Eliminar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
});
BovineCard.displayName = "BovineCard";

/**
 * Alert especializada para notificaciones del sistema ganadero
 */
export const CattleAlert = forwardRef(({ 
  type = 'info',
  title,
  message,
  bovineId,
  timestamp,
  onDismiss,
  className,
  ...props 
}, ref) => {
  const alertVariant = {
    health: 'destructive',
    vaccination: 'warning',
    production: 'info',
    breeding: 'success'
  }[type] || 'info';
  
  return (
    <Alert ref={ref} variant={alertVariant} className={cn("mb-4", className)} {...props}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="mt-1">
            {message}
            {bovineId && (
              <span className="block text-xs mt-1 opacity-75">
                Bovino ID: {bovineId}
              </span>
            )}
            {timestamp && (
              <span className="block text-xs mt-1 opacity-75">
                {new Date(timestamp).toLocaleString()}
              </span>
            )}
          </AlertDescription>
        </div>
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss} className="h-6 w-6 p-0">
            ×
          </Button>
        )}
      </div>
    </Alert>
  );
});
CattleAlert.displayName = "CattleAlert";

/**
 * Métrica del dashboard para el sistema ganadero
 */
export const MetricCard = forwardRef(({ 
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  description,
  className,
  ...props 
}, ref) => {
  const getChangeColor = (type) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <Card ref={ref} className={cn("p-6", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {change && (
            <p className={cn("text-sm", getChangeColor(changeType))}>
              {change}
            </p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
});
MetricCard.displayName = "MetricCard";

// ============== EXPORTACIONES ==============

// Exportar componentes individuales
export {
  buttonVariants,
  inputVariants,
  badgeVariants,
  alertVariants,
  createVariants,
  classNames
};

// Exportación por defecto con todos los componentes
export default {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  Avatar,
  AvatarImage,
  AvatarFallback,
  BovineCard,
  CattleAlert,
  MetricCard,
  buttonVariants,
  inputVariants,
  badgeVariants,
  alertVariants,
  createVariants,
  classNames
};
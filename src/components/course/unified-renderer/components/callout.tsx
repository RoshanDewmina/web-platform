"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { 
  InfoIcon, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lightbulb 
} from "lucide-react";

const variants = {
  info: {
    className: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50",
    icon: InfoIcon,
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  success: {
    className: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50",
    icon: CheckCircle2,
    iconClass: "text-green-600 dark:text-green-400",
  },
  warning: {
    className: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50",
    icon: AlertTriangle,
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  danger: {
    className: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50",
    icon: XCircle,
    iconClass: "text-red-600 dark:text-red-400",
  },
  tip: {
    className: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/50",
    icon: Lightbulb,
    iconClass: "text-purple-600 dark:text-purple-400",
  },
} as const;

type Variant = keyof typeof variants;

interface CalloutProps {
  variant?: Variant;
  title?: string;
  icon?: string;
  children: ReactNode;
  className?: string;
}

export default function Callout({ 
  variant = "info", 
  title, 
  icon,
  children, 
  className 
}: CalloutProps) {
  const variantConfig = variants[variant];
  const Icon = icon ? null : variantConfig.icon;

  return (
    <Card className={cn(
      "relative rounded-lg border-2 p-4 my-6",
      variantConfig.className,
      className
    )}>
      <div className="flex gap-3">
        {Icon && (
          <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", variantConfig.iconClass)} />
        )}
        {icon && (
          <span className={cn("text-xl mt-0.5 flex-shrink-0", variantConfig.iconClass)}>
            {icon}
          </span>
        )}
        <div className="flex-1 space-y-2">
          {title && (
            <h4 className={cn(
              "font-semibold text-base",
              variantConfig.iconClass.replace("text-", "text-").replace("-600", "-900").replace("-400", "-200")
            )}>
              {title}
            </h4>
          )}
          <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
            {typeof children === "string" ? <p>{children}</p> : children}
          </div>
        </div>
      </div>
    </Card>
  );
}

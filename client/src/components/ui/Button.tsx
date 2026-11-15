import React from 'react';
import { Button as AnimateButton } from '@animate-ui/react/primitives/buttons/button';
import type { HTMLMotionProps } from 'motion/react';
import { useReducedMotion } from 'motion/react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  tapScale?: number;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#005c55] hover:bg-[#0d655e] text-white shadow-xs border border-transparent',
  secondary:
    'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80',
  outline:
    'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs',
  ghost:
    'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent',
  danger:
    'bg-rose-600 hover:bg-rose-700 text-white shadow-xs border border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-10 px-4 text-xs sm:text-sm rounded-xl gap-2',
  lg: 'h-11 px-6 text-sm font-semibold rounded-xl gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  hoverScale,
  tapScale,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, disable scaling effects
  const activeHoverScale = shouldReduceMotion ? 1 : hoverScale ?? 1.01;
  const activeTapScale = shouldReduceMotion ? 1 : tapScale ?? 0.98;

  return (
    <AnimateButton
      hoverScale={activeHoverScale}
      tapScale={activeTapScale}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-colors cursor-pointer select-none disabled:opacity-60 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </AnimateButton>
  );
};

export default Button;

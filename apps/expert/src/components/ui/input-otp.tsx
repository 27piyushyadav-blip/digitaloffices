"use client";

import * as React from "react";
import {
  OTPInput,
  OTPInputContext,
  type OTPInputProps,
} from "input-otp";
import { MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------
   TYPES
--------------------------------------------------- */

// ❗ Remove maxLength, render, children from base props
type BaseOTPProps = Omit<
  OTPInputProps,
  "render" | "children" | "maxLength"
>;

interface InputOTPProps extends BaseOTPProps {
  maxLength: number; // ✅ REQUIRED
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

interface InputOTPGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

interface InputOTPSlotProps
  extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
}

interface InputOTPSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/* ---------------------------------------------------
   COMPONENTS
--------------------------------------------------- */

export function InputOTP({
  maxLength,
  className,
  containerClassName,
  children,
  ...props
}: InputOTPProps) {
  return (
    <OTPInput
      {...props}
      maxLength={maxLength}
      data-slot="input-otp"
      className={cn("disabled:cursor-not-allowed", className)}
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
    >
      {children}
    </OTPInput>
  );
}

export function InputOTPGroup({
  className,
  ...props
}: InputOTPGroupProps) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

export function InputOTPSlot({
  index,
  className,
  ...props
}: InputOTPSlotProps) {
  const context = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } =
    context?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border border-input text-sm shadow-xs transition-all",
        "first:rounded-l-md last:rounded-r-md",
        "data-[active=true]:z-10 data-[active=true]:ring-2 data-[active=true]:ring-ring",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground" />
        </div>
      )}
    </div>
  );
}

export function InputOTPSeparator(props: InputOTPSeparatorProps) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
}

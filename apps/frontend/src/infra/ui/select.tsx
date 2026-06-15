"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={[
        "inline-flex min-h-11 w-full items-center justify-between gap-2.5 rounded-md border border-input bg-card px-3 text-left text-foreground outline-none data-[placeholder]:text-muted-foreground focus-visible:border-ring focus-visible:shadow-[0_0_0_3px_rgba(24,118,105,0.16)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="text-base leading-none text-muted-foreground">
        ⌄
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={[
          "z-50 max-h-[280px] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-border bg-card shadow-[0_18px_44px_rgba(20,30,43,0.14)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        position="popper"
        sideOffset={6}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1.5">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  children,
  meta,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
  meta?: ReactNode;
}) {
  return (
    <SelectPrimitive.Item
      className={[
        "grid cursor-default gap-[3px] rounded-[5px] px-2.5 py-[9px] text-sm leading-tight text-foreground outline-none data-[highlighted]:bg-accent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <SelectPrimitive.ItemText>
        {children}
        {meta ? (
          <span className="text-xs text-muted-foreground">{meta}</span>
        ) : null}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

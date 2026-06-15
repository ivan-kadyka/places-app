"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import styles from "./ui.module.css";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={[styles.selectTrigger, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className={styles.selectIcon}>⌄</SelectPrimitive.Icon>
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
        className={[styles.selectContent, className].filter(Boolean).join(" ")}
        position="popper"
        sideOffset={6}
        {...props}
      >
        <SelectPrimitive.Viewport className={styles.selectViewport}>
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
      className={[styles.selectItem, className].filter(Boolean).join(" ")}
      {...props}
    >
      <SelectPrimitive.ItemText>
        {children}
        {meta ? <span className={styles.selectItemMeta}>{meta}</span> : null}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

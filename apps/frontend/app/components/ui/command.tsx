"use client";

import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import styles from "./ui.module.css";

export function Command({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[styles.command, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function CommandInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[styles.commandInput, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function CommandList({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[styles.commandList, className].filter(Boolean).join(" ")}
      role="listbox"
      {...props}
    />
  );
}

export function CommandEmpty({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[styles.commandEmpty, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function CommandGroup({
  children,
  className,
  heading,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  heading?: ReactNode;
}) {
  return (
    <div
      className={[styles.commandGroup, className].filter(Boolean).join(" ")}
      {...props}
    >
      {heading ? (
        <div className={styles.commandGroupHeading}>{heading}</div>
      ) : null}
      {children}
    </div>
  );
}

export function CommandItem({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={[styles.commandItem, className].filter(Boolean).join(" ")}
      role="option"
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

export function CommandSeparator({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[styles.commandSeparator, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function CommandShortcut({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={[styles.commandShortcut, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

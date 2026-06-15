"use client";

import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

export function Command({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "w-full overflow-hidden rounded-lg border border-input bg-card text-foreground transition-[border-color,box-shadow] focus-within:border-ring focus-within:shadow-[0_0_0_3px_rgba(24,118,105,0.16)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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
      className={[
        "h-[46px] w-full border-0 border-b border-border bg-transparent px-3.5 text-foreground outline-none placeholder:text-muted-foreground",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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
      className={["h-60 overflow-y-auto p-1.5", className]
        .filter(Boolean)
        .join(" ")}
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
      className={[
        "p-3 text-sm leading-relaxed text-muted-foreground",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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
      className={["grid gap-1", className].filter(Boolean).join(" ")}
      {...props}
    >
      {heading ? (
        <div className="px-2 pb-1 pt-[7px] text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
          {heading}
        </div>
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
      className={[
        "grid w-full cursor-pointer gap-[3px] rounded-[5px] border-0 bg-transparent px-2.5 py-[9px] text-left text-sm leading-tight text-foreground outline-none hover:bg-accent focus-visible:bg-accent disabled:cursor-not-allowed disabled:opacity-55 aria-selected:bg-accent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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
      className={["-mx-1.5 my-1.5 h-px bg-border", className]
        .filter(Boolean)
        .join(" ")}
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
      className={["ml-auto text-xs text-muted-foreground", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

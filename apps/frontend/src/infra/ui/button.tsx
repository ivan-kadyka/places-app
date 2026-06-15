import { type ButtonHTMLAttributes } from "react";

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={[
        "inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-3.5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-55",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

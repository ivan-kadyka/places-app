import { type HTMLAttributes } from "react";
import styles from "./ui.module.css";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={[styles.card, className].filter(Boolean).join(" ")} {...props} />;
}

export function CardHeader(props: HTMLAttributes<HTMLDivElement>) {
  return <div className={styles.cardHeader} {...props} />;
}

export function CardTitle(props: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={styles.cardTitle} {...props} />;
}

export function CardDescription(props: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={styles.cardDescription} {...props} />;
}

export function CardContent(props: HTMLAttributes<HTMLDivElement>) {
  return <div className={styles.cardContent} {...props} />;
}

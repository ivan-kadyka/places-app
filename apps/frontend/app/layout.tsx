import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PropsWithChildren } from "react";
import ReactQueryDevtoolPanel from "../src/infra/tanstack-query/react-query-devtool-panel";
import ReactQueryProvider from "../src/infra/tanstack-query/react-query-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Places",
  description: "Search places and view activity details.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>
          {children}
          <ReactQueryDevtoolPanel />
        </ReactQueryProvider>
      </body>
    </html>
  );
}

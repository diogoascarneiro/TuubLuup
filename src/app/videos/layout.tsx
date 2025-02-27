import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TuubLuup - Watch Multiple Videos",
  description: "Watch multiple YouTube videos simultaneously with TuubLuup.",
};

export default function VideosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

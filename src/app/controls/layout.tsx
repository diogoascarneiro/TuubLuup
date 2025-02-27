import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TuubLuup Controls - Manage Your Videos",
  description: "Control panel for managing multiple YouTube videos in TuubLuup.",
};

export default function ControlsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

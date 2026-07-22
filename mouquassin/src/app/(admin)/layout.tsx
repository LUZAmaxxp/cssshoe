import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lyzane Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf9f7]">{children}</div>
  );
}
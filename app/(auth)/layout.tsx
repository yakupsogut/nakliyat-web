import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş - Admin Panel",
  description: "Nakliyat Admin Panel Girişi",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
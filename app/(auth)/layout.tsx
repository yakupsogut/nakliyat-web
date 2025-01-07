import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş - Admin Panel",
  description: "Nakliyat Admin Panel Girişi",
  icons: {
    icon: {
      url: '/iconAdmin.svg',
      type: 'image/svg+xml',
    },
  },
};




export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
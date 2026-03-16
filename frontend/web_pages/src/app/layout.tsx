import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";
import { NoInternetModal } from "@/components/modals/NoInternetModal";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard VertEV",
  description: "Admin Dashboard for VertEV",
  icons: {
    icon: [
      {
        url: "https://res.cloudinary.com/dzgr4iqt7/image/upload/v1767430475/favicon_llerlg.png",
        type: "image/png",
        sizes: "any",
      },
    ],
    shortcut: [
      {
        url: "https://res.cloudinary.com/dzgr4iqt7/image/upload/v1767430475/favicon_llerlg.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://res.cloudinary.com/dzgr4iqt7/image/upload/v1767430475/favicon_llerlg.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="https://res.cloudinary.com/dzgr4iqt7/image/upload/v1767168061/vehicles/ozrafryxvopibdxdjrur.png" />
        <link rel="shortcut icon" type="image/png" href="https://res.cloudinary.com/dzgr4iqt7/image/upload/v1767168061/vehicles/ozrafryxvopibdxdjrur.png" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/dzgr4iqt7/image/upload/v1767168061/vehicles/ozrafryxvopibdxdjrur.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased font-poppins`}
        cz-shortcut-listen="true"
      >
        <StoreProvider>{children}</StoreProvider>
        <NoInternetModal />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              minWidth: "50px", 
              maxWidth: "500px",
              textAlign: "center",
              fontSize: "16px",
            },
          }}
        />
      </body>
    </html>
  );
}

import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="container py-8">{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

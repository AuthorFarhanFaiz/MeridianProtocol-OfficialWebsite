import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

export default function RootLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col bg-base text-ink">
      {/* Optional subtle background glow */}
      <div className="pointer-events-none fixed inset-0 hero-glow opacity-60" />

      <Header />

      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      <Footer />

      <CookieConsent />
    </div>
  );
}

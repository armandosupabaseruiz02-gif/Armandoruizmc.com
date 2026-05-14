import Navbar from "./Navbar";
import Footer from "./Footer";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <Navbar />
      <main id="contenido-principal" tabIndex={-1} className="pt-[72px]">
        {children}
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}

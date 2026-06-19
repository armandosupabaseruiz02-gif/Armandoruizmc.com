import Footer from "./Footer";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <main id="contenido-principal" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}

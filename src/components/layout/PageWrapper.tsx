import Footer from "./Footer";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="contenido-principal" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}

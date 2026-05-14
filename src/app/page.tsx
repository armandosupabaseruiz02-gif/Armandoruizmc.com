import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Servicios from "@/components/sections/Servicios";
import QuienesSomos from "@/components/sections/QuienesSomos";
import QueHacemos from "@/components/sections/QueHacemos";
import QuienEsArmando from "@/components/sections/QuienEsArmando";
import InstagramReels from "@/components/sections/Instagram";
import Donar from "@/components/sections/Donar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="contenido-principal" tabIndex={-1}>
        <Hero />
        <Servicios />
        <QuienesSomos />
        <QueHacemos />
        <QuienEsArmando />
        <InstagramReels />
        <Donar />
      </main>
      <Footer />
    </>
  );
}

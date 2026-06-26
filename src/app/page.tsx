import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AyudaHoy from "@/components/sections/AyudaHoy";
import QuienesSomos from "@/components/sections/QuienesSomos";
import QueHacemos from "@/components/sections/QueHacemos";
import CuentaCTA from "@/components/sections/CuentaCTA";
import QuienEsArmando from "@/components/sections/QuienEsArmando";
import SabiasQue from "@/components/sections/SabiasQue";
import InstagramReels from "@/components/sections/Instagram";
import Donar from "@/components/sections/Donar";

export default function HomePage() {
  return (
    <>
      <main id="contenido-principal" tabIndex={-1}>
        <Hero />
        {/* Lanzador de tareas: atajo prioritario; el scroll informativo sigue debajo */}
        <AyudaHoy />
        <QuienesSomos />
        <QueHacemos />
        <CuentaCTA />
        <QuienEsArmando />
        <SabiasQue />
        <InstagramReels />
        <Donar />
      </main>
      <Footer />
    </>
  );
}

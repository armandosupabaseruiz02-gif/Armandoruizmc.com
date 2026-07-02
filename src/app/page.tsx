import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AyudaHoy from "@/components/sections/AyudaHoy";
import ComoTeAyudamos from "@/components/sections/ComoTeAyudamos";
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
        {/* Orden espejo del menu: Como funciona -> Tramites -> Armando -> Cuenta -> Ayudar */}
        <ComoTeAyudamos />
        <AyudaHoy />
        <QuienEsArmando />
        {/* Instagram acompaña a la seccion de Armando (son sus videos) */}
        <InstagramReels />
        <CuentaCTA />
        <Donar />
        {/* Datos / "¿Sabías que?" cierra la página: contexto, no acceso a tramite */}
        <SabiasQue />
      </main>
      <Footer />
    </>
  );
}

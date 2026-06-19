import type { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import { ArrowLeft, ShieldCheck, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description:
    "Aviso de Privacidad Integral conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
};

/* ─────────────────────────────────────────────────────────────
   AVISO DE PRIVACIDAD — BORRADOR conforme a la LFPDPPP.
   ⚠️ Los campos entre [CORCHETES] son PLACEHOLDERS que el equipo
   legal del Diputado debe completar y revisar antes de publicar.
   Recaban datos SENSIBLES (salud/discapacidad) → requiere
   consentimiento expreso del titular.
───────────────────────────────────────────────────────────── */

const ultimaActualizacion = "[FECHA DE ÚLTIMA ACTUALIZACIÓN]";

export default function AvisoPrivacidadPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative bg-gray-900 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-naranja-400
                       text-[14px] font-medium transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Regresar al inicio
          </Link>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-naranja-500 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <span className="section-badge-dark">Privacidad</span>
          </div>

          <h1 className="text-[36px] sm:text-[48px] font-black text-white leading-tight">
            Aviso de Privacidad
          </h1>
          <p className="text-[15px] text-gray-300 mt-3">
            Última actualización: {ultimaActualizacion}
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-14 bg-warm-50">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          {/* Aviso de borrador — eliminar cuando lo valide el área legal */}
          <div
            className="rounded-card border-2 border-amber-300 bg-amber-50 p-5 sm:p-6 mb-12 flex gap-4 items-start"
            role="note"
          >
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-[15px] font-black text-amber-900 mb-1">
                Borrador pendiente de revisión legal
              </p>
              <p className="text-[14px] text-amber-800 leading-relaxed">
                Este documento es una plantilla conforme a la LFPDPPP. Los datos entre
                corchetes deben completarse y todo el texto debe ser revisado y aprobado por
                el área jurídica antes de su publicación oficial.
              </p>
            </div>
          </div>

          <div className="prose-aviso space-y-10 text-[16px] text-gray-800 leading-relaxed">

            <p>
              En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en
              Posesión de los Particulares</strong> (LFPDPPP), su Reglamento y los Lineamientos
              del Aviso de Privacidad, se pone a su disposición el presente Aviso de Privacidad
              Integral.
            </p>

            <Bloque titulo="1. Identidad y domicilio del responsable">
              <p>
                <strong>[NOMBRE LEGAL DEL RESPONSABLE — p. ej. la asociación, oficina de
                gestión o persona responsable del tratamiento]</strong> (en adelante, &ldquo;el
                Responsable&rdquo;), con domicilio en <strong>[DOMICILIO COMPLETO PARA OÍR Y
                RECIBIR NOTIFICACIONES]</strong>, es responsable del tratamiento y protección de
                sus datos personales conforme al presente Aviso.
              </p>
            </Bloque>

            <Bloque titulo="2. Datos personales que recabamos">
              <p>Para cumplir con las finalidades descritas, podremos recabar:</p>
              <ul>
                <li><strong>Datos de identificación y contacto:</strong> nombre completo, CURP, teléfono, correo electrónico, domicilio.</li>
                <li><strong>Documentos de identidad:</strong> credencial para votar (INE), acta de nacimiento, comprobante de domicilio.</li>
                <li>
                  <strong>Datos personales sensibles relacionados con la salud:</strong> tipo y
                  grado de discapacidad, diagnósticos, certificados o dictámenes médicos, recetas
                  y necesidades de salud, en la medida necesaria para brindar la asesoría y gestión
                  solicitadas.
                </li>
              </ul>
            </Bloque>

            <Bloque titulo="3. Datos personales sensibles">
              <p>
                Le informamos que, para las finalidades de asesoría y gestión en materia de salud y
                discapacidad, trataremos <strong>datos personales sensibles</strong>. De
                conformidad con la LFPDPPP, su tratamiento <strong>requiere su consentimiento
                expreso</strong>, el cual se solicitará al momento de agendar una cita o entregar
                documentos.
              </p>
            </Bloque>

            <Bloque titulo="4. Finalidades del tratamiento">
              <p><strong>Finalidades primarias</strong> (necesarias para el servicio):</p>
              <ul>
                <li>Agendar, atender y dar seguimiento a sus citas de asesoría, presenciales o en línea.</li>
                <li>Orientarle y acompañarle en trámites, programas y apoyos de salud y discapacidad.</li>
                <li>Resguardar y gestionar los documentos que usted nos proporcione.</li>
                <li>Contactarle para confirmaciones, recordatorios o seguimiento de su caso.</li>
              </ul>
              <p><strong>Finalidades secundarias</strong> (no necesarias; puede oponerse):</p>
              <ul>
                <li>Elaboración de estadísticas e informes de gestión de manera disociada.</li>
                <li>Envío de información sobre programas, eventos o apoyos que pudieran beneficiarle.</li>
              </ul>
              <p>
                Si no desea que sus datos se traten para las finalidades secundarias, puede
                manifestarlo enviando un correo a <strong>[CORREO DE PRIVACIDAD]</strong>. Su
                negativa no será motivo para negarle los servicios solicitados.
              </p>
            </Bloque>

            <Bloque titulo="5. Medios para ejercer sus derechos ARCO">
              <p>
                Usted tiene derecho a <strong>Acceder</strong>, <strong>Rectificar</strong> y
                <strong> Cancelar</strong> sus datos personales, así como a <strong>Oponerse</strong> a
                su tratamiento o revocar el consentimiento otorgado (derechos ARCO). Para ello,
                envíe su solicitud a <strong>[CORREO DE PRIVACIDAD]</strong> o acuda al domicilio del
                Responsable, indicando: nombre del titular, medio de contacto, descripción clara de
                los datos y del derecho que desea ejercer, y copia de una identificación oficial.
              </p>
              <p>Daremos respuesta a su solicitud en los plazos que marca la LFPDPPP.</p>
            </Bloque>

            <Bloque titulo="6. Limitación del uso o divulgación">
              <p>
                Puede limitar el uso o divulgación de sus datos enviando una solicitud a
                <strong> [CORREO DE PRIVACIDAD]</strong>. Asimismo, podrá solicitar su inscripción en
                un listado de exclusión interno para dejar de recibir comunicaciones.
              </p>
            </Bloque>

            <Bloque titulo="7. Transferencias de datos">
              <p>
                Sus datos <strong>no serán transferidos a terceros</strong> sin su consentimiento,
                salvo las excepciones previstas en el artículo 37 de la LFPDPPP (p. ej.,
                requerimientos de autoridad competente). En caso de canalizar su caso a una
                dependencia o institución para gestionar un apoyo, se solicitará su consentimiento
                previo. <em>[Ajustar según las transferencias reales que aplique el equipo.]</em>
              </p>
            </Bloque>

            <Bloque titulo="8. Uso de cookies y tecnologías de rastreo">
              <p>
                El sitio podrá utilizar cookies y tecnologías similares para mejorar su experiencia
                de navegación. <em>[Completar con el detalle real de cookies y analítica que utilice
                el sitio, o eliminar este apartado si no aplica.]</em>
              </p>
            </Bloque>

            <Bloque titulo="9. Cambios al Aviso de Privacidad">
              <p>
                El presente Aviso podrá ser modificado en cualquier momento para atender cambios
                legislativos, internos o en nuestras prácticas de privacidad. Cualquier
                actualización se pondrá a su disposición a través de este mismo sitio web, en
                <strong> [URL DEL SITIO]/aviso-privacidad</strong>.
              </p>
            </Bloque>

            <Bloque titulo="10. Consentimiento">
              <p>
                Al proporcionar sus datos personales y utilizar nuestros servicios, usted reconoce
                haber leído y comprendido el presente Aviso de Privacidad y otorga su consentimiento
                para el tratamiento de sus datos —incluidos los datos sensibles— conforme a las
                finalidades aquí descritas.
              </p>
            </Bloque>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-[14px] text-gray-600">
                Para cualquier duda sobre este Aviso de Privacidad, contáctenos en
                <strong> [CORREO DE PRIVACIDAD]</strong> o al teléfono <strong>[TELÉFONO]</strong>.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Link href="/" className="btn-secondary inline-flex">
              <ArrowLeft className="w-5 h-5" />
              Regresar al inicio
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[22px] sm:text-[26px] font-black text-gray-900 mb-4 leading-tight">
        {titulo}
      </h2>
      <div className="space-y-3 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:marker:text-naranja-500">
        {children}
      </div>
    </section>
  );
}

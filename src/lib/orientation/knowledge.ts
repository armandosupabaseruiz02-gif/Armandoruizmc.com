export type OrientationLink = {
  label: string;
  href: string;
};

export type OrientationAnswer = {
  title: string;
  body: string[];
  links?: OrientationLink[];
};

export const QUICK_ORIENTATION_QUESTIONS = [
  "No se que tramite necesito",
  "Quiero la Tarjeta Accesible",
  "Necesito apoyo de salud",
  "Busco pension o apoyo economico",
  "Busco trabajo",
  "No tengo todos mis papeles",
];

const defaultAnswer: OrientationAnswer = {
  title: "Te oriento paso a paso",
  body: [
    "Dime con tus palabras que necesitas: salud, tarjeta de discapacidad, apoyo economico, trabajo, vivienda, escuela o saber a que dependencia ir.",
    "Si no sabes el nombre del tramite, no pasa nada. Puedes escribir algo como: \"necesito una silla de ruedas\", \"quiero apoyo por discapacidad\", \"no tengo CURP\" o \"busco trabajo\".",
    "Si tu caso ya es muy personal o requiere revisar documentos, lo correcto es agendar una cita con el equipo para que te den seguimiento humano.",
  ],
  links: [
    { label: "Ver todos los servicios", href: "/#servicios" },
    { label: "Agendar cita personal", href: "/salud/agendar" },
  ],
};

const answers = {
  tarjeta: {
    title: "Tarjeta Accesible / Tarjeta de Discapacidad CDMX",
    body: [
      "Esta tarjeta ayuda a personas con discapacidad a acceder a transporte gratuito, atencion preferente, descuentos y tramites prioritarios en la CDMX.",
      "Documentos principales: identificacion oficial vigente, CURP, comprobante de domicilio reciente, constancia medica o dictamen de discapacidad y 2 fotos infantiles con fondo blanco.",
      "Paso simple: junta documentos, ve a un modulo DIF o IFDP, entrega papeles, espera la emision y recoge la tarjeta. El tramite debe ser gratuito; no pagues a gestores.",
    ],
    links: [
      { label: "Ver guia de Tarjeta Accesible", href: "/tarjeta-accesible" },
      { label: "Agendar cita si necesitas ayuda", href: "/salud/agendar" },
    ],
  },
  salud: {
    title: "Apoyos y gestiones de salud",
    body: [
      "En la pagina se orienta sobre medicamentos gratuitos, aparatos ortopedicos, sillas de ruedas, terapias de rehabilitacion y consultas especializadas.",
      "Para medicamentos: acude con medico de cabecera, pide receta con diagnostico y recoge en el modulo o farmacia asignada. Para sillas, protesis o muletas: pide valoracion en DIF o centro correspondiente y lleva dictamen medico.",
      "Si es urgencia medica, no esperes a una cita del sitio: llama al 911 o acude a urgencias. La cita del portal sirve para orientacion y seguimiento, no para emergencias.",
    ],
    links: [
      { label: "Ver gestiones de salud", href: "/salud" },
      { label: "Agendar cita personal", href: "/salud/agendar" },
    ],
  },
  cita: {
    title: "Cuando conviene agendar cita",
    body: [
      "La cita es para casos personales: revisar tu situacion, ordenar documentos, explicar que tramite te conviene y dar seguimiento con el equipo.",
      "Para agendar necesitas crear cuenta o iniciar sesion. Despues eliges dia, horario, tema, modalidad presencial o en linea, y escribes el motivo de la cita.",
      "Horarios del portal: lunes a viernes de 9:00 a 17:00. Las citas quedan como solicitud pendiente hasta que el equipo las revise.",
    ],
    links: [
      { label: "Agendar cita", href: "/salud/agendar" },
      { label: "Entrar a Mi cuenta", href: "/mi-cuenta" },
    ],
  },
  programas: {
    title: "Programas sociales disponibles",
    body: [
      "La pagina muestra apoyos para personas con discapacidad y sus familias: pension por discapacidad, beca para estudiantes, empleo con apoyo, apoyo a cuidadores, adaptacion de vivienda y seguro de desempleo.",
      "Casi todos piden documentos base: CURP, identificacion, comprobante de domicilio y algun comprobante o dictamen de discapacidad. Cada programa puede pedir documentos extra.",
      "Si no sabes cual te toca, dime tu caso: edad, si estudias, si trabajas, si tienes discapacidad permanente, si eres cuidador o si necesitas adaptar vivienda.",
    ],
    links: [
      { label: "Ver programas sociales", href: "/programas-sociales" },
      { label: "Ver dependencias", href: "/secretarias" },
    ],
  },
  pension: {
    title: "Pension para personas con discapacidad",
    body: [
      "Es un apoyo economico para personas con discapacidad permanente. En la pagina aparece como apoyo mensual directo.",
      "Requisitos base: vivir en CDMX, tener discapacidad permanente documentada, CURP, identificacion oficial y no recibir otra pension gubernamental similar.",
      "Dependencia orientativa: Gobierno CDMX / SIBISO. Si no sabes si calificas, revisa primero tus documentos y agenda cita para que el equipo te ayude a ordenar el caso.",
    ],
    links: [
      { label: "Ver programas sociales", href: "/programas-sociales" },
      { label: "Agendar cita personal", href: "/salud/agendar" },
    ],
  },
  beca: {
    title: "Beca para estudiantes con discapacidad",
    body: [
      "Esta orientada a estudiantes con discapacidad que esten inscritos en escuela publica y necesiten apoyo para continuar o reincorporarse a sus estudios.",
      "Documentos base: CURP, comprobante de estudios, identificacion cuando aplique y certificado o documento que acredite la discapacidad.",
      "Si la persona es menor de edad, normalmente tambien conviene llevar identificacion del tutor y documentos escolares actualizados.",
    ],
    links: [
      { label: "Ver programas sociales", href: "/programas-sociales" },
      { label: "Ver directorio de dependencias", href: "/secretarias" },
    ],
  },
  trabajo: {
    title: "Trabajo e inclusion laboral",
    body: [
      "La pagina tiene bolsa de trabajo con vacantes inclusivas y tambien menciona el programa Incluyeme / empleo con apoyo.",
      "Para empezar prepara: CURP, identificacion, telefono, correo si tienes, experiencia laboral o habilidades, y documento de discapacidad si lo tienes.",
      "Si no tienes CV, puedes pedir orientacion en cita. El equipo puede ayudarte a ordenar tu informacion antes de postularte.",
    ],
    links: [
      { label: "Ver bolsa de trabajo", href: "/bolsa-trabajo" },
      { label: "Agendar cita personal", href: "/salud/agendar" },
    ],
  },
  vivienda: {
    title: "Apoyo para adaptar vivienda",
    body: [
      "Este apoyo puede servir para rampas, barandales, puertas anchas, banos accesibles u otras adaptaciones para una persona con discapacidad motriz o adulto mayor.",
      "Documentos comunes: identificacion, CURP, comprobante de domicilio, documento de propiedad o contrato de renta, y evidencia de la necesidad de adaptacion.",
      "Dependencia orientativa: INVI CDMX. Conviene revisar primero que la vivienda este en CDMX y que puedas comprobar la relacion con el domicilio.",
    ],
    links: [
      { label: "Ver programas sociales", href: "/programas-sociales" },
      { label: "Ver dependencias", href: "/secretarias" },
    ],
  },
  cuidador: {
    title: "Apoyo a cuidadores",
    body: [
      "Es para familiares o personas que cuidan de tiempo completo a alguien con discapacidad severa.",
      "Documentos comunes: identificacion del cuidador, CURP, comprobante de domicilio, documentos de la persona cuidada y dictamen o constancia de discapacidad.",
      "Si cuidas a alguien y no sabes si entras al programa, explica: edad de la persona, tipo de discapacidad, si requiere apoyo diario y si viven en CDMX.",
    ],
    links: [
      { label: "Ver programas sociales", href: "/programas-sociales" },
      { label: "Agendar cita personal", href: "/salud/agendar" },
    ],
  },
  papeles: {
    title: "Si no tienes todos tus papeles",
    body: [
      "No te cierres la puerta. Primero identifica que si tienes: CURP, INE, comprobante de domicilio, receta, dictamen medico, estudios o algun papel de escuela/trabajo.",
      "Si falta CURP, identificacion o comprobante, el primer paso es regularizar esos documentos. Para saber a que oficina ir, LOCATEL puede orientar y el equipo tambien puede ayudarte a ordenar la lista.",
      "Si vienes con una situacion vulnerable o no sabes explicar el tramite, escribe lo que te pasa con palabras simples. El objetivo del bot es ayudarte a encontrar el primer paso, no juzgarte.",
    ],
    links: [
      { label: "Ver dependencias utiles", href: "/secretarias" },
      { label: "Agendar cita personal", href: "/salud/agendar" },
    ],
  },
  pagina: {
    title: "Como usar esta pagina",
    body: [
      "En Inicio tienes accesos directos: agendar asesoria de salud, Tarjeta Accesible, programas sociales, bolsa de trabajo, donar y Mi cuenta.",
      "Si quieres aprender de un tramite, entra a su pagina. Si quieres seguimiento personal, agenda cita. Si ya pediste cita, revisala en Mi cuenta.",
      "Para crear o revisar citas necesitas iniciar sesion. Esto protege tus datos porque se manejan datos personales y temas de salud.",
    ],
    links: [
      { label: "Ir al inicio", href: "/" },
      { label: "Mi cuenta", href: "/mi-cuenta" },
    ],
  },
  dependencias: {
    title: "Dependencias y telefonos utiles",
    body: [
      "Para salud y aparatos: DIF CDMX, Secretaria de Salud CDMX, CRIT e IMSS Bienestar. Para programas sociales: SIBISO. Para trabajo: STyFE. Para vivienda: INVI.",
      "LOCATEL puede orientar sobre que dependencia atiende tu caso: 55 5658 1111. El sitio tambien tiene un directorio con telefonos y paginas oficiales.",
      "Cuando llames, ten a la mano CURP, alcaldia, tipo de discapacidad y que necesitas pedir. Eso ayuda a que te canalicen mas rapido.",
    ],
    links: [
      { label: "Ver directorio de dependencias", href: "/secretarias" },
      { label: "Ver gestiones de salud", href: "/salud" },
    ],
  },
} satisfies Record<string, OrientationAnswer>;

const keywordMap: Array<{ key: keyof typeof answers; words: string[] }> = [
  { key: "tarjeta", words: ["tarjeta", "discapacidad cdmx", "transporte", "metro", "metrobus", "credencial"] },
  { key: "salud", words: ["salud", "medicina", "medicamento", "medicinas", "silla", "ruedas", "protesis", "muleta", "terapia", "rehabilitacion", "consulta", "hospital", "doctor"] },
  { key: "cita", words: ["cita", "agendar", "asesoria", "personal", "presencial", "linea", "videollamada", "cuenta", "login"] },
  { key: "pension", words: ["pension", "apoyo economico", "dinero", "mensual", "permanente"] },
  { key: "beca", words: ["beca", "escuela", "estudio", "estudiante", "colegio", "sep"] },
  { key: "trabajo", words: ["trabajo", "empleo", "vacante", "incluyeme", "cv", "curriculum", "postular"] },
  { key: "vivienda", words: ["vivienda", "casa", "rampa", "bano", "baño", "barandal", "adaptar", "invi"] },
  { key: "cuidador", words: ["cuidador", "cuido", "cuidar", "familiar", "severa"] },
  { key: "papeles", words: ["papeles", "documentos", "ine", "curp", "domicilio", "dictamen", "constancia", "no tengo", "me falta", "calle", "sin casa", "vulnerable"] },
  { key: "dependencias", words: ["secretaria", "dependencia", "telefono", "llamar", "locatel", "dif", "sibiso", "ifdp", "styfe"] },
  { key: "pagina", words: ["pagina", "sitio", "usar", "donde", "entrar", "redirige", "navegar", "mi cuenta"] },
  { key: "programas", words: ["programa", "programas", "apoyo", "apoyos", "social", "beneficio"] },
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getOrientationAnswer(question: string): OrientationAnswer {
  const cleanQuestion = normalize(question.trim());

  if (!cleanQuestion) return defaultAnswer;

  const matched = keywordMap.find(({ words }) =>
    words.some((word) => cleanQuestion.includes(normalize(word)))
  );

  if (matched) return answers[matched.key];

  return defaultAnswer;
}

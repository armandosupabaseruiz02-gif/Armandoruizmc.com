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
  "Como creo mi cuenta?",
  "Quiero la Tarjeta Accesible",
  "Necesito apoyo de salud",
  "Busco pension o apoyo economico",
  "Busco trabajo",
  "No tengo todos mis papeles",
];

const defaultAnswer: OrientationAnswer = {
  title: "Aqui te oriento, con confianza",
  body: [
    "Dime con tus palabras que necesitas: salud, tarjeta de discapacidad, apoyo economico, trabajo, vivienda, escuela, crear tu cuenta o saber a que dependencia ir.",
    "Si no sabes el nombre del tramite, no pasa nada. Escribe algo como: \"necesito una silla de ruedas\", \"quiero pension\", \"como creo mi cuenta\" o \"busco trabajo\".",
    "El equipo de Armando es tu megafono: aqui tu voz se potencia y si va a ser escuchada. Si tu caso es muy personal, agenda una cita y te damos seguimiento.",
  ],
  links: [
    { label: "Ver accesos directos", href: "/#ayuda-hoy" },
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
      "Para agendar necesitas crear tu cuenta o iniciar sesion. Despues eliges dia, horario, tema, modalidad en persona o en linea, y escribes el motivo de la cita.",
      "Horarios del portal: lunes a viernes de 9:00 a 17:00. Las citas quedan como solicitud pendiente hasta que el equipo las revise.",
    ],
    links: [
      { label: "Agendar cita", href: "/salud/agendar" },
      { label: "Ir a mi perfil", href: "/mi-cuenta" },
    ],
  },
  cuenta: {
    title: "Crear tu cuenta y para que sirve",
    body: [
      "Crear tu cuenta es gratis y rapido. Con ella agendas citas en linea o en persona y le das seguimiento a tus tramites y solicitudes de salud y discapacidad.",
      "Para crearla solo necesitas tu nombre, un correo y una contrasena. Luego confirmas tu correo y listo. Tus datos solo se usan para ayudarte.",
      "Si ya tienes cuenta, solo inicia sesion. Desde tu perfil ves tus citas y su estado. El equipo de Armando es tu megafono: tu voz se potencia y si va a ser escuchada.",
    ],
    links: [
      { label: "Crear mi cuenta", href: "/auth/registro" },
      { label: "Ya tengo cuenta", href: "/auth/login" },
    ],
  },
  programas: {
    title: "Programas sociales disponibles",
    body: [
      "Te mostramos apoyos reales para personas con discapacidad: la Pension del Bienestar (nacional), la Beca Benito Juarez (nacional), empleo con Abriendo Espacios (STPS), apoyos del DIF Estado de Mexico y de INDISCAPACIDAD CDMX.",
      "Algo importante: estos apoyos los dan las autoridades, no nosotros. Aqui te explicamos que son, que papeles piden y te llevamos al sitio oficial de cada dependencia donde se hace el tramite.",
      "Si no sabes cual te toca, cuentame tu caso: edad, si estudias, si trabajas, si tienes discapacidad permanente o si cuidas a alguien. Te oriento sin enredos.",
    ],
    links: [
      { label: "Ver programas sociales", href: "/programas-sociales" },
      { label: "Ver dependencias", href: "/secretarias" },
    ],
  },
  pension: {
    title: "Pension para personas con discapacidad",
    body: [
      "Es un apoyo economico federal para personas con discapacidad permanente. Lo entrega la Secretaria de Bienestar, directo en la tarjeta del Banco del Bienestar.",
      "En 2026 es de unos 3,300 pesos bimestrales y tiene cobertura nacional. Nosotros no lo entregamos: te informamos y te llevamos al sitio oficial donde se hace el registro.",
      "Documentos base: identificacion oficial, CURP, acta de nacimiento, comprobante de domicilio y constancia medica de discapacidad permanente de una institucion publica.",
    ],
    links: [
      { label: "Ver programas y sitio oficial", href: "/programas-sociales" },
      { label: "Agendar cita si necesitas ayuda", href: "/salud/agendar" },
    ],
  },
  beca: {
    title: "Beca para estudiantes con discapacidad",
    body: [
      "La Beca para el Bienestar Benito Juarez es nacional y da prioridad a estudiantes con discapacidad inscritos en escuela publica.",
      "La entrega la Coordinacion Nacional de Becas (SEP), no nosotros. Te explicamos y te llevamos al sitio oficial para que hagas tu registro segun la convocatoria.",
      "Documentos base: CURP, comprobante de estudios, identificacion cuando aplique y documento que acredite la discapacidad. Si es menor de edad, lleva tambien identificacion del tutor.",
    ],
    links: [
      { label: "Ver programas sociales", href: "/programas-sociales" },
      { label: "Ver directorio de dependencias", href: "/secretarias" },
    ],
  },
  trabajo: {
    title: "Trabajo y accesibilidad laboral",
    body: [
      "En la bolsa de trabajo conectamos vacantes que comparten empresas. El equipo no contrata ni garantiza el empleo: publica las vacantes y te conecta.",
      "Mientras se publican vacantes, puedes dejar tu perfil para que te avisemos, o buscar en Abriendo Espacios, la bolsa nacional de empleo para personas con discapacidad de la STPS.",
      "Para empezar prepara: CURP, identificacion, telefono, correo si tienes, tu experiencia o habilidades, y documento de discapacidad si lo tienes. Si no tienes CV, te ayudamos en una cita.",
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
      "En Inicio tienes accesos directos: agendar asesoria de salud, Tarjeta Accesible, programas sociales, bolsa de trabajo, donar y tu perfil.",
      "Si quieres aprender de un tramite, entra a su pagina. Si quieres seguimiento personal, agenda una cita. Si ya pediste cita, revisala en tu perfil.",
      "Para agendar o revisar citas necesitas crear tu cuenta o iniciar sesion. Asi proteges tus datos, porque se manejan datos personales y temas de salud.",
    ],
    links: [
      { label: "Crear mi cuenta", href: "/auth/registro" },
      { label: "Ir a mi perfil", href: "/mi-cuenta" },
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
  { key: "cuenta", words: ["crear cuenta", "registrar", "registro", "registrarme", "cuenta", "login", "iniciar sesion", "perfil", "contrasena", "password", "logueo", "loguear"] },
  { key: "cita", words: ["cita", "agendar", "asesoria", "personal", "presencial", "videollamada"] },
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

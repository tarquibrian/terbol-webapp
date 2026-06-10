import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import sanitizeHtml from "sanitize-html";
import { serverEnv } from "@/config/env";
import {
  getDurationMs,
  getRequestLogContext,
  logError,
  logInfo,
  logWarn,
} from "@/lib/logger";

// Nodemailer requiere el runtime Node (no Edge).
export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 5000;

interface ContactRequestBody {
  nombre?: unknown;
  email?: unknown;
  telefono?: unknown;
  mensaje?: unknown;
  /** Honeypot anti-spam: debe llegar vacío. */
  website?: unknown;
}

interface ContactFields {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  website: string;
}

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string;
  from: string;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Lee y normaliza los campos del body. */
function parseFields(body: unknown): ContactFields {
  const data = (body ?? {}) as ContactRequestBody;
  return {
    nombre: asString(data.nombre),
    email: asString(data.email),
    telefono: asString(data.telefono),
    mensaje: asString(data.mensaje),
    website: asString(data.website),
  };
}

/** Validación server-side. Devuelve el primer error encontrado o null. */
function validateFields(fields: ContactFields): string | null {
  if (!fields.nombre || fields.nombre.length < 3) {
    return "El nombre es obligatorio (mínimo 3 caracteres).";
  }
  if (!fields.email || !EMAIL_REGEX.test(fields.email)) {
    return "El correo electrónico no es válido.";
  }
  if (!fields.telefono || fields.telefono.length < 7) {
    return "El teléfono es obligatorio (mínimo 7 dígitos).";
  }
  if (
    fields.nombre.length > MAX_FIELD_LENGTH ||
    fields.email.length > MAX_FIELD_LENGTH ||
    fields.telefono.length > MAX_FIELD_LENGTH ||
    fields.mensaje.length > MAX_FIELD_LENGTH
  ) {
    return "Uno de los campos excede la longitud permitida.";
  }
  return null;
}

/**
 * Lee la configuración SMTP de las variables de entorno.
 * Devuelve null si falta alguna variable obligatoria (envío no configurado).
 */
function readSmtpConfig(): SmtpConfig | null {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } = serverEnv;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO || !CONTACT_FROM) {
    return null;
  }

  const port = Number(serverEnv.SMTP_PORT || "587");

  return {
    host: SMTP_HOST,
    port: Number.isFinite(port) ? port : 587,
    // secure=true para 465 (SSL); STARTTLS (587) usa secure=false.
    secure: serverEnv.SMTP_SECURE,
    user: SMTP_USER,
    pass: SMTP_PASS,
    to: CONTACT_TO,
    from: CONTACT_FROM,
  };
}

/** Escapa texto plano para incrustarlo de forma segura en el cuerpo HTML. */
function escapeHtml(value: string): string {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
}

function buildEmail(fields: ContactFields) {
  const subject = `Nuevo mensaje de contacto — ${fields.nombre}`;
  const mensaje = fields.mensaje || "(sin mensaje)";

  const text = [
    `Nombre: ${fields.nombre}`,
    `Email: ${fields.email}`,
    `Teléfono: ${fields.telefono}`,
    "",
    "Mensaje:",
    mensaje,
  ].join("\n");

  const html = `
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(fields.nombre)}</p>
    <p><strong>Email:</strong> ${escapeHtml(fields.email)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(fields.telefono)}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtml(mensaje).replace(/\n/g, "<br>")}</p>
  `;

  return { subject, text, html };
}

/**
 * Endpoint del formulario de contacto de /about.
 * Envía un email con los datos del visitante vía SMTP (Nodemailer).
 *
 * @example
 * POST /api/contact
 * Body: { "nombre": "...", "email": "...", "telefono": "...", "mensaje": "..." }
 */
export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const logContext = getRequestLogContext(request, "/api/contact");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    logWarn("contact_invalid_json", {
      ...logContext,
      durationMs: getDurationMs(startedAt),
    });
    return NextResponse.json(
      { success: false, message: "Solicitud inválida." },
      { status: 400 },
    );
  }

  const fields = parseFields(body);

  // Honeypot: si el campo oculto viene relleno, es un bot.
  // Respondemos 200 silencioso para no darle pistas, pero NO enviamos nada.
  if (fields.website) {
    logInfo("contact_honeypot_triggered", {
      ...logContext,
      durationMs: getDurationMs(startedAt),
    });
    return NextResponse.json({ success: true });
  }

  const validationError = validateFields(fields);
  if (validationError) {
    logWarn("contact_validation_failed", {
      ...logContext,
      durationMs: getDurationMs(startedAt),
    });
    return NextResponse.json(
      { success: false, message: validationError },
      { status: 400 },
    );
  }

  const smtp = readSmtpConfig();
  if (!smtp) {
    logError("contact_smtp_not_configured", undefined, {
      ...logContext,
      durationMs: getDurationMs(startedAt),
    });
    return NextResponse.json(
      { success: false, message: "El envío de correo no está configurado." },
      { status: 500 },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
    });

    const { subject, text, html } = buildEmail(fields);

    await transporter.sendMail({
      from: smtp.from,
      to: smtp.to,
      replyTo: fields.email,
      subject,
      text,
      html,
    });

    logInfo("contact_sent", {
      ...logContext,
      durationMs: getDurationMs(startedAt),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("contact_send_failed", error, {
      ...logContext,
      durationMs: getDurationMs(startedAt),
    });
    return NextResponse.json(
      {
        success: false,
        message: "No se pudo enviar el mensaje. Inténtalo más tarde.",
      },
      { status: 502 },
    );
  }
}

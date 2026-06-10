import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import nodemailer from "nodemailer";
import { POST } from "./route";

const originalInfo = console.info;
const originalWarn = console.warn;
const originalError = console.error;

const SMTP_KEYS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "CONTACT_TO",
  "CONTACT_FROM",
] as const;

const originalSmtpEnv: Record<string, string | undefined> = {};

function createRequest(body: unknown): Parameters<typeof POST>[0] {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }) as Parameters<typeof POST>[0];
}

function setSmtpEnv() {
  process.env.SMTP_HOST = "smtp.test";
  process.env.SMTP_PORT = "587";
  process.env.SMTP_SECURE = "false";
  process.env.SMTP_USER = "user@test";
  process.env.SMTP_PASS = "secret";
  process.env.CONTACT_TO = "inbox@terbol.test";
  process.env.CONTACT_FROM = "no-reply@terbol.test";
}

function clearSmtpEnv() {
  for (const key of SMTP_KEYS) delete process.env[key];
}

const validPayload = {
  nombre: "Brian Test",
  email: "brian@example.com",
  telefono: "+59170123456",
  mensaje: "Hola, quiero info",
};

beforeEach(() => {
  for (const key of SMTP_KEYS) originalSmtpEnv[key] = process.env[key];
  clearSmtpEnv();
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};
});

afterEach(() => {
  mock.restoreAll();
  for (const key of SMTP_KEYS) {
    if (originalSmtpEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalSmtpEnv[key];
  }
  console.info = originalInfo;
  console.warn = originalWarn;
  console.error = originalError;
});

test("POST /api/contact rechaza JSON invalido con 400", async () => {
  const response = await POST(createRequest("no-json{"));
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.message, "Solicitud inválida.");
});

test("POST /api/contact responde 200 silencioso y NO envia si el honeypot viene relleno", async () => {
  setSmtpEnv();
  const sendMail = mock.fn(async () => ({}));
  mock.method(nodemailer, "createTransport", () => ({ sendMail }));

  const response = await POST(
    createRequest({ ...validPayload, website: "http://spam.ru" }),
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(sendMail.mock.callCount(), 0);
});

test("POST /api/contact rechaza email invalido con 400", async () => {
  const response = await POST(
    createRequest({ ...validPayload, email: "no-es-email" }),
  );
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.match(body.message, /correo/i);
});

test("POST /api/contact rechaza nombre faltante con 400", async () => {
  const response = await POST(
    createRequest({ ...validPayload, nombre: "" }),
  );
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.match(body.message, /nombre/i);
});

test("POST /api/contact responde 500 si el SMTP no esta configurado", async () => {
  clearSmtpEnv();
  const response = await POST(createRequest(validPayload));
  const body = await response.json();

  assert.equal(response.status, 500);
  assert.equal(body.success, false);
  assert.match(body.message, /no está configurado/i);
});

test("POST /api/contact envia el email y responde 200 en el camino feliz", async () => {
  setSmtpEnv();
  const sendMail = mock.fn(async () => ({ messageId: "abc" }));
  mock.method(nodemailer, "createTransport", () => ({ sendMail }));

  const response = await POST(createRequest(validPayload));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(sendMail.mock.callCount(), 1);

  const mailArgs = sendMail.mock.calls[0].arguments[0];
  assert.equal(mailArgs.to, "inbox@terbol.test");
  assert.equal(mailArgs.from, "no-reply@terbol.test");
  // replyTo permite responder directo al visitante.
  assert.equal(mailArgs.replyTo, validPayload.email);
  assert.match(mailArgs.subject, /Brian Test/);
});

test("POST /api/contact responde 502 si el envio SMTP falla", async () => {
  setSmtpEnv();
  const sendMail = mock.fn(async () => {
    throw new Error("SMTP down");
  });
  mock.method(nodemailer, "createTransport", () => ({ sendMail }));

  const response = await POST(createRequest(validPayload));
  const body = await response.json();

  assert.equal(response.status, 502);
  assert.equal(body.success, false);
  assert.equal(sendMail.mock.callCount(), 1);
});

"use client";

import * as React from "react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Button } from "@/components/ui/Button";
import { FormInput, FormTextarea } from "@/components/ui/Input";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { apiPath, assetPath } from "@/lib/base-path";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export const ContactForm = () => {
  const [status, setStatus] = React.useState<SubmitStatus>("idle");
  const [feedback, setFeedback] = React.useState<string>("");
  // El <input type="tel"> solo expone el número local; guardamos el valor
  // completo (prefijo país + número) que entrega onPhoneChange.
  const phoneRef = React.useRef<string>("");
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const payload = {
      nombre: String(formData.get("nombre") ?? ""),
      email: String(formData.get("email") ?? ""),
      telefono: phoneRef.current || String(formData.get("telefono") ?? ""),
      mensaje: String(formData.get("mensaje") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch(apiPath("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (!response.ok || !data?.success) {
        setStatus("error");
        setFeedback(
          data?.message ?? "No se pudo enviar el mensaje. Inténtalo más tarde.",
        );
        return;
      }

      setStatus("success");
      setFeedback("¡Mensaje enviado! Un asesor se pondrá en contacto contigo.");
      formRef.current?.reset();
      phoneRef.current = "";
    } catch {
      setStatus("error");
      setFeedback(
        "No se pudo enviar el mensaje. Revisa tu conexión e inténtalo de nuevo.",
      );
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        <AnimateOnScroll
          variant="fade"
          className="overflow-hidden relative flex flex-col gap-12 md:gap-16 justify-center items-center bg-primary-soft-gray-light rounded-lg py-12 md:py-16 px-4"
        >
          <AnimateOnScroll
            variant="slide-up"
            delay={0.1}
            className="flex flex-col gap-4 justify-center items-center z-10"
          >
            <h3 className="heading-h3 text-center">¿Necesitas orientación?</h3>
            <p className="text-body-medium text-gray-500 text-center text-balance max-w-[700px]">
              Te contactamos con un Asesor de Ventas Independiente que te brinde
              acompañamiento personalizado y descubras cuáles productos se
              adaptan mejor a tus necesidades.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll
            variant="slide-up"
            delay={0.2}
            className="max-w-[450px] w-full z-10"
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-0 md:gap-2"
            >
              <AnimateOnScroll variant="slide-up" delay={0.25}>
                <FormInput
                  name="nombre"
                  label="Nombre"
                  placeholder="Ingrese su nombre"
                  rules={[
                    { type: "required" },
                    { type: "minLength", value: 3 },
                  ]}
                />
              </AnimateOnScroll>
              <AnimateOnScroll variant="slide-up" delay={0.3}>
                <FormInput
                  name="email"
                  label="Email"
                  placeholder="Ingrese su email"
                  rules={[{ type: "required" }, { type: "email" }]}
                />
              </AnimateOnScroll>
              <AnimateOnScroll variant="slide-up" delay={0.35}>
                <FormInput
                  name="telefono"
                  label="Teléfono"
                  type="phone"
                  defaultCountry="BO"
                  // dialLocked
                  placeholder="Ingrese su teléfono"
                  rules={[
                    { type: "required" },
                    { type: "minLength", value: 7 },
                  ]}
                  onPhoneChange={({ full }) => {
                    phoneRef.current = full;
                  }}
                />
              </AnimateOnScroll>
              <AnimateOnScroll variant="slide-up" delay={0.4}>
                <FormTextarea
                  name="mensaje"
                  label="Mensaje"
                  placeholder="Ingrese su mensaje"
                  autoResize
                />
              </AnimateOnScroll>

              {/* Honeypot anti-spam: oculto para humanos, los bots lo rellenan. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] w-px h-px opacity-0"
              />

              <AnimateOnScroll variant="slide-up" delay={0.45}>
                <Button
                  type="submit"
                  variant="secondary"
                  size="default"
                  className="w-full mt-4 justify-between"
                  icon={<ArrowRight />}
                  iconPosition="right"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando…" : "Enviar"}
                </Button>
              </AnimateOnScroll>

              {feedback && (
                <p
                  role={status === "error" ? "alert" : "status"}
                  className={
                    status === "error"
                      ? "mt-3 text-body-small text-red-600 text-center"
                      : "mt-3 text-body-small text-green-700 text-center"
                  }
                >
                  {feedback}
                </p>
              )}
            </form>
          </AnimateOnScroll>
          <AnimateOnScroll
            variant="fade"
            delay={0.15}
            className="absolute bottom-[-35%] left-0 w-full h-full z-1"
          >
            <Image
              src={assetPath("/gradientradius.png")}
              alt="Contact form background"
              className="object-cover w-full h-full"
              width={1000}
              height={1000}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </AnimateOnScroll>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

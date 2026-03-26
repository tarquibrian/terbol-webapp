import { Button } from "@/components/ui/Button";
import { FormInput, FormTextarea } from "@/components/ui/Input";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const ContactForm = () => {
  return (
    <section className="wrapper-section">
      <div className="wrapper-content">
        <div className="overflow-hidden relative flex flex-col gap-16 justify-center items-center bg-primary-soft-gray-light rounded-lg py-16 px-4">
          <div className="flex flex-col gap-4 justify-center items-center z-10">
            <h3 className="heading-h3 text-center">¿Necesitas orientación?</h3>
            <p className="text-body-medium text-gray-500 max-w-[700px] text-center">Contactá con un asesor de ventas para recibir asesoramiento personalizado sobre qué productos son ideales para vos.</p>
          </div>
          <div className="max-w-[450px] w-full z-10">
            <form className="flex flex-col gap-0 md:gap-2">
              <FormInput
                label="Nombre"
                placeholder="Ingrese su nombre"
                rules={[{ type: "required" }, { type: "minLength", value: 3 }]}
              />
              <FormInput
                label="Email"
                placeholder="Ingrese su email"
                rules={[{ type: "required" }, { type: "email" }]}
              />
              <FormInput
                label="Teléfono"
                type="phone"
                defaultCountry="BO"
                // dialLocked
                placeholder="Ingrese su teléfono"
                rules={[{ type: "required" }, { type: "minLength", value: 7 }]}
              />
              <FormTextarea
                label="Mensaje"
                placeholder="Ingrese su mensaje"
                autoResize
              />
              <Button
                type="submit"
                variant="secondary"
                size="default"
                className="w-full mt-4 justify-between"
                icon={<ArrowRight />}
                iconPosition="right"
              >
                Enviar
              </Button>
            </form>
          </div>
          <Image
            src="/gradientradius.png"
            alt="Contact form background"
            className="object-cover absolute bottom-[-35%] left-0 w-full h-full z-1"
            width={1000}
            height={1000}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
    </section>
  );
}
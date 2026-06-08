import clsx from "clsx";
import Image, { StaticImageData } from "next/image";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { sanitizeCmsHtml } from "@/lib/html-sanitizer";

export interface StepProps {
  number: number;
  title: string;
  description: string;
  image: StaticImageData | string;
  reverse: boolean;
  imageAlt?: string;
}

export function SuccessPlanStep({ number, title, description, image, reverse, imageAlt = "Step image" }: StepProps) {
  const sanitizedTitle = sanitizeCmsHtml(title);
  const sanitizedDescription = sanitizeCmsHtml(description);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-16 lg:gap-[80px] items-center">
      <AnimateOnScroll
        variant={reverse ? "slide-left" : "slide-right"}
        className={clsx(
          "flex flex-col gap-4 md:gap-6",
          reverse && "lg:order-2"
        )}
      >
        <div className="flex items-center gap-2 text-2xl font-semibold text-gray-300">
          <span className="min-w-fit">{String(number).padStart(2, '0')}</span>
          <div className="w-[80%] h-[1px] bg-gray-200"></div>
        </div>
        <h3 className="heading-h4 font-bold text-wrap text-primary" dangerouslySetInnerHTML={{ __html: sanitizedTitle }} />
        <p className="text-body-medium text-gray-500" dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
      </AnimateOnScroll>
      <AnimateOnScroll
        variant="fade"
        delay={0.2}
        className={clsx(
          "rounded-md overflow-hidden aspect-[6/4] relative",
          reverse && "md:order-1"
        )}
      >
        <div className="absolute z-10 inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>
        <Image 
          src={image} 
          alt={imageAlt} 
          width={600} 
          height={400}
          className="w-full h-full object-cover relative z-0" 
        />
      </AnimateOnScroll>
    </div>
  );
}

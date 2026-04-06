import clsx from "clsx";
import Image, { StaticImageData } from "next/image";

export interface StepProps {
  number: number;
  title: string;
  description: string;
  image: StaticImageData;
  reverse: boolean;
  imageAlt?: string;
}

export function SuccessPlanStep({ number, title, description, image, reverse, imageAlt = "Step image" }: StepProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-16 lg:gap-[80px] items-center">
      <div className={clsx(
        "flex flex-col gap-4 md:gap-6",
        reverse && "lg:order-2"
      )}>
        <div className="flex items-center gap-2 text-2xl font-semibold">
          {number}
          <div className="w-[80%] h-[1px] bg-gray-200"></div>
        </div>
        <h4 className="heading-h5 font-bold text-wrap" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="text-body-medium text-gray-500" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
      <div className={clsx(
        "rounded-md overflow-hidden aspect-[6/4] relative",
        reverse && "md:order-1"
      )}>
        <div className="absolute z-10 inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>
        <Image src={image} alt={imageAlt} width={600} className="w-full h-full object-cover relative z-0" />
      </div>
    </div>
  );
}

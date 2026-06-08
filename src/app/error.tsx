"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { logError } from "@/lib/logger";

interface AppErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: AppErrorProps) {
  React.useEffect(() => {
    logError("app_error_boundary", error, {
      route: "app",
      digest: error.digest,
    });
  }, [error]);

  return (
    <section className="flex min-h-[60vh] w-full items-center justify-center px-4 py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="mb-4 text-body-small font-medium uppercase text-primary-orange">
          Error temporal
        </span>
        <h1 className="heading-h4 mb-6 text-primary-black">
          No pudimos cargar esta sección
        </h1>
        <p className="mb-10 text-body-medium text-gray-500">
          Intenta nuevamente. Si el problema continúa, puede deberse a una
          interrupción temporal del CMS o del servicio de datos.
        </p>
        <Button
          type="button"
          variant="secondary"
          icon={<RefreshCw size={20} />}
          iconPosition="right"
          onClick={reset}
        >
          Reintentar
        </Button>
      </div>
    </section>
  );
}

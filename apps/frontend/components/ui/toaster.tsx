"use client";

import { Toast, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { dismiss, toasts } = useToast();

  return (
    <ToastViewport>
      {toasts.map((toast) => (
        <Toast
          description={toast.description}
          key={toast.id}
          onOpenChange={(open) => {
            if (!open) {
              dismiss(toast.id);
            }
          }}
          open={toast.open}
          title={toast.title}
          variant={toast.variant}
        />
      ))}
    </ToastViewport>
  );
}

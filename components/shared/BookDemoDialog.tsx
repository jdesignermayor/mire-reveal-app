"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type BookDemoDialogProps = {
  trigger: React.ReactNode;
};

export function BookDemoDialog({ trigger }: BookDemoDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.Calendly) {
      // Give Calendly time to initialize the widget
      const timer = setTimeout(() => {
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/jdesignermayor/mire-reveal-demo',
          parentElement: document.querySelector('.calendly-inline-widget') as HTMLElement,
          prefill: {},
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="max-w-[95vw] w-full max-h-[90vh] h-[90vh] sm:max-w-[900px] p-0 overflow-hidden"
        showCloseButton={true}
      >
        <DialogTitle className="sr-only">Book a demo</DialogTitle>
        <div 
          className="calendly-inline-widget"
          data-url="https://calendly.com/jdesignermayor/mire-reveal-demo"
          style={{ minWidth: '320px', height: '700px', width: '100%' }}
        />
      </DialogContent>
    </Dialog>
  );
}

"use client";

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
  return (
    <Dialog>
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

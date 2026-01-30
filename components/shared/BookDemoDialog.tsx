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
        <iframe
          src="https://calendly.com/jdesignermayor/mire-reveal-demo?embed=true&embed_type=inline"
          title="Book a demo - Mire Reveal"
          className="w-full h-full border-0"
          style={{ minWidth: '320px', height: '700px' }}
        />
      </DialogContent>
    </Dialog>
  );
}

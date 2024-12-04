"use client";
import useClickOutside from "@/app/_hook/outside";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
type ModalProps = {
  children: React.ReactNode;
  className?: string;
};

export const Modal = ({ children, className }: ModalProps) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const handleOnClose = () => router.back();
  const closeRef = useRef(null);
  useClickOutside(closeRef, handleOnClose);

  return (
    <Dialog open onOpenChange={setOpen}>
      <DialogContent className={cn("min-w-full m-0 p-0 border-0", className)}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

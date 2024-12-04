import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FC, ReactNode } from "react";
import { usePopup } from "./dialog";

export interface PopupProps {
  children: ReactNode;
  title: ReactNode;
  width?: number;
  closeDialog?: { state: boolean; fn: () => void };
  className?: string;
}

interface FooterProps {
  onConfirm: () => void;
  text?: ReactNode;
  loading?: boolean;
}

export const Footer: FC<FooterProps> = ({ onConfirm, text, loading }) => {
  const { closeDialog } = usePopup();
  return (
    <AlertDialogFooter className="p-2 border-t">
      <AlertDialogCancel onClick={closeDialog}>Cancel</AlertDialogCancel>
      <Button className="min-w-[150px]" disabled={loading} onClick={onConfirm}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : text ? (
          text
        ) : (
          "Confirm"
        )}
      </Button>
    </AlertDialogFooter>
  );
};

import { cn } from "@/lib/utils";

interface ModalProps {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export function Modal({ children, className, onClose }: ModalProps) {
  return (
    <div className="modal-scrim fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-6" onClick={onClose}>
      <div className={cn("modal-panel glass-panel fade-up", className)} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

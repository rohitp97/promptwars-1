import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export function Toast({ message, visible, onClose }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 flex items-center justify-between gap-3 px-4 py-3 bg-neutral-800 border border-emerald-500/30 text-emerald-50 rounded-2xl shadow-xl shadow-emerald-500/10 min-w-[300px]",
        visible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-12 opacity-0 scale-95 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-emerald-400" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

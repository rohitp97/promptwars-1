import { X, MapPin, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Amenity } from '@/types';

interface FoodPickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreOrder: (item: string) => void;
  amenities: Amenity[] | null;
}

export function FoodPickupModal({ isOpen, onClose, onPreOrder, amenities }: FoodPickupModalProps) {
  const foodStalls = amenities?.filter(a => a.type === 'food') || [];
  return (
    <>
      {/* Backdrop */}
      <div 
        role="presentation"
        aria-hidden="true"
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-neutral-900 border-t border-neutral-800 p-6 rounded-t-3xl z-50 transition-transform duration-500 ease-out shadow-2xl",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Coffee className="w-6 h-6 text-emerald-400" />
            Express Food
          </h2>
          <button onClick={onClose} aria-label="Close Food Modal" className="p-2 bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors">
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-4 min-h-[300px]">
          {!amenities ? (
            // Loading Skeleton matching the stall card height
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-neutral-800/50 border border-neutral-700/50 p-4 rounded-2xl flex items-center justify-between h-[88px] animate-pulse">
                <div className="flex flex-col gap-2 w-1/2">
                   <div className="h-5 bg-neutral-700 rounded w-full"></div>
                   <div className="h-3 bg-neutral-700 rounded w-2/3"></div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                   <div className="h-5 bg-neutral-700 rounded w-16"></div>
                   <div className="h-8 bg-neutral-700 rounded w-20"></div>
                </div>
              </div>
            ))
          ) : foodStalls.length === 0 ? (
             <div className="text-center text-neutral-400 py-8">No food stalls available nearby.</div>
          ) : (
            foodStalls.map((stall) => (
            <div key={stall.id} className="bg-neutral-800/50 border border-neutral-700/50 p-4 rounded-2xl flex items-center justify-between group hover:bg-neutral-800 transition-colors">
              <div>
                <h3 className="text-white font-semibold text-lg transition-all">{stall.name}</h3>
                <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {stall.distance || "Nearby"}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 bg-neutral-950 px-2.5 py-1 rounded-full border border-neutral-800">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full shadow-lg transition-colors duration-500",
                    stall.statusColor === 'green' ? "bg-emerald-500 shadow-emerald-500/50" :
                    stall.statusColor === 'yellow' ? "bg-amber-500 shadow-amber-500/50" : "bg-red-500 shadow-red-500/50"
                  )} />
                  <span className="text-[10px] text-neutral-300 font-medium uppercase tracking-wider tabular-nums transition-all duration-300">
                    {stall.waitTime === 0 ? "No wait" : `${stall.waitTime} min wait`}
                  </span>
                </div>
                <button 
                  onClick={() => onPreOrder(stall.name)}
                  className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-neutral-950 font-semibold text-sm rounded-lg transition-all active:scale-95"
                >
                  Pre-order
                </button>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

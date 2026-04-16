import { cn } from "@/lib/utils";

interface StadiumMapProps {
  userSection: string;
  activeRoute?: string | null;
}

export function StadiumMap({ userSection, activeRoute }: StadiumMapProps) {
  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto flex items-center justify-center p-4 bg-neutral-900/40 rounded-3xl border border-neutral-800 backdrop-blur-sm overflow-hidden">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#166534" stopOpacity="0.8"/>
          </radialGradient>
        </defs>

        {/* Style block for dash animation */}
        <style>
          {`
            @keyframes path-draw {
              from { stroke-dasharray: 400; stroke-dashoffset: 400; }
              to { stroke-dasharray: 400; stroke-dashoffset: 0; }
            }
            .path-active-exit {
              stroke: #3b82f6;
              stroke-width: 4;
              stroke-linecap: round;
              stroke-linejoin: round;
              animation: path-draw 1.5s ease-out forwards;
              opacity: 1;
              filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.8));
            }
            .path-active-washroom {
              stroke: #eab308;
              stroke-width: 4;
              stroke-linecap: round;
              stroke-linejoin: round;
              animation: path-draw 1.5s ease-out forwards;
              opacity: 1;
              filter: drop-shadow(0 0 6px rgba(234, 179, 8, 0.8));
            }
            .path-hidden {
              stroke: #525252;
              stroke-width: 2;
              stroke-opacity: 0.2;
              opacity: 0;
            }
          `}
        </style>
        
        {/* Outfield / Stands Background */}
        <ellipse cx="100" cy="100" rx="95" ry="85" className="fill-neutral-800" />
        
        {/* North Stand */}
        <path d="M 20 60 Q 100 0 180 60 L 150 75 Q 100 35 50 75 Z" 
          className={cn("transition-colors duration-500", userSection === 'North' ? "fill-emerald-500" : "fill-neutral-700")} />
        
        {/* South Stand */}
        <path d="M 20 140 Q 100 200 180 140 L 150 125 Q 100 165 50 125 Z" 
          className={cn("transition-colors duration-500", userSection === 'South' ? "fill-emerald-500" : "fill-neutral-700")} />
          
        {/* East Stand */}
        <path d="M 175 65 Q 205 100 175 135 L 145 120 Q 165 100 145 80 Z" 
          className={cn("transition-colors duration-500", userSection === 'East' ? "fill-emerald-500" : "fill-neutral-700")} />

        {/* West Stand */}
        <path d="M 25 65 Q -5 100 25 135 L 55 120 Q 35 100 55 80 Z" 
          className={cn("transition-colors duration-500", userSection === 'West' ? "fill-emerald-500" : "fill-neutral-700")} />
          
        {/* Topological Base Grid (Invisible/Faint) */}
        <ellipse cx="100" cy="100" rx="80" ry="70" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <line x1="100" y1="40" x2="100" y2="30" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <line x1="100" y1="160" x2="100" y2="170" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <line x1="20" y1="100" x2="40" y2="100" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <line x1="160" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

        {/* Walkway Routes */}
        <path 
          id="route-exit-gate4" 
          d="M 100 40 L 100 30 A 80 70 0 0 1 160 53.7 L 165 48" 
          fill="none"
          className={cn(
            "transition-all duration-500 ease-in-out",
            activeRoute === 'route-exit-gate4' ? "path-active-exit" : "path-hidden"
          )} 
        />
        {/* Exit Node Dot */}
        <circle cx="165" cy="48" r="3.5" 
          className={cn(
            "transition-opacity duration-500",
            activeRoute === 'route-exit-gate4' ? "fill-blue-500 shadow-xl opacity-100" : "opacity-0"
          )}
        />
        
        <path 
          id="route-washroom-blockC" 
          d="M 100 40 L 100 30 A 80 70 0 0 0 40 53.7 L 35 48" 
          fill="none"
          className={cn(
            "transition-all duration-500 ease-in-out",
            activeRoute === 'route-washroom-blockC' ? "path-active-washroom" : "path-hidden"
          )} 
        />
        {/* Washroom Node Dot */}
        <circle cx="35" cy="48" r="3.5" 
          className={cn(
            "transition-opacity duration-500",
            activeRoute === 'route-washroom-blockC' ? "fill-yellow-500 shadow-xl opacity-100" : "opacity-0"
          )}
        />

        <path 
          id="route-washroom-gate2" 
          d="M 100 40 L 100 30 A 80 70 0 0 1 160 146.3 L 165 152" 
          fill="none"
          className={cn(
            "transition-all duration-500 ease-in-out",
            activeRoute === 'route-washroom-gate2' ? "path-active-washroom" : "path-hidden"
          )} 
        />
        <circle cx="165" cy="152" r="3.5" 
          className={cn(
            "transition-opacity duration-500",
            activeRoute === 'route-washroom-gate2' ? "fill-yellow-500 shadow-xl opacity-100" : "opacity-0"
          )}
        />

        {/* Field */}
        <ellipse cx="100" cy="100" rx="60" ry="50" fill="url(#fieldGrad)" className="stroke-emerald-400 stroke-1" />
        
        {/* Pitch */}
        <rect x="94" y="80" width="12" height="40" rx="2" className="fill-[#d4b38a]" />
        
        {/* Highlight Marker */}
        {userSection === 'North' && (
          <circle cx="100" cy="40" r="5" className="fill-emerald-300 animate-pulse drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        )}
      </svg>
      
      {/* Legend / Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between px-3 py-2 bg-neutral-950/80 rounded-xl backdrop-blur text-xs font-medium text-neutral-300 border border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          Your Seat
        </div>
        <div>
          Section: <span className="text-emerald-400 font-bold">{userSection}</span>
        </div>
      </div>
    </div>
  );
}

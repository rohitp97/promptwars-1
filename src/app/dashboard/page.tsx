"use client";

import { useState, useEffect } from "react";
import { Coffee, Navigation, DoorOpen, Info, X, MapPin } from "lucide-react";
import { StadiumMap } from "@/components/StadiumMap";
import { Toast } from "@/components/Toast";
import { collection, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'food' | 'washroom' | null>(null);
  const [amenities, setAmenities] = useState<any[] | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    // Real-time Firestore listener for live traffic/amenities
    const q = collection(db, 'amenities');
    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
      const data = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      setAmenities(data);
    }, (error: Error) => {
      console.error("Firestore error:", error);
    });
    return () => unsubscribe();
  }, []);

  // Simulation Effect Interval
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isSimulating) {
      // Instantly trigger once before interval
      fetch('/api/simulate-traffic', { method: 'POST' }).catch(console.error);
      intervalId = setInterval(() => {
        fetch('/api/simulate-traffic', { method: 'POST' }).catch(console.error);
      }, 8000);
    }
    return () => clearInterval(intervalId);
  }, [isSimulating]);

  // Mock data for the logged-in user
  const user = {
    pnr: "RCB123",
    section: "North",
    seat: "Row G, Seat 42"
  };

  const handleWashroomClick = () => {
    setActiveCategory('washroom');
    setActiveRoute(null);
  };

  const handleFoodClick = () => {
    setActiveCategory('food');
    setActiveRoute(null);
  };

  const handleAmenityClick = (amenity: any) => {
    // Based on the amenity name, we determine the route ID to highlight on map
    if (amenity.name === "North Stand Washroom - Block C") {
      setActiveRoute("route-washroom-blockC");
      setToastMessage("Route to Block C Washroom generated");
      setIsToastVisible(true);
    } else if (amenity.name === "Concourse Washroom - Gate 2") {
      setActiveRoute("route-washroom-gate2");
      setToastMessage("Route to Gate 2 Washroom generated");
      setIsToastVisible(true);
    } else {
      // Default fallback / food stalls
      setActiveRoute(null);
      setToastMessage(`Selected ${amenity.name}`);
      setIsToastVisible(true);
    }
  };

  const filteredAmenities = amenities?.filter(a => a.type === activeCategory) || [];

  return (
    <div className="bg-black min-h-screen w-full font-sans">
      <div className="max-w-md mx-auto min-h-screen bg-neutral-950 text-neutral-50 border-x border-neutral-800 relative shadow-2xl pb-20 overflow-x-hidden">
      <Toast 
        message={toastMessage} 
        visible={isToastVisible} 
        onClose={() => setIsToastVisible(false)} 
      />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-0.5">Your Match</p>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            RCB vs MI
          </h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-400">Gate Open</p>
          <p className="text-sm font-medium text-emerald-400">On Time</p>
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto relative">
        {/* Ticket Info Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-6 flex justify-between items-center shadow-lg">
          <div>
            <p className="text-sm text-neutral-400 mb-1">Pass / PNR</p>
            <p className="font-mono font-bold text-lg">{user.pnr}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-400 mb-1">Assigned Seat</p>
            <p className="font-bold text-emerald-400">{user.seat}</p>
          </div>
        </div>

        {/* Stadium Map Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-500" /> Live Map
            </h2>
            <button className="p-1.5 bg-neutral-800 rounded-full text-neutral-400">
              <Info className="w-4 h-4" />
            </button>
          </div>
          <StadiumMap userSection={user.section} activeRoute={activeRoute} />
        </section>

        {/* Clear Route / Category Button */}
        {(activeRoute || activeCategory) && (
          <div className="mb-6 flex justify-center animate-in fade-in slide-in-from-bottom-2">
            <button 
              onClick={() => {
                setActiveRoute(null);
                setActiveCategory(null);
              }}
              className="bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 active:scale-95 shadow-lg"
            >
              <X className="w-4 h-4" /> Clear Selection
            </button>
          </div>
        )}

        {/* Hackathon Simulation Toggle */}
        <div className="mb-6">
          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={cn(
              "w-full p-4 rounded-2xl flex items-center justify-between border transition-all duration-300",
              isSimulating ? "bg-purple-900/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]" : "bg-neutral-900 border-neutral-800 hover:bg-neutral-800"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors", isSimulating ? "bg-purple-500/20" : "bg-neutral-800")}>
                <div className={cn("w-3 h-3 rounded-full transition-colors", isSimulating ? "bg-purple-400 animate-ping" : "bg-neutral-600")} />
              </div>
              <div className="text-left">
                <h3 className={cn("font-bold", isSimulating ? "text-purple-300" : "text-neutral-300")}>
                  {isSimulating ? "Simulation Active" : "Simulation: Auto-Update Traffic"}
                </h3>
                <p className="text-xs text-neutral-400">
                  {isSimulating ? "Backend randomizing data every 8s" : "Tap to demo live push updates"}
                </p>
              </div>
            </div>
            <div className={cn("px-3 py-1 rounded-full text-xs font-bold", isSimulating ? "bg-purple-500/20 text-purple-300" : "bg-neutral-800 text-neutral-500")}>
              {isSimulating ? "ON" : "OFF"}
            </div>
          </button>
        </div>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-neutral-200">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleFoodClick}
              className={cn(
                "bg-neutral-900 border p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group",
                activeCategory === 'food' ? "border-emerald-500/50 bg-neutral-800/80" : "border-neutral-800 hover:bg-neutral-800"
              )}
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Coffee className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="font-medium text-sm text-neutral-300">Express Food</span>
            </button>

            <button 
              onClick={handleWashroomClick}
              className={cn(
                "bg-neutral-900 border p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group",
                activeCategory === 'washroom' ? "border-blue-500/50 bg-neutral-800/80" : "border-neutral-800 hover:bg-neutral-800"
              )}
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <DoorOpen className="w-6 h-6 text-blue-400" />
              </div>
              <span className="font-medium text-sm text-neutral-300">Washroom</span>
            </button>
            
            <button 
              onClick={() => {
                setActiveRoute('route-exit-gate4');
                setActiveCategory(null);
                setToastMessage("Exit route highlighted on map!");
                setIsToastVisible(true);
              }}
              className="col-span-2 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-800 hover:border-red-500/30 transition-all active:scale-95 group"
            >
              <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                <Navigation className="w-5 h-5 text-red-400" />
              </div>
              <span className="font-medium text-sm text-neutral-300">Emergency Exit Route</span>
            </button>
          </div>
        </section>

        {/* Dynamic Amenities List */}
        {activeCategory && (
          <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              {activeCategory === 'food' ? <Coffee className="w-5 h-5 text-emerald-400" /> : <DoorOpen className="w-5 h-5 text-blue-400" />}
              {activeCategory === 'food' ? 'Express Food Options' : 'Nearest Washrooms'}
            </h2>
            <div className="flex flex-col gap-4">
              {!amenities ? (
                // Loading Skeleton
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="bg-neutral-800/50 border border-neutral-700/50 p-4 rounded-2xl flex items-center justify-between h-[88px] animate-pulse">
                    <div className="flex flex-col gap-2 w-1/2">
                      <div className="h-5 bg-neutral-700 rounded w-full"></div>
                      <div className="h-3 bg-neutral-700 rounded w-2/3"></div>
                    </div>
                  </div>
                ))
              ) : filteredAmenities.length === 0 ? (
                <div className="text-center text-neutral-400 py-8">No {activeCategory} available nearby.</div>
              ) : (
                filteredAmenities.map((amenity) => {
                  const isActive = (
                    (amenity.name === "North Stand Washroom - Block C" && activeRoute === "route-washroom-blockC") ||
                    (amenity.name === "Concourse Washroom - Gate 2" && activeRoute === "route-washroom-gate2")
                  );
                  
                  return (
                    <button 
                      key={amenity.id} 
                      onClick={() => handleAmenityClick(amenity)}
                      className={cn(
                        "w-full text-left bg-neutral-800/50 border p-4 rounded-2xl flex items-center justify-between group transition-all duration-300",
                        isActive ? "border-yellow-500/50 bg-neutral-800 shadow-lg shadow-yellow-500/10" : "border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600"
                      )}
                    >
                      <div>
                        <h3 className="text-white font-semibold text-lg transition-all">{amenity.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {amenity.distance || "Nearby"}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        {amenity.statusColor && (
                          <div className="flex items-center gap-2 bg-neutral-950 px-2.5 py-1 rounded-full border border-neutral-800">
                            <div className={cn(
                              "w-2.5 h-2.5 rounded-full shadow-lg transition-colors duration-500",
                              amenity.statusColor === 'green' ? "bg-emerald-500 shadow-emerald-500/50" :
                              amenity.statusColor === 'yellow' ? "bg-amber-500 shadow-amber-500/50" : "bg-red-500 shadow-red-500/50"
                            )} />
                            <span className="text-[10px] text-neutral-300 font-medium uppercase tracking-wider tabular-nums transition-all duration-300">
                              {amenity.waitTime === 0 ? "No wait" : `${amenity.waitTime} min wait`}
                            </span>
                          </div>
                        )}
                        {isActive && (
                          <span className="text-xs font-semibold text-yellow-500 animate-pulse mt-1">Routing on map...</span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>
        )}
      </main>
      </div>
    </div>
  );
}

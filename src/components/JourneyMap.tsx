"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { ExternalLink, Navigation, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// M. Chinnaswamy Stadium Gate 4 Coordinates
const GATE_4_COORDS = { lat: 12.9789, lng: 77.5972 }; // Queen's Road side (Gate 4)

export function JourneyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        initMap(userLoc);
      },
      (error) => {
        setLoading(false);
        setErrorMsg(
          "We couldn't access your location. Please check your browser permissions to calculate the journey."
        );
      }
    );

    const initMap = async (userLoc: { lat: number; lng: number }) => {
      try {
        setOptions({
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
        });

        const { Map } = await importLibrary("maps") as google.maps.MapsLibrary;
        const { DirectionsService, DirectionsRenderer } = await importLibrary("routes") as google.maps.RoutesLibrary;

        if (mapRef.current) {
          const mapInstance = new Map(mapRef.current, {
            center: userLoc,
            zoom: 14,
            disableDefaultUI: true,
          });
          setMap(mapInstance);

          const directionsService = new DirectionsService();
          const directionsRenderer = new DirectionsRenderer({
            map: mapInstance,
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: "#10b981", // emerald-500
              strokeWeight: 5,
            }
          });

          const request = {
            origin: userLoc,
            destination: GATE_4_COORDS,
            travelMode: google.maps.TravelMode.DRIVING,
          };

          directionsService.route(request, (response, status) => {
            if (status === "OK" && response) {
              directionsRenderer.setDirections(response);
              const route = response.routes[0];
              if (route && route.legs && route.legs[0]) {
                setDistance(route.legs[0].distance?.text || null);
                setDuration(route.legs[0].duration?.text || null);
              }
            } else {
              setErrorMsg("Could not calculate directions from your location.");
            }
            setLoading(false);
          });
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to load Google Maps. Check your API key.");
        setLoading(false);
      }
    };
  }, []);

  const openInNativeMap = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${GATE_4_COORDS.lat},${GATE_4_COORDS.lng}`;
    window.open(url, '_blank');
  };

  if (errorMsg) {
    return (
      <div className="bg-neutral-900/80 border border-red-900/50 rounded-2xl p-6 text-center shadow-lg backdrop-blur-md">
        <AlertCircle className="w-8 h-8 text-red-500/70 mx-auto mb-3" />
        <p className="text-neutral-300 text-sm leading-relaxed">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500 w-full">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative h-64 w-full ring-1 ring-white/5">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/90 z-10 backdrop-blur-md">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <span className="text-sm text-neutral-400 font-medium tracking-wide">Finding optimal route...</span>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full rounded-2xl" />
      </div>

      {(distance && duration) && (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-4 ring-1 ring-white/5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-neutral-100 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" /> Travel Summary
            </h3>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">Gate 4</span>
          </div>
          <div className="grid grid-cols-2 gap-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800/80">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Est. Time</p>
              <p className="text-emerald-400 font-black text-xl tabular-nums">{duration}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Distance</p>
              <p className="text-neutral-200 font-bold text-xl tabular-nums">{distance}</p>
            </div>
          </div>
          <button 
            onClick={openInNativeMap}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
          >
            Open in Google Maps <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

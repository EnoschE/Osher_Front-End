import { useEffect, useRef, useState } from "react";
import { getAdsForFeed } from "../Services/feedService";
import { FeedAdsParams } from "../Components/Feed/Feed";
import { toast } from "react-toastify";
import { findStateFromCoords } from "../Utils/utils";

const IDLE_TIMEOUT_MINUTES = 5;

const getTimeSlot = () => new Date().getHours();

const getDay = () => new Date().toLocaleString("en-US", { weekday: "long" });

export const useGeoAdWatcher = () => {
  const watchIdRef = useRef<number | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastStateRef = useRef<string | null>(null);
  const lastTimeSlotRef = useRef<number | null>(null);
  const lastDayRef = useRef<string | null>(null);

  const [ads, setAds] = useState<Array<any>>([]);

  const fetchAds = async (params: FeedAdsParams) => {
    try {
      const response: any = await getAdsForFeed(params);
      setAds(response);
    } catch (error: any) {
      toast.error("Failed to fetch ads.");
      console.error("Error fetching ads:", error);
    }
  };

  const startWatching = () => {
    if (watchIdRef.current !== null) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;

        const state = findStateFromCoords(latitude, longitude);
        console.log("Current position:", latitude, longitude, state);

        toast.info(
          `Current position: ${latitude?.toFixed(2)}°, ${longitude?.toFixed(
            2
          )}° - State: ${state}`
        );

        const currentSlot = getTimeSlot();
        const currentDay = getDay();

        const shouldFetchAds =
          state !== lastStateRef.current ||
          currentSlot !== lastTimeSlotRef.current ||
          currentDay !== lastDayRef.current;

        if (shouldFetchAds) {
          lastStateRef.current = state;
          lastTimeSlotRef.current = currentSlot;
          lastDayRef.current = currentDay;

          fetchAds({ state, time: currentSlot, day: currentDay });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  const stopWatching = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      console.log("Stopped watching location due to inactivity.");
    }
  };

  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      stopWatching();
    }, IDLE_TIMEOUT_MINUTES * 60 * 1000);
  };

  useEffect(() => {
    const activityHandler = () => {
      resetIdleTimer();
      if (watchIdRef.current === null) startWatching();
    };

    ["click", "mousemove", "keydown", "touchstart"].forEach((event) =>
      window.addEventListener(event, activityHandler)
    );

    startWatching();
    resetIdleTimer();

    return () => {
      stopWatching();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      ["click", "mousemove", "keydown", "touchstart"].forEach((event) =>
        window.removeEventListener(event, activityHandler)
      );
    };
  }, []);

  return ads;
};

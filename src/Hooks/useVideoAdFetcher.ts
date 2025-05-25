import { useEffect, useState } from "react";
import { findStateFromCoords } from "../Utils/utils";
import { toast } from "react-toastify";
import { getVideoAd } from "../Services/feedService";

const getTimeSlot = () => new Date().getHours();
const getDay = () => new Date().toLocaleString("en-US", { weekday: "long" });

export const useVideoAdFetcher = () => {
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        const state = findStateFromCoords(latitude, longitude);
        const time = getTimeSlot();
        const day = getDay();

        try {
          const adResponse = await getVideoAd({ state, time, day });
          setAd(adResponse); // assuming it returns a single object
        } catch (error) {
          toast.error("Failed to fetch video ad.");
          console.error("Geo video ad fetch failed:", error);
        }
      },
      (error) => {
        toast.error("Failed to get location.");
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  }, []);

  return ad;
};

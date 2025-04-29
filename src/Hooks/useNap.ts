import { useRef, useState, useEffect } from "react";
import { napTime } from "../Components/PageLayout/Navbar/NapScreen";

export const useNap = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [nap, setNap] = useState(false);

  const enableNap = () => {
    setNap(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setNap(false), napTime);
  };

  const disableNap = () => setNap(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { nap, enableNap, disableNap };
};

import { useEffect, useState } from "react";

export interface windowsData {
  width: number | undefined;
  height: number | undefined;
}
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<windowsData>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  function handleResize() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  return windowSize;
}

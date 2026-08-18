import { useEffect } from "react";
import { useLocation } from "react-router";

import { captureScrollDepth } from "~/lib/analytics";

const scrollDepthThresholds = [25, 50, 75, 100] as const;

export function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const capturedThresholds = new Set<number>();
    let animationFrame = 0;

    const measureScrollDepth = () => {
      animationFrame = 0;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const percentage =
        scrollableHeight <= 0
          ? 100
          : Math.min(100, (window.scrollY / scrollableHeight) * 100);

      for (const threshold of scrollDepthThresholds) {
        if (percentage >= threshold && !capturedThresholds.has(threshold)) {
          capturedThresholds.add(threshold);
          captureScrollDepth(threshold);
        }
      }
    };

    const scheduleMeasurement = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(measureScrollDepth);
      }
    };

    window.addEventListener("scroll", scheduleMeasurement, { passive: true });
    window.addEventListener("resize", scheduleMeasurement);
    scheduleMeasurement();

    return () => {
      window.removeEventListener("scroll", scheduleMeasurement);
      window.removeEventListener("resize", scheduleMeasurement);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [location.pathname]);

  return null;
}

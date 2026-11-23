"use client";

import { useEffect, useState } from "react";

/* SitePreloader covers the viewport for at least 1.2s on the first load of a
   session, so entrance animations that run on that first mount finish behind
   the overlay without ever being seen. Skipping them there only stops the
   content from being held at opacity 0 before hydration; client-side
   navigations still animate. The flag is only ever set client-side, so the
   server render and the hydrating client render agree. */
let firstPaintDone = false;

export function useSkipMountAnimation() {
  const [skip] = useState(() => !firstPaintDone);
  useEffect(() => {
    firstPaintDone = true;
  }, []);
  return skip;
}
